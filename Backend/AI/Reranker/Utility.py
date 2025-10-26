from openai import OpenAI
from Backend.Ultility.json import extract_json
import pandas as pd 

client = OpenAI()

def rerank(data: pd.DataFrame, prompt: str, column = "combined", top_k = 5):
    systemPrompt = """
    You are a reranker. Given user query and detail context of the local vietnamese food,
    return their relevance score  from 0 to 100 (100 = Perfect relevance)
"""

    detailContext = data[column].to_list()
    userQuery = f"query: {prompt}\n\ndetail context:\n" + "\n\n".join(f"{i+1}. {text}" for i, text in enumerate(detailContext))

    messages = [
        {
            "role": "system",
            "content": systemPrompt
        },
        {
            "role": "user",
            "content": userQuery
        }
    ]

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "rerank_scores",
                "schema": {
                    "type": "object",
                    "properties": {
                        "scores": {
                            "type": "array",
                            "items": {"type": "number"},
                            "description": "relevance score in same as given context"
                        },
                        "Reason": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Reason of ranking as score"
                        }
                    },
                    "required": ["scores"]
                }
            }
        }
    )
    content = response.choices[0].message.content
    obj = extract_json(content)
    scores = obj.get("scores", None)
    reasons = obj.get("Reason", None)
    n, m = len(detailContext), len(scores)
    if m < n:
        scores = scores + [0.0] * (n-m)
    else:
        scores = scores[:n]

    n, m = len(detailContext), len(reasons)
    if m < n:
        reasons = reasons + ["NULL"] * (n-m)
    else:
        reasons = reasons[:n]



    data["match_score"] = scores
    data["reason"] = reasons
    reranked = data.sort_values(by="match_score", ascending=False).head(top_k)
    return reranked