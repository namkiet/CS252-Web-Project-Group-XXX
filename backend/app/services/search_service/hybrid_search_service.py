from typing import List, Dict
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from functools import partial
from app.services.search_service.semantic_search_service import SemanticSearchService
from app.services.search_service.fuzzy_search_service import FuzzySearchService
from service.ollama_emb import OllamaEmb

class HybridSearchService:
    def __init__(self, table_name):
        self.table_name = table_name
        self.semantic = SemanticSearchService(table_name)
        self.fuzzy = FuzzySearchService(table_name)
        
        import os
        url = os.environ.get("OLLAMA_URL", "https://collotypic-pablo-unridiculous.ngrok-free.dev")
        self.llm = OllamaEmb(base_url=url, model="qwen2.5:14b")

    def _deduplicate(self, results: List[Dict]) -> List[Dict]:
        seen = set()
        unique = []

        for doc in results:
            meta = doc.get("meta") or doc.get("metadata") or doc
            key = (
                meta.get("type", "Unknown"),
                meta.get("name") or meta.get("dish_name") or meta.get("raw_name"),
                meta.get("restaurant", "")
            )

            if key not in seen:
                seen.add(key)
                unique.append(doc)

        return unique

    def _verify_results(self, user_query: str, candidates: List[Dict]) -> List[Dict]:

        print(f" > Verifying {len(candidates[:8])} candidates with Agent (Parallel)...")
        verified_results = []

        def verify_single_item(doc):
            
            print(f"> Meta : {doc}")
            meta = doc.get("meta") or doc.get("metadata") or doc
            
            name = meta.get("restaurant") or meta.get("name") or meta.get("dish_name", "Unknown")
            desc = meta.get("ai_description") or meta.get("description", "")
            dish_price = meta.get("price", "N/A")
            restaurant_price = meta.get("price_range", "N/A")

            prompt = f"""
            ROLE: You are a smart Search Assistant.
            
            USER CONSTRAINT: "{user_query}"
            
            ITEM TO INSPECT:
            - Name: {name}
            - Description: {desc}
            - Dish Price: {dish_price}
            - Restaurant Price Range: {restaurant_price}
            
            TASK: Determine if this dish SATISFIES the user's request.
              
            INSTRUCTIONS:
            1. Analyze NEGATIVE CONSTRAINTS (e.g., "No onions", "No spicy"):
            - Search the description for *explicit* confirmation of the unwanted element.
            - If the description is silent/ambiguous, assume MATCH (Silence = MATCH).
            
            2. Analyze POSITIVE CONSTRAINTS (e.g., "Must be Halal", "Cheap", "Spicy"):
            - Check for direct contradictions (e.g. User wants "Spicy", Item is "Sweet").
            - Check for price violations.
            - If silent, assume MATCH.
            
            3. THINK FIRST:
            - Write out your reasoning step-by-step inside <thinking> tags.
            - Only after thinking, provide the final status inside <verdict> tags.
            
            4. Check RELEVANCE:
            - Is this roughly what the user asked for?
                
            EXAMPLES:
                - User: "No onions" | Desc: "Beef noodle soup" -> MATCH (Onions not mentioned).
                - User: "No onions" | Desc: "Beef soup with scallions and onions" -> NO_MATCH.
                - User: "Vegetarian" | Desc: "Tofu stir fry" -> MATCH.
                - User: "Vegetarian" | Desc: "Beef" -> NO_MATCH
                - User: "I want Pho" | Desc: "Com suon" -> NO_MATCH
                
            OUTPUT FORMAT:
                <thinking>
                [Reasoning about ingredients, price, and alignment]
                </thinking>
                <verdict>
                [MATCH or NO_MATCH]
                </verdict>
            """
            
            try:
                response = self.llm.generate_content(prompt).strip().upper()
                
                # response = response.split()[0].strip().upper()
                if "MATCH" in response and "NO_MATCH" not in response:
                    return doc
                else:
                    print(f" [x] Rejected: {name} (Reason: {response})")
                    return None
            except Exception as e:
                print(f" [!] Error verifying {name}: {e}")
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
                tasks.append(partial(
                    self.semantic.search_restaurant_by_name, term
                ))
                tasks.append(partial(
                    self.fuzzy.search_restaurant_by_name, term, limit=5
                ))

            elif intent == "SEARCH_DISH":
                tasks.append(partial(
                    self.semantic.search_dish_by_name, term
                ))
                tasks.append(partial(
                    self.fuzzy.search_dish_by_name, term, limit=5
                ))

            elif intent == "SEARCH_RESTAURANT_BY_DISH":
                tasks.append(partial(
                    self.semantic.search_restaurant_by_dish, term
                ))
                tasks.append(partial(
                    self.fuzzy.search_restaurant_by_dish, term
                ))

            elif intent == "SEARCH_ADDRESS":
                tasks.append(partial(
                    self.semantic.search_restaurant_by_address, term
                ))
                tasks.append(partial(
                    self.fuzzy.search_restaurant_by_address, term, limit=5
                ))

            else:
                tasks.append(partial(
                    self.semantic.search_random, term
                ))
                tasks.append(partial(
                    self.fuzzy.search_random, term, limit=5
                ))

        except Exception as e:
            print(f"[BuildTaskError] {e}")

        return tasks

    
    
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
            
            print(f" > Found {len(unique_candidates)} raw candidates")
            
            if has_constraint and unique_candidates:
                return self._verify_results(user_query, unique_candidates)
            
            return unique_candidates
        except Exception as e:
            print(f"Error: {e}")
            return []
