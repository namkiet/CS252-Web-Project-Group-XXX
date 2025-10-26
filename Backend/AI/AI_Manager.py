from Backend.AI.Embedder.embeddingManager import EmbeddingManager
from Backend.AI.DataGeneratePack.genUtility import generate_food_dataset, generate_rag_queries
from Backend.AI.Reranker.rerankManager import RerankManager

from dotenv import load_dotenv
load_dotenv()


class AI_Manager:
    def __init__(self, data = None, out_dir = None, Warning = True, embed_path="data/embedding.pkl", model="text-embedding-3-small"):
        self.__embedManager = EmbeddingManager(data, out_dir, Warning, embed_path, model)
        self.Warning = Warning
        self.__rerankManager = RerankManager()

    def create_embedding(self, save_mode=True):
        self.__embedManager.create_embedding(save_mode)

    def search(self, prompt, top_k_RAG, top_k_rerank, RAG_combine_mode = "score_sum", Rerank_mode = "similarity"):
        promptList = generate_rag_queries(prompt)
        data_RAG = self.__embedManager.search(promptList, top_k_RAG, RAG_combine_mode)
        data_rerank = self.__rerankManager.rerank(data_RAG, prompt, top_k_rerank, Rerank_mode)
        return data_rerank
    
    def Generator(self, n):
        return generate_food_dataset(20)