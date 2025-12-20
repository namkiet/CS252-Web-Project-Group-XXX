from supabase import Client

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
        query = (
            db_client
            .table(self.vector_store.table_name)
            .select("id")
            .eq("metadata->>type", "restaurant")
            .eq("metadata->>name", name)
            .limit(1)
        )

        if url:
            query = query.eq("metadata->>url", url)

        res = query.execute()
        return bool(res.data)

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
            url = res.get('url', "")
            dishes = res.get('dishes', [])
            
            if self._check_restaurant_exists(db_client, name, url):
                print(f"SKIP {name} (already exists)\n")
                continue
                
            print(f"Generating AI Summary for: {name}...")
            ai_description = self.summarizer.generate_restaurant_summary(res)
            print(f" > Summary: {ai_description[:100]}...")
            
            text = (
                f"Restaurant: {name}. "
                # f"Address: {address}. "
                # f"Rating: {rating}. "
                f"Description: {ai_description}"
            )
            
            self._save(db_client, text, {
                "type": "restaurant",
                "name": name,
                "address": address,
                "img_src": res.get("img_src", ""),
                "url" : url,
                "description": ai_description,
                "source": "json_upload"
            })
            print(f"ADD {name}\n")
            
            
            for dish in dishes:
                dish_name = dish.get('name', "")
                dish_price = dish.get('price', "")
                
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
            