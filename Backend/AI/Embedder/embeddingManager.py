import os 
import numpy as np
import pandas as pd 
import pickle
import warnings
from openai import OpenAI
from pathlib import Path
from Backend.AI.Embedder.embedUtility import cosine, embed_text
class EmbeddingManager:
    def __init__(self, data=None, out_path=None, Warning = True,embed_path="data/embedding.pkl", model="text-embedding-3-small"):
        # Provide at least data or out_path in order to run, else Value Error raised
        # if both not provided, Raise error
        self.__client = OpenAI()
        self.model = model
        self.__embed_path = Path(embed_path)
        self.__data = None
        self.Warning = Warning 
        if out_path:
            self.__data = pd.read_csv(out_path)
            
        elif isinstance(data, pd.DataFrame):
            self.__data = data.copy()
        else:
            raise ValueError("Ebedding manager need __data or out_path that can be used, please provide at least one")
        if self.__embed_path.exists():
            try:
                with open(self.__embed_path, "rb") as f:
                    self.__data["embedding"] = pickle.load(f)
            except:
                warnings.warn("WARNING: Mismatch type, could be __data change? please use create_embedding() method BEFORE using the search method")
        else:
            self.__data["embedding"] = None

        if(self.Warning) and (not (embed_path)):
            warnings.warn("WARNING: there is no embedding space yet, please use create_embedding() method before using the search method")

        if "combined" not in self.__data.columns:
            self.__data["combined"] = self.__data.apply(
                lambda x: f"Food: {x.get('Name', '')}. Description en: {x.get('Detail description en', '')}. Decription vn: {x.get('Detail description vn', '')}. Location: {x.get('Location', '')}.",
                axis=1
            )

    def create_embedding(self, save_mode=True):
        # function create embedding space
        # To save to embed path, save_mode = True. Otherwise, save_mode = False
        embedding = []
        for text in self.__data["combined"]:
            emb = embed_text(text, self.model)
            embedding.append(emb)
        self.__data['embedding'] = embedding

        if save_mode:
            with open(self.__embed_path, "wb") as f:
                pickle.dump(embedding, f)
        print(f"LOG: Sucessfully save embedding space into {self.__embed_path}")



    def search(self, query_list:list, top_k=5, combine_mode="score_sum"):
        if not isinstance(query_list, (list, tuple)):
            raise ValueError(f"Query list MUST be list of string. Given : {query_list}")
        if combine_mode[:5] == "score":
            query_embs_list = []
            for q in query_list:
                emb = embed_text(q, self.model)
                query_embs_list.append(emb)

            scores = []
            for q_emb in query_embs_list:
                score = self.__data["embedding"].apply(lambda e: cosine(e, q_emb))
                scores.append(score)
            # Reason of score as prefix is I want to test embed as prefix (Apply combine first then score).
            # Hypothesis: The current method is slower but result in better answer
        
            if combine_mode == "score_mean":
                self.__data["similarity"] = np.mean(scores, axis=0)
            elif combine_mode == "score_sum":
                self.__data["similarity"] = np.sum(scores, axis=0)
            elif combine_mode == "score_max":
                self.__data["similarity"] = np.max(scores, axis=0)
            elif combine_mode == "score_square_sum":
                self.__data["similarity"] = np.sum(score**2, axis=0)
            else:
                raise ValueError(f"combine mode NOT found given {combine_mode}. Available mode: score_mean, score_sum, score_max")

            return self.__data.sort_values("similarity", ascending=False).head(top_k)
        elif combine_mode[:7] == "Meaning":
            embs = embed_text(query_list[0], self.model)
            skip = True
            for q in query_list:
                if skip:
                    skip = False
                else:
                    emb = embed_text(q, self.model)
                    embs += emb
            self.__data["similarity"] = self.__data["embedding"].apply(lambda e: cosine(e, emb))
            return self.__data.sort_values("similarity", ascending = False).head(top_k)