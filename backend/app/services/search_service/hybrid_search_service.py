from typing import List, Dict
from app.services.search_service.semantic_search_service import SemanticSearchService
from app.services.search_service.fuzzy_search_service import FuzzySearchService
from service.ollama_emb import OllamaEmb

class HybridSearchService:
    def __init__(self):
        self.semantic = SemanticSearchService()
        self.fuzzy = FuzzySearchService()
        
        import os
        url = os.environ.get("OLLAMA_URL", "https://your-ngrok-url.ngrok-free.app")
        self.llm = OllamaEmb(base_url=url, model="qwen2.5:14b")

    def _deduplicate(self, results: List[Dict]) -> List[Dict]:
        """
        Merges results from Fuzzy and Semantic search, removing duplicates by ID/Name.
        """
        seen = set()
        unique_results = []
        
        for doc in results:
            # Normalize structure between your two services
            # Assuming both return objects with a 'meta' or 'metadata' key
            meta = doc.get('meta') or doc.get('metadata') or doc
            name = meta.get('name') or meta.get('dish_name')
            
            if name and name not in seen:
                seen.add(name)
                unique_results.append(doc)
        
        return unique_results

    def search_restaurants(self, user_query: str, filters: Dict = None):
        """
        Step 1: HYBRID RETRIEVAL (Get broad candidates)
        """
        # A. Run Semantic Search (Good for "Vibes" and "Cuisine types")
        print(f" > Running Semantic Search for: {user_query}")
        semantic_docs = self.semantic.search_restaurant_by_name(user_query)
        
        # B. Run Fuzzy Search (Good for specific names/locations)
        print(f" > Running Fuzzy Search for: {user_query}")
        fuzzy_docs = self.fuzzy.search_restaurant_by_name(user_query, limit=5)
        
        # C. Merge Results
        raw_candidates = self._deduplicate(semantic_docs + fuzzy_docs)
        print(f" > Found {len(raw_candidates)} unique candidates.")

        """
        Step 2: AGENTIC VERIFICATION (The "No Spicy" Filter)
        If the query contains negative constraints, we must check the AI Description.
        """
        # Only trigger heavy LLM verification if query implies a constraint
        # Simple heuristic: longer queries or keywords like "no", "not", "allergy"
        needs_verification = any(w in user_query.lower() for w in ["no ", "not ", "free", "avoid", "allergy"])
        
        if needs_verification:
            return self._verify_results(user_query, raw_candidates)
        
        return raw_candidates

    def _verify_results(self, user_query, candidates):
        print(" > verifying results with Agent...")
        verified_results = []
        
        for doc in candidates[:8]: # Limit to top 8 to save time
            meta = doc.get('meta') or doc.get('metadata') or doc
            
            # 1. Get the AI Description we generated during ingestion
            ai_desc = meta.get('ai_description') or meta.get('description', '')
            name = meta.get('name') or meta.get('dish_name')
            
            # 2. Ask LLM to check valididity
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
            
            # This is a synchronous call, might be slow. In production, use threading.
            response = self.llm.generate_content(prompt).strip().upper()
            
            if "TRUE" in response:
                verified_results.append(doc)
            else:
                print(f" Agent rejected: {name} (Violates constraint)")
                
        return verified_results