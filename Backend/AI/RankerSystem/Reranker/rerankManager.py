from Backend.AI.RankerSystem.Reranker.Utility import rerank_withReason, rerank, rerank_withSimilarity
from Backend.AI.RankerSystem.Reranker.Component.GPT import GPTRerank

class RerankManager:
    def __init__(self):
        self.__history = []
        self.reranker = GPTRerank()

    def rerank(self, data, prompt, top_k = 5, mode = "similarity", column = "combined"):
        return self.reranker.rerank(data, prompt, top_k, mode, column)
    
