from openai import OpenAI
import pandas as pd 
import numpy as np
from dotenv import load_dotenv
load_dotenv()
client = OpenAI()
class GPTEmberder:

    def __init__(self) -> None:
        pass

    def embed_text(self, text, model ="text-embedding-3-small"):
        return client.embeddings.create(
            model=model,
            input=text
        ).data[0].embedding


