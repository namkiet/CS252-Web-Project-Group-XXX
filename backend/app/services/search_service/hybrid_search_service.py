from typing import List, Dict
import json
from postgrest.exceptions import APIError
from concurrent.futures import ThreadPoolExecutor, as_completed
from functools import partial
from app.services.search_service.semantic_search_service import SemanticSearchService
from app.services.search_service.fuzzy_search_service import FuzzySearchService
from service.ollama_emb import OllamaEmb
from service.supabase import get_admin_db

class HybridSearchService:
    def __init__(self, table_name):
        self.table_name = table_name
        self.semantic = SemanticSearchService(table_name)
        self.fuzzy = FuzzySearchService(table_name)
        
        import os
        url = os.environ.get("OLLAMA_URL", "https://collotypic-pablo-unridiculous.ngrok-free.dev")
        self.llm = OllamaEmb(base_url=url, model="qwen2.5:14b")

    def _make_hashable(self, obj):
        if isinstance(obj, dict):
            return tuple(
                (k, self._make_hashable(v))
                for k, v in sorted(obj.items())
            )
        elif isinstance(obj, list):
            return tuple(self._make_hashable(v) for v in obj)
        else:
            return obj
        
    def _deduplicate(self, items: List[Dict]) -> List[Dict]:
        try:
            seen = set()
            out = []

            for i in items:
                key = (i["type"], i["restaurant_name"])
                if key not in seen:
                    seen.add(key)
                    out.append(i)
            return out
        except Exception as e:
            print(f"Error: {e}")
            return []
        
    def _verify_results(self, user_query: str, candidates: List[Dict]) -> List[Dict]:

        print(f" > Verifying {len(candidates[:8])} candidates with Agent (Parallel)...")
        verified_results = []

        def verify_single_item(doc):
            
            # print(f" > Meta : {doc}")
            dish = doc.get("dish") or {}
            res = doc.get("restaurant") or {}

            meta = doc.get("meta") or doc.get("metadata") or doc
            
            dish_name = dish.get("name", "Unknown")
            dish_price = dish.get("price", "N/A")
            dish_desc = dish.get("description", "")
            
            restaurant_name = res.get("name", "Unknown")
            restaurant_price = res.get("price_range", "N/A")
            restaurant_desc = res.get("description", "")

            prompt = f"""
            ROLE: You are a smart Search Assistant.
            
            USER CONSTRAINT: "{user_query}"
            
            ITEM TO INSPECT:
            - Dish:
                + Name: {dish_name}
                + Price: {dish_price}
                + Description: {dish_desc}
            - Restaurant:
                + Name: {restaurant_name}
                + Price Range: {restaurant_price}
                + Description: {restaurant_desc}
            
            TASK: Determine if this dish SATISFIES the user's request.
              
            INSTRUCTIONS:
            1. Analyze NEGATIVE CONSTRAINTS (e.g., "No onions", "No spicy"):
            - Search the description for *explicit* confirmation of the unwanted element.
            - If the description is silent/ambiguous, assume MATCH (Silence = MATCH).
            
            2. Check RELEVANCE:
            - Is this roughly what the user asked for?
            - If the item Name contains the core keywords of the User Query, it is a MATCH.
            - DO NOT over-analyze dish structure (e.g., Soup vs Dry, Noodle vs Dumpling). If it's the same category, MATCH.
                            
            EXAMPLES:
                - User: "No onions" | Desc: "Beef noodle soup" -> MATCH (Onions not mentioned).
                - User: "Vegetarian" | Desc: "Beef" -> NO_MATCH
                - User: "I want Pho" | Desc: "Com suon" -> NO_MATCH
                - User "Mì sủi cảo" vs Item "Sủi cảo thập cẩm" -> MATCH (Close enough).
                
            OUTPUT FORMAT:
                <reason>
                [Reasoning about ingredients, price, and alignment]
                </reason>
                <verdict>
                [MATCH or NO_MATCH]
                </verdict>
            """
            
            try:
                response = self.llm.generate_content(prompt).strip().upper()
                
                if "<verdict>" in response:
                    verdict = response.split("<verdict>")[1].split("</verdict>")[0].strip().upper()
                else:
                    verdict = response.upper()
                    
                # response = response.split()[0].strip().upper()
                if "MATCH" in verdict and "NO_MATCH" not in response:
                    return doc
                else:
                    print(f" [x] Rejected: {dish_name} of {restaurant_name} (Reason: {response})")
                    return None
            except Exception as e:
                print(f" [!] Error verifying {dish_name} of {restaurant_name}: {e}")
                return None

        with ThreadPoolExecutor(max_workers=8) as executor:
            future_to_doc = {
                executor.submit(verify_single_item, doc): doc 
                for doc in candidates[:8]
            }
            
            for future in as_completed(future_to_doc):
                result = future.result()
                if result:
                    verified_results.append(result)
                    
        return verified_results
    
    def _classify_intent(self, query: str):
        
        prompt = f"""
            Analyze this search query for a food app.
            
            Query: "{query}"
            
            Output valid JSON with:
            - "intent": One of ["SEARCH_RESTAURANT_NAME", "SEARCH_ADDRESS", "SEARCH_DISH", "SEARCH_RESTAURANT_BY_DISH", "GENERAL"]
            - "has_constraint": Boolean (True if user mentions allergy, ingredient preference, spicy/non-spicy, diet)
            - "search_term": The core item to search for (remove the constraint words).
            
            Examples:
            - "Starbucks" -> {{"intent": "SEARCH_RESTAURANT_NAME", "has_constraint": false, "search_term": "Starbucks"}}
            - "Spicy Tofu" -> {{"intent": "SEARCH_DISH", "has_constraint": true, "search_term": "Tofu"}}
            - "No peanut curry" -> {{"intent": "SEARCH_DISH", "has_constraint": true, "search_term": "Curry"}}
            - "Restaurants that have Pho" -> {{"intent" : "SEARCH_RESTAURANT_BY_DISH",  "has_constraint": false, "search_term" : "Pho"}}
        """
        try:
            res = self.llm.generate_content(prompt).strip()
            if "```json" in res:
                res = res.split("```json")[1].split("```")[0]
            return json.loads(res)
        except Exception as e:
            print(f"Error: {e}")
            return {"intent": "GENERAL", "has_constraint": False, "search_term": query}
    
    def _execute_search(self, intent: str, term: str):
        tasks = []

        try:
            if intent == "SEARCH_RESTAURANT_NAME":
                tasks = [
                    partial(self.semantic.search_restaurant_by_name, term),
                    partial(self.fuzzy.search_restaurant_by_name, term, limit=5),
                ]


            elif intent == "SEARCH_DISH":
                tasks = [
                    partial(self.semantic.search_dish_by_name, term),
                    partial(self.fuzzy.search_dish_by_name, term, limit=5),
                ]

            elif intent == "SEARCH_RESTAURANT_BY_DISH":
                tasks = [
                    partial(self.semantic.search_restaurant_by_dish, term),
                    partial(self.fuzzy.search_restaurant_by_dish, term),
                ]

            elif intent == "SEARCH_ADDRESS":
                tasks = [
                    partial(self.semantic.search_restaurant_by_address, term),
                    partial(self.fuzzy.search_restaurant_by_address, term, limit=5),
                ]

            else:
                tasks = [
                    partial(self.semantic.search_random, term),
                    partial(self.fuzzy.search_random, term, limit=5),
                ]
        except Exception as e:
            print(f"[BuildTaskError] {e}")

        return tasks

    def _enrich(self, candidates: List[Dict]) -> List[Dict]:
        try:
            db = get_admin_db()
            
            out = []
            
            for c in candidates:
                res = (
                    db.table(self.table_name)
                    .select("metadata")
                    .filter("metadata->>type", "eq", "restaurant")
                    .filter("metadata->>name", "eq", c.get("restaurant_name", "Unknown"))
                    .limit(1)
                    .execute()
                )
                
                dish = None
                if c.get("type", "") == "dish":
                    dish = (
                        db.table(self.table_name)
                        .select("metadata")
                        .filter("metadata->>type", "eq", "dish")
                        .filter("metadata->>dish_name", "eq", c.get("dish_name", ""))
                        .filter("metadata->>restaurant", "eq", c.get("restaurant_name", ""))
                        .limit(1)
                        .execute()
                    )
                out.append({
                    "type": c.get("type"),
                    "restaurant": res.data[0].get("metadata", {}) if res.data else None,
                    "dish": dish.data[0].get("metadata", {}) if dish and dish.data else None
                })
            return out
        except APIError as e:
            print(f" [!] Supabase API Error 400 Details:")
            print(f"     - Message: {e.message}")
            print(f"     - Details: {e.details}")
            print(f"     - Hint: {e.hint}")
            return []
        except Exception as e:
            print(f"Error: {e}")
            return []
    
    def search_restaurants(self, user_query: str, filters: Dict = None):
        try:
            analysis = self._classify_intent(user_query)
            
            intent = analysis.get("intent", "GENERAL").upper()
            has_constraint = analysis.get("has_constraint", False)
            clean_term = analysis.get("search_term", user_query)
            
            print(f" > Analysis: {intent} | Constraint: {has_constraint} | Term: {clean_term}")
            
            
            search_tasks = self._execute_search(intent, clean_term)
            raw_candidates = []
            
            with ThreadPoolExecutor(max_workers=4) as executor:
                futures = [executor.submit(task) for task in search_tasks]
                for future in as_completed(futures):
                    try:
                        results = future.result()
                        if results:
                            raw_candidates.extend(results)
                    except Exception as e:
                        print(f" [!] Search Task Error: {e}")
            
            
            unique_candidates = self._deduplicate(raw_candidates)
            
            enrich = self._enrich(unique_candidates)
            # enrich = enrich[:3]
            print(f" > Found {len(unique_candidates)} raw candidates")
            
            if has_constraint and unique_candidates:
                enrich = self._verify_results(user_query, enrich)
            
            return enrich
        except Exception as e:
            print(f"Error: {e}")
            return []
