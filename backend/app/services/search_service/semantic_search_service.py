from typing import List, Dict
import unicodedata
import re

from service.vector_store import VectorStore
from service.embedding_service import EmbeddingService
from service.supabase import get_admin_db


class SemanticSearchService:
    """
        Tool for searching:
        - Restaurant / Dish / Address / Rating / Price
        - Fall back search
    """
    
    def __init__(self, table_name):
        self.store = VectorStore(table_name)
        self.embedder = EmbeddingService()

    def _semantic_search(self, query: str, threshold: float, limit: int = 8):
        query = self.normalize_text(query)
        query_vector = self.embedder.embed_text(query)
        db = get_admin_db()
        
        return self.store.search_similar(
            db,
            query_vector,
            limit=limit,
            threshold=threshold
        )
    
    def normalize_text(self, text: str) -> str:
        if not text:
            return ""

        text = text.lower()
        
        text = unicodedata.normalize('NFD', text)
        text = re.sub(r'[\u0300-\u036f]', '', text)
        text = unicodedata.normalize('NFC', text)
        
        return text.strip()
    
    def search_restaurant_by_name(self, name: str):
        try:
            name = self.normalize_text(name)
            docs = self._semantic_search(
                query=f"Restaurant: {name}",
                threshold=0.7
            )

            results = []
            for d in docs:
                meta = d.get("metadata", {})
                if meta.get("type") == "restaurant":
                    results.append({
                        "type": "restaurant",
                        "restaurant_name": meta.get("name", "Unknown"),
                        "dish_name": None
                    })
            return results
        except Exception as e:
            print(f"Error: {e}")
            return []
        
    def search_dish_by_name(self, name: str):
        try:
            name = self.normalize_text(name)
            docs = self._semantic_search(
                query=f"Dish: {name}",
                threshold=0.7
            )
            
            results = []
            for d in docs:
                meta = d.get("metadata", {})
                if meta.get("type") == "dish":
                    results.append({
                        "type": "dish",
                        "dish_name": meta.get("dish_name", "Unknown"),
                        "restaurant_name": meta.get("restaurant", "Unknown")
                    })
            return results
        except Exception as e:
            print(f"Error: {e}")
            return []

    def search_restaurant_by_address(self, address: str):
        try:
            address = self.normalize_text(address)
            docs = self._semantic_search(
                query=f"Address: {address}",
                threshold=0.6
            )
            
            results = []
            for d in docs:
                meta = d.get("metadata", "")
                if meta.get("type") == "restaurant":
                    results.append({
                        "type": "restaurant",
                        "restaurant_name": meta.get("name", "Unknown"),
                        "dish_name": None
                    })
            return results
        except Exception as e:
            print(f"Error: {e}")
            return []

    def search_restaurant_by_dish(self, query: str):
        return self.search_dish_by_name(query)
    
    def search_random(self, query: str):
        """
            Agentic Fall back
        """
        try:
            query = self.normalize_text(query)
            docs = self._semantic_search(query, threshold=0.6)

            return (
                self._filter_by_type(docs, "restaurant")
                + self._filter_by_type(docs, "dish")
            )
        except Exception as e:
            print(f"Error: {e}")
            return []
        
    def search_restaurants(self, user_query: str):
        return (
            self.search_restaurant_by_name(user_query) 
            + self.search_restaurant_by_address(user_query) 
            + self.search_random(user_query)
            + self.search_restaurant_by_dish(user_query)
        )