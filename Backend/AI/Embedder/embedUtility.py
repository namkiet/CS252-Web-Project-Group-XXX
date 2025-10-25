from openai import OpenAI
import pandas as pd 
import numpy as np
from dotenv import load_dotenv
load_dotenv()
client = OpenAI()

def embed_text(text, model ="text-embedding-3-small"):
    return client.embeddings.create(
        model=model,
        input=text
    ).data[0].embedding

def cosine(a, b):
    a, b = np.array(a), np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
