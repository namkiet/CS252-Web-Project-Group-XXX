from openai import OpenAI
import pandas as pd 
import numpy as np
from Backend.AI.RankerSystem.Embedder.localEmbedManager import local_embeded_Manager
from Backend.AI.RankerSystem.Embedder.GPTEmbeder import GPTEmberder
embeder = local_embeded_Manager()

def embed_text(text, model ="text-embedding-3-small"):
    return embeder.embed_text(text)

def cosine(a, b):
    a, b = np.array(a), np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

