import pandas as pd 
from dotenv import load_dotenv
from Backend.AI.AI_Manager import AI_Manager
load_dotenv()
data = pd.read_csv("data/vietnam_local_foods.csv")

AI_manager = AI_Manager(data=data)
data = AI_manager.search("Tôi muốn ăn món gì đó không cay nhưng không phải là bún", 100, 15)

print(data.head(15))