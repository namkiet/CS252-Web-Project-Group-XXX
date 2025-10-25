from Backend.AI.DataGeneratePack.genUtility import generate_food_dataset
from dotenv import load_dotenv

load_dotenv()


df = generate_food_dataset(n=10)
print(df)

df.to_csv("data/vietnam_local_foods.csv", index=False)
print("Succesfully create dataset")
