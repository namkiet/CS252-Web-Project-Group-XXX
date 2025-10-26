import pandas as pd 
from dotenv import load_dotenv
from Backend.AI.AI_Manager import AI_Manager
load_dotenv()
data = pd.read_csv("data/vietnam_local_foods.csv")

AI_manager = AI_Manager(data=data)
data = AI_manager.search("Ăn gì cũng được ngoại trừ bún ra, có thịt đạm và rau ở thành phố Hồ Chí Minh", 100, 15)

print(data.head(15))