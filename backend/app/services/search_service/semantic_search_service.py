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
    
    def _filter_by_type(self, docs: List[Dict], doc_type: str) -> List[Dict]:
        results = []
        for doc in docs:
            meta = doc.get("metadata", {})
            if meta.get("type") == doc_type:
                results.append(self._normalize_doc(doc))
        return results
    
    def normalize_text(self, text: str) -> str:
        if not text:
            return ""

        text = text.lower()
        
        text = unicodedata.normalize('NFD', text)
        text = re.sub(r'[\u0300-\u036f]', '', text)
        text = unicodedata.normalize('NFC', text)
        
        return text.strip()
    
    def _normalize_doc(self, doc: Dict) -> Dict:
        if "meta" in doc or "metadata" in doc:
            return doc
        return {
            "metadata": {
                "name": doc.get("restaurant") or doc.get("name"),
                "description": doc.get("description"),
                "price": doc.get("price"),
            }
        }
    
    def search_restaurant_by_name(self, name: str):
        docs = self._semantic_search(
            query=f"Restaurant: {name}",
            threshold=0.6
        )
        return self._filter_by_type(docs, "restaurant")
    
    def search_dish_by_name(self, name: str):
        docs = self._semantic_search(
            query=f"Dish: {name}",
            threshold=0.6
        )
        return self._filter_by_type(docs, "dish")

    def search_restaurant_by_address(self, address: str):
        docs = self._semantic_search(
            query=f"Address: {address}",
            threshold=0.6
        )
        return self._filter_by_type(docs, "restaurant")
    
    # def search_restaurant_by_rating(self, rating):
    #     docs = self._semantic_search(
    #         query=f"rating {rating}",
    #         threshold=0.6
    #     )
    #     return self._filter_by_type(docs, "restaurant")
    
    # def search_dish_by_price(self, price):
    #     docs = self._semantic_search(
    #         query=f"price {price}",
    #         threshold=0.6
    #     )
    #     return self._filter_by_type(docs, "dish")
    
    def search_restaurant_by_dish(self, query: str):
        docs = self._semantic_search(
            query=f"dish {query}",
            threshold=0.55
        )

        results = []
        for doc in docs:
            meta = doc.get("metadata", {})
            if meta.get("type") == "dish":
                results.append({
                    "restaurant": meta.get("restaurant"),
                    "dish": meta.get("dish_name"),
                    "description": meta.get("description"),
                    "price": meta.get("price")
                })

        return results
    
    def search_random(self, query: str):
        """
            Agentic Fall back
        """
        docs = self._semantic_search(query, threshold=0.6)
        return (
            self._filter_by_type(docs, "restaurant")
            + self._filter_by_type(docs, "dish")
        )
    
    def search_restaurants(self, user_query: str):
        return (
            self.search_restaurant_by_name(user_query) 
            + self.search_restaurant_by_address(user_query) 
            + self.search_random(user_query)
            + self.search_restaurant_by_dish(user_query)
        )