import pandas as pd 
from dotenv import load_dotenv
from Backend.AI.AI_Manager import AI_Manager
from pathlib import Path
load_dotenv()
data = pd.read_csv("data/vietnam_local_foods.csv")

AI_manager = AI_Manager(data=data)
data = AI_manager.search("Món ăn không có bún ở Hà Nội", 50, 15, RAG_combine_mode = "Meaning", Rerank_mode="reason")

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