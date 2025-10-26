from Backend.AI.Embedder.embeddingManager import EmbeddingManager
import pandas as pd 
from dotenv import load_dotenv
from Backend.AI.Reranker.Utility import rerank
load_dotenv()
data = pd.read_csv("data/vietnam_local_foods.csv")

embManager = EmbeddingManager(data=data)

data = embManager.search(["Đồ ăn lạnh"], 50, "score_mean")

data = rerank(data, "Tôi muốn ăn gì đó lạnh", top_k=20)

print(data.head(20))