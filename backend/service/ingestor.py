from supabase import Client

from service.supabase import get_admin_db
from service.vector_store import VectorStore
from service.ollama_emb import OllamaEmb
class Ingestor:
    
    def __init__(self):
        self.vector_store = VectorStore()
        URL = "https://collotypic-pablo-unridiculous.ngrok-free.dev"
        self.embed_model = OllamaEmb(base_url = URL)
        
    def _embed_text(self, text):
        try:
            vector = self.embed_model.embed(prompt=text)
            return vector
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
        
    def process(self, restaurants):
        if not restaurants:
            print("No data received in process()")
            return
        
        db_client = get_admin_db()
        
        count = 0
        print("----Processing---\n")
        for res in restaurants:
            name = res.get('name', "Unknown")
            address = res.get('address', "Unknown")
            rating = res.get('ratings', "N/A")
            
            text = (
                f"Restaurant: {name}. "
                f"Address: {address}. "
                f"Rating: {rating}. "
            )
            
            self._save(db_client, text, {
                "type": "restaurant",
                "name": name,
                "address": address,
                "img_src": res.get("img_src", ""),
                "source": "json_upload"
            })
            print(f"ADD {name}\n")
            dishes = res.get('dishes', [])
            
            for dish in dishes:
                dish_name = dish.get('name', "")
                dish_price = dish.get('price', "")
                
                dish_text = (
                    f"Dish: {dish_name}. "
                    f"Price: {dish_price}. "
                    f"Served at: {name} ({address}). "
                    f"Restaurant's rating: {rating}."
                )
                
                self._save(db_client, dish_text, {
                    "type": "dish",
                    "dish_name": dish_name,
                    "restaurant": name,
                    "price": dish_price,
                    "img_src": dish.get("img_src"),
                    "source": "json_upload"
                })
                count += 1
                print(f"ADD {name} and {dish_name}\n")
        print(f"Adding {count} res into DB")      
            