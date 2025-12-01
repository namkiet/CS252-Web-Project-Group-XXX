from Backend.app.agents.tools.sub_tools.RankerSystem.Embedder.embeddingManager import EmbeddingManager
from Backend.app.agents.tools.sub_tools.RankerSystem.DataGeneratePack.genUtility import generate_food_dataset, generate_rag_queries, generate_dual_rag_queries
from Backend.app.agents.tools.sub_tools.RankerSystem.Reranker.rerankManager import RerankManager
from Backend.app.agents.tools.sub_tools.RankerSystem.AIType.GPTModel import GPTModel
from dotenv import load_dotenv
load_dotenv()


class AI_Manager:
    def __init__(self, data = None, out_dir = None, Warning = True, embed_path="data/embedding.pkl", model="text-embedding-3-small"):
        self.__model = GPTModel(data, out_dir, Warning, embed_path, model)

    def create_embedding(self, save_mode=True):
        self.__model.create_embedding(save_mode)

    def search(self, prompt, top_k_RAG, top_k_rerank, RAG_combine_mode = "score_sum", Rerank_mode = "similarity"):
       return self.__model.search(prompt, top_k_RAG, top_k_rerank, RAG_combine_mode, Rerank_mode)
    
    def dual_search(self, prompt, top_k, Rerank_mode = "similarity"):
        return self.__model.dual_search(prompt, top_k, Rerank_mode)

    def Generator(self, n):
        return generate_food_dataset(20)