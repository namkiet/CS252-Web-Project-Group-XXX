from Backend.AI.Embedder.embeddingManager import EmbeddingManager
import pandas as pd 
from dotenv import load_dotenv

load_dotenv()
data = pd.read_csv("data/vietnam_local_foods.csv")

embManager = EmbeddingManager(data=data)

data = embManager.search(["món ăn có thịt và rau", "Đồ ăn lành mạnh", "ở Hà nội"], 20, "score_mean")

print(data.head(20))