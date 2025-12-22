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
        meta = doc.get("metadata", {})
        return {
            "description": meta.get("description"),
            "meta": meta
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
    
    def search_random(self, query: str):
        """
            Agentic Fall back
        """
        docs = self._semantic_search(query, threshold=0.6)
        return {
            "Restaurants": self._filter_by_type(docs, "restaurant"),
            "Dishes": self._filter_by_type(docs, "dish")
        }