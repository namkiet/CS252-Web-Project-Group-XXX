from supabase import Client

from typing import List

class VectorStore:
    
    def __init__(self, table_name):
        self.table_name = table_name
        self.match = f"match_{self.table_name}"
        # self.table_name = "documents"
        return
    
    def add_vector(self, db_client : Client, content, 
                   vector : List[float], metadata = None):
        try:
            payload = {
                "content" : content,
                "embedding" : vector,
                "metadata" : metadata or {}
            }
            response = db_client.table(self.table_name).insert(payload).execute()
            
            if response.data:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Vector Store Adding Error: {e}")
            return None
        
    def search_similar(self, db_client: Client, query_vector : list, limit: int = 5, threshold: float = 0.5):
        try:
            params = {
                "query_embedding": query_vector,
                "match_threshold": threshold,
                "match_count": limit
            }
            
            response = db_client.rpc(self.match, params).execute()
            return response.data
            
        except Exception as e:
            print(f"Vector Store Searching Error: {e}")
            return []