from Backend.AI.RankerSystem.DataGeneratePack.genUtility import generate_food_dataset
from dotenv import load_dotenv
import pandas as pd 
from pathlib import Path
out_path = Path("data/vietnam_local_foods.csv")
out_path.parent.mkdir(parents=True, exist_ok=True)

load_dotenv()

df = generate_food_dataset(n=80)

if out_path.exists():
    df.to_csv(
        out_path,
        mode="a", 
        header=False,
        index=False,
        encoding="utf-8-sig",
        lineterminator="\n"
    )
else:
    df.to_csv(
        out_path,
        mode="w", 
        header=False,
        index=False,
        encoding="utf-8-sig",
        lineterminator="\n"
    )