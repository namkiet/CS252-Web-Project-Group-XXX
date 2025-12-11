from openai import OpenAI
from Ultility.json import extract_json
import pandas as pd 

client = OpenAI()
systemPrompt = """
    You are a reranker. Given user query and detail context of the local vietnamese food. Your job is to rerank the best food for the user to eat
    FOCUS on negative prompt. If the prompt already stated that there should be no something but the food has it, the scores alway result 0!
    If the food has the ingredient and doesn't have in the negative prompt, increase the scores at least 50+.
    If more than two food has the same name, increase the score for one and decrease others.
    If the food doesn't have negative prompt. increase the score to least 20+
    return their relevance score  from 1 to 100 (100 = Perfect relevance)
"""
def rerank_withReason(data: pd.DataFrame, prompt: str, column = "combined", top_k = 5):
    

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
        model="gpt-5-mini",
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
                            "description": "relevance score in same as given context following the score's rule"
                        },
                        "Reason": {
                            "type": "array",
                            "items": {"type": "string"},
                            "description": "Reason of ranking as score"
                        }
                    },
                    "required": ["scores", "Reason"]
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


def rerank(data: pd.DataFrame, prompt: str, column = "combined", top_k = 5):


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
    n, m = len(detailContext), len(scores)
    if m < n:
        scores = scores + [0.0] * (n-m)
    else:
        scores = scores[:n]

    data["match_score"] = scores
    reranked = data.sort_values(by="match_score", ascending=False).head(top_k)
    return reranked

def rerank_withSimilarity(data: pd.DataFrame, prompt: str, column = "combined", top_k = 5):

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
    n, m = len(detailContext), len(scores)
    if m < n:
        scores = scores + [1.0] * (n-m)
    else:
        scores = scores[:n]

    data["match_score"] = scores
    data["final_score"] = data["match_score"] * data["similarity"]
    reranked = data.sort_values(by="final_score", ascending=False).head(top_k)
    return reranked