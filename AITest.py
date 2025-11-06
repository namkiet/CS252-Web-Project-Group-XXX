import time
import pandas as pd 
from dotenv import load_dotenv
from Backend.AI.AI_Manager import AI_Manager
from pathlib import Path

start_time = time.time()

load_dotenv()
data = pd.read_csv("data/vietnam_local_foods.csv")

with open("prompt.txt", "r") as f:
    prompt = f.read()

AI_manager = AI_Manager(data=data)
data = AI_manager.search(prompt, 50, 50, RAG_combine_mode="Meaning", Rerank_mode="reason")

print(data.head(15))

out_path = Path("data/LastestSearchResult.csv")
mainFeatures = data[["Name", "reason", "match_score"]]
mainFeatures.to_csv(
    out_path,
    mode="w", 
    header=True,
    index=False,
    encoding="utf-8-sig",
    lineterminator="\n"
)

end_time = time.time()
print(f"Execution time: {end_time - start_time:.2f} seconds")
