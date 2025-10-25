from Backend.AI.Embedder.embeddingManager import EmbeddingManager
import pandas as pd 
from dotenv import load_dotenv

load_dotenv()
data = pd.read_csv("data/vietnam_local_foods.csv")

embManager = EmbeddingManager(data=data)
embManager.create_embedding()