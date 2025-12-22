from typing import List, Dict
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
        unique_results = []
        
        for doc in results:
            meta = doc.get('meta') or doc.get('metadata') or doc
            name = meta.get('name') or meta.get('dish_name')
            
            if name and name not in seen:
                seen.add(name)
                unique_results.append(doc)
        
        return unique_results

    def search_restaurants(self, user_query: str, filters: Dict = None):
        
        print(f" > Running Semantic Search for: {user_query}")
        semantic_docs = self.semantic.search_restaurant_by_name(user_query)
        
        try:
            print(f" > Running Fuzzy Search for: {user_query}")
            fuzzy_docs = self.fuzzy.search_restaurant_by_name(user_query, limit=5)
        except:
            fuzzy_docs = []
            print("WARNING: THERE IS SOMETHING WRONG WITH FUZZY SEARCH")

        raw_candidates = self._deduplicate(semantic_docs + fuzzy_docs)
        print(f" > Found {len(raw_candidates)} unique candidates.")

        needs_verification = any(w in user_query.lower() for w in ["no ", "not ", "free", "avoid", "allergy", "dị ứng", "không", "đừng"])
        
        if needs_verification:
            return self._verify_results(user_query, raw_candidates)
        
        return raw_candidates

    def _verify_results(self, user_query, candidates):
        print(" > verifying results with Agent...")
        verified_results = []
        
        for doc in candidates[:8]:
            meta = doc.get('meta') or doc.get('metadata') or doc
            
            ai_desc = meta.get('ai_description') or meta.get('description', '')
            name = meta.get('name') or meta.get('dish_name')
            
            prompt = f"""
            User Query: "{user_query}"
            Item: {name}
            Description: {ai_desc}
            
            Task: Does this item satisfy the user's constraints?
            - If user says "No Spicy" and Description says "Spicy", return FALSE.
            - If user says "Peanut Allergy" and Description says "Contains Peanuts", return FALSE.
            - Otherwise, return TRUE.
            
            ANSWER (TRUE/FALSE):
            """
            
            response = self.llm.generate_content(prompt).strip().upper()
            
            if "TRUE" in response:
                verified_results.append(doc)
            else:
                print(f" Agent rejected: {name} (Violates constraint)")
                
        return verified_results