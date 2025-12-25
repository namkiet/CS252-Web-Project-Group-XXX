import unicodedata
import re

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
        try:
            key = self.normalize_text(name)
            db = get_admin_db()
            
            res = (
                db.table(self.table_name)
                .select("metadata")
                .eq("metadata->>type", "restaurant")
                .filter("metadata->>name", "ilike", f"%{key}%")
                .limit(limit)
                .execute()
            )

            return [
                {
                    "type": "restaurant",
                    "restaurant_name": r.get("name", "Unknown"),
                    "dish_name": None
                }
                for r in (res.data or [])
            ]
        except Exception as e:
            print(f"Error: {e}")
            return []
    
    def search_dish_by_name(self, query: str, limit: int = 10):
        try:
            key = self.normalize_text(query)
            db = get_admin_db()
            
            res = (
                db.table(self.table_name)
                .select("metadata")
                .filter("metadata->>type", "eq", "dish")
                .filter("metadata->>dish_name", "ilike", f"%{key}%")
                .limit(limit)
                .execute()
            )

            return [
                {
                    "type": "dish",
                    "dish_name": r.get("dish_name", "Unknown"),
                    "restaurant_name": r.get("restaurant", "Unknown")
                }
                for r in (res.data or [])
            ]
        except Exception as e:
            print(f"Error: {e}")
            return []

    def search_restaurant_by_address(self, query: str, limit: int = 10):
        try:
            key = self.normalize_text(query)
            db = get_admin_db()
            
            res = (
                db.table(self.table_name)
                .select("metadata")
                .eq("metadata->>type", "restaurant")
                .ilike("metadata->>address", f"%{key}%")
                .limit(limit)
                .execute()
            )

            return [
                {
                    "type": "restaurant",
                    "restaurant_name": r.get("name", "Unknown"),
                    "dish_name": None
                }
                for r in (res.data or [])
            ]
        except Exception as e:
            print(f"Error: {e}")
            return []
        
    def search_restaurant_by_dish(self, dish_query: str, limit: int = 10):
        return self.search_dish_by_name(dish_query, limit)
    
    def search_random(self, query: str, limit: int = 10):
        """
            Agentic Fall back
        """
        try:
            key = self.normalize_text(query)
            db = get_admin_db()
            
            res = (
                db.table(self.table_name)
                .select("metadata")
                .or_(
                    f"metadata->>name.ilike.%{key}%,"
                    f"metadata->>dish_name.ilike.%{key}%,"
                    f"metadata->>restaurant.ilike.%{key}%,"
                    f"metadata->>address.ilike.%{key}%"
                )
                .limit(limit)
                .execute()
            )

            out = []
            for r in res.data or []:
                meta = r.get("metadata", "")
                if meta.get("type", "") == "restaurant":
                    out.append({
                        "type": "restaurant",
                        "restaurant_name": meta.get("name", ""),
                        "dish_name": None
                    })
                else:
                    out.append({
                        "type": "dish",
                        "dish_name": meta.get("dish_name", ""),
                        "restaurant_name": meta.get("restaurant", "")
                    })
            return out
        except Exception as e:
            print(f"Error: {e}")
            return []
    
    def search_restaurants(self, user_query: str, limit: int = 3):
        return (
            self.search_restaurant_by_name(user_query, limit) 
            + self.search_restaurant_by_address(user_query, limit) 
            + self.search_random(user_query, limit)
            + self.search_restaurant_by_dish(user_query, limit)
        )