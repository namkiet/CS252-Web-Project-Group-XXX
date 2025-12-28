from supabase import Client
import unicodedata
import re

from service.supabase import get_admin_db
from service.vector_store import VectorStore
from service.ollama_emb import OllamaEmb
from service.embedding_service import EmbeddingService
from service.summary import Summary

class Ingestor:
    
    def __init__(self, table_name):
        self.vector_store = VectorStore(table_name = table_name)
        self.embedder = EmbeddingService()
        self.summarizer = Summary()
        # URL = "https://collotypic-pablo-unridiculous.ngrok-free.dev"
        # self.embed_model = OllamaEmb(base_url = URL)
    
    def normalize_text(self, text: str) -> str:
        if not text:
            return ""

        text = text.lower()
        
        text = unicodedata.normalize('NFD', text)
        text = re.sub(r'[\u0300-\u036f]', '', text)
        text = unicodedata.normalize('NFC', text)
        
        return text.strip()
    
    def _embed_text(self, text):
        try:
            return self.embedder.embed_text(text)
        except Exception as e:
            print(f"Ingestor Embed text error: {e}")
            return []
    
    def _save(self, db_client : Client, text, metadata = None):
        try:
            vector = self._embed_text(text)
            if not vector:
                print(f"Ingestor save no vector")
                return
            
            if not isinstance(vector, list) or len(vector) != 768:
                print("Invalid embedding vector")
                return
            
            self.vector_store.add_vector(db_client, text, vector, metadata)
            
        except Exception as e:
            print(f"Ingestor save error: {e}")
    
    def _check_restaurant_exists(self, db_client: Client, name: str, url: str = "") -> bool:
        nname = self.normalize_text(name)
        query = (
            db_client
            .table(self.vector_store.table_name)
            .select("id")
            .filter("metadata->>type", "eq", "restaurant")
            .filter("metadata->>name", "eq", nname)
            .limit(1)
        )

        if url:
            query = query.filter("metadata->>url", "eq", url)

        res = query.execute()
        return bool(res.data)

    def _calculate_price_range(self, dishes: list) -> str:
        if not dishes:
            return "Unknown"
        
        prices = []
        for dish in dishes:
            raw_price = str(dish.get('price', ''))
            clean_str = re.sub(r'[^\d]', '', raw_price) 
            if clean_str:
                try:
                    prices.append(int(clean_str))
                except ValueError:
                    continue
        
        if not prices:
            return "Unknown"
            
        min_price = min(prices)
        max_price = max(prices)
        
        if min_price == max_price:
            return f"{min_price}"
        
        return f"{min_price} - {max_price}"
    
    def process(self, restaurants):
        if not restaurants:
            print("No data received in process()")
            return
        
        db_client = get_admin_db()
        
        count = 0
        print("----Processing---\n")
        for res in restaurants:
            raw_name = res.get('name', "Unknown")
            address = res.get('address', "Unknown")
            rating = res.get('ratings', "N/A")
            url = res.get('url', "")
            dishes = res.get('dishes', [])
            
            name = self.normalize_text(raw_name)
            
            if self._check_restaurant_exists(db_client, name, url):
                print(f"SKIP {name} (already exists)\n")
                continue
                
            print(f"Generating AI Summary for: {name}...")
            ai_description = self.summarizer.generate_restaurant_summary(res)
            print(f" > Summary: {ai_description[:100]}...")
            
            price_range = self._calculate_price_range(dishes)
            text = (
                f"Restaurant: {name}. "
                f"Address: {address}. "
                # f"Rating: {rating}. "
                f"Description: {ai_description}"
            )
            
            self._save(db_client, text, {
                "raw_name" : raw_name,
                "type": "restaurant",
                "name": name,
                "address": address,
                "img_src": res.get("img_src", ""),
                "price_range": price_range,
                "url" : url,
                "description": ai_description,
                "source": "json_upload"
            })
            print(f"ADD {name}\n")
            
            for dish in dishes:
                raw_dish_name = dish.get('name', "")
                dish_price = dish.get('price', "")
                
                dish_name = self.normalize_text(raw_dish_name)
                
                print(f"Generating AI Summary for (DISH): {name}...")
                ai_description_dish = self.summarizer.generate_dish_summary(dish, res)
                print(f" > Summary: {ai_description_dish[:100]}...")
            
                dish_text = (
                    f"Dish: {dish_name}. "
                    # f"Price: {dish_price}. "
                    # f"Served at: {name} ({address}). "
                    # f"Restaurant's rating: {rating}."
                    f"Description: {ai_description_dish}"
                )
                
                self._save(db_client, dish_text, {
                    "raw_dish_name": raw_dish_name,
                    "type": "dish",
                    "dish_name": dish_name,
                    "restaurant": name,
                    "price": dish_price,
                    "description": ai_description_dish,
                    "img_src": dish.get("img_src"),
                    "source": "json_upload"
                })
                count += 1
                print(f"ADD {name} and {dish_name}\n")
        print(f"Adding {count} res into DB")      
            