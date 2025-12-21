from typing import List, Dict
import unicodedata
import re

from service.vector_store import VectorStore
from service.embedding_service import EmbeddingService
from service.supabase import get_admin_db


class FuzzySearchService:
    """
        Tool for fuzzy - searching:
        - Restaurant / Dish / Address / Rating / Price
        - Fall back 
    """
    def __init__(self, table_name):
        self.table_name = table_name
        
    def normalize_text(self, text: str) -> str:
        if not text:
            return ""

        text = text.lower()
        
        text = unicodedata.normalize('NFD', text)
        text = re.sub(r'[\u0300-\u036f]', '', text)
        text = unicodedata.normalize('NFC', text)
        
        return text.strip()
    
    def search_restaurant_by_name(self, name: str, limit: int = 10):
        key = self.normalize_text(name)
        db = get_admin_db()
        
        res = (
            db.table(self.table_name)
            .select("*")
            .eq("metadata->>type", "restaurant")
            .or_(
                f"metadata->>name.ilike.%{key}%,"
                f"metadata->>address.ilike.%{key}%"
            )
            .limit(limit)
            .execute()
        )

        return res.data or []
    
    def search_dish_by_name(self, query: str, limit: int = 10):
        key = self.normalize_text(query)
        db = get_admin_db()
        
        res = (
            db.table(self.table_name)
            .select("*")
            .eq("metadata->>type", "dish")
            .or_(
                f"metadata->>dish_name.ilike.%{key}%,"
                f"metadata->>restaurant.ilike.%{key}%"
            )
            .limit(limit)
            .execute()
        )

        return res.data or []

    def search_restaurant_by_address(self, query: str, limit: int = 10):
        key = self.normalize_text(query)
        db = get_admin_db()
        
        res = (
            db.table(self.table_name)
            .select("*")
            .eq("metadata->>type", "restaurant")
            .ilike("metadata->>address", f"%{key}%")
            .limit(limit)
            .execute()
        )

        return res.data or []
    
    # def search_restaurant_by_rating(self, query, limit: int = 10):
    #     key = self.normalize_text(str(query))
    #     db = get_admin_db()
        
    #     res = (
    #         db.table("documents")
    #         .select("*")
    #         .eq("metadata->>type", "restaurant")
    #         .ilike("metadata->>rating", f"%{key}%")
    #         .limit(limit)
    #         .execute()
    #     )

    #     return res.data or []
    
    # def search_dish_by_price(self, query, limit: int = 10):
    #     key = self.normalize_text(str(query))
    #     db = get_admin_db()
        
    #     res = (
    #         db.table("documents")
    #         .select("*")
    #         .eq("metadata->>type", "dish")
    #         .ilike("metadata->>price", f"%{key}%")
    #         .limit(limit)
    #         .execute()
    #     )

    #     return res.data or []
    
    def search_random(self, query: str, limit: int = 10):
        """
            Agentic Fall back
        """
        
        key = self.normalize_text(query)
        db = get_admin_db()
        
        res = (
            db.table("documents")
            .select("*")
            .or_(
                f"metadata->>name.ilike.%{key}%,"
                f"metadata->>dish_name.ilike.%{key}%,"
                f"metadata->>restaurant.ilike.%{key}%,"
                f"metadata->>address.ilike.%{key}%"
            )
            .limit(limit)
            .execute()
        )

        return res.data or []