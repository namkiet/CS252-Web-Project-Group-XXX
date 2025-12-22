from supabase import Client

from service.supabase import get_admin_db
from service.vector_store import VectorStore
from service.ollama_emb import OllamaEmb
import os

class EmbeddingService:
    
    def __init__(self):
        URL = os.environ.get("OLLAMA_URL", "https://collotypic-pablo-unridiculous.ngrok-free.dev")
        self.model = OllamaEmb(base_url = URL, model="nomic-embed-text")
    
    def embed_text(self, text):
        vector = self.model.embed(prompt=text)

        if not isinstance(vector, list) or len(vector) != 768:
            raise ValueError("Invalid embedding vector")

        return vector
            
