from supabase import Client

from service.supabase import get_admin_db
from service.vector_store import VectorStore
from service.ollama_emb import OllamaEmb


class EmbeddingService:
    
    def __init__(self):
        URL = "https://collotypic-pablo-unridiculous.ngrok-free.dev"
        self.embed_model = OllamaEmb(base_url = URL)
    
    def embed_text(self, text):
        vector = self.model.embed(prompt=text)

        if not isinstance(vector, list) or len(vector) != 768:
            raise ValueError("Invalid embedding vector")

        return vector
            
