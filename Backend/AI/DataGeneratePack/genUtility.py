from openai import OpenAI
import pandas as pd
import ollama
def generate_food_dataset(n=10):
    system = f"""
    Generate a JSON list of {n} Vietnamese specialty food, focus on snack like ice cream
    Each items contain following 
    - Name for food
    - Detail description (include ingredients, taste, what is the best time to eat and the story of the food if possible) - vietnamese and english version
    - Location (city or where it famous for, focus into a city if possible)

"""
    
    ExampleFormat = """
    Example format (detail description is EXAMPLE not FORMAT):
    [
        {{
            "Name": "Kem Tràng Tiền",
            "Detail description en": "Detail description about this Kem Tràng Tiền",
            "Detail description vn": "Mô tả chi tiết về Kem Tràng Tiền"
            "Location": "Hà Nội"
        }},
        ...
    ]
    MUST Return only balid JSON.
"""
    prompt = system + ExampleFormat
    client = OpenAI()
    response = client.chat.completions.create(
        model="gpt-5-mini",
        messages=[{
            "role": "user", "content":prompt
        }],
    )
    import json
    content = response.choices[0].message.content
    data = json.loads(content)

    df = pd.DataFrame(data)
    return df


def generate_rag_queries(query: str, model = "gpt-4o-mini"):
    systemPrompt = (
        "You are a retrieval assistant that expands user queries into multiple search queries for RAG (Retrieval Augmented Generation) system"
        "Each query should be distinct but relevant way to find useful information"
    )
    
    userPrompt = (
        f"User query: {query}\n\n"
        f"Generate a number of queries that cover most of information short using for RAG cosine and focus search queries in JSON list format, for example:\n"
        f'["query1", "query2", "query3", ...]\n\n'
        f"Some important information to look out: Location, When is good time to eat, What specific tatse does user want, what are the ingredient required, user's mood, current situation, current weather condition\n"
        f"If information that also contribute to RAG cosine that haven't list above. You may need to put it into the queries list"
    )

    client = OpenAI()
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": systemPrompt},
            {"role": "user", "content": userPrompt}
        ],
        response_format={"type": "json_object"}
    )

    import json
    raw_content = response.choices[0].message.content
    try:
        data = json.loads(raw_content)
        if isinstance(data, dict) and "queries" in data:
            return data["queries"]
        elif isinstance(data, list):
            return data
        else:
            raise ValueError("Unexpected JSON format generate by LLM")
    except json.JSONDecodeError:
        print("Model return non-JSON, please try again")
        return []

def generate_dual_rag_queries(query: str, model = "gpt-5-mini"):
    systemPrompt = (
        "You are a retrieval assistant that divided query into two part Positive and Negative prompt"
        "Two queries combine together must cover all the meaning of original query"
    )
    
    userPrompt = (
        f"User query: {query}\n\n"
        f"Generate two queries that must be seperate and never has information of the other one. The first query contain only positve. The second query contain only negative but written in positive.search queries MUST be in JSON list format, Format as:\n"
         '{"queries": ["Positive Query", "Negative Query"]}\n\n'
        f'Example prompt: Tôi muốn món ăn có vị cay, nhưng không được đắng, phải có cơm nhưng không được có phở và bún\n'
         'Example Output: {"queries": ["Món cơm có vị cay", "Món phở hoặc bún có vị đắng"]}\n'
    )

    client = OpenAI()
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": systemPrompt},
            {"role": "user", "content": userPrompt}
        ],
        response_format={"type": "json_object"}
    )

    import json
    raw_content = response.choices[0].message.content
    try:
        data = json.loads(raw_content)
        if isinstance(data, dict) and "queries" in data:
            return data["queries"]
        elif isinstance(data, list):
            return data
        elif isinstance(data, dict) and "result" in data:
            return data["result"]
        else:
            raise ValueError(f"Unexpected JSON format generate by LLM: \n{data}")
    except json.JSONDecodeError:
        print("Model return non-JSON, please try again")
        return []
def generate_dual_rag_queries_O(query):
    systemPrompt = (
        "You are a retrieval assistant that divided query into two part Positive and Negative prompt"
        "Two queries combine together must cover all the meaning of original query"
    )
    
    userPrompt = (
        f"Given user prompt in either english or vietnamese, your job is to identify the Positive and Negative prompt\n"
        f"Focus on type of food, location, time, taste, additional description\n"
        f"response ONLY in format json as below with no aditional text\n\n"
        '{"queries": [Positive Query, Negative Query]}\n'
        'Example User Query: món gì ở Hà Nội cũng được ngoại trừ bún'
        'Example output: {"queries": [Ở Hà Nội, Không bún]}\n'
        f"User prompt: {query}"
    )
    client = OpenAI()
    response = ollama.chat(
        model="qwen2.5:3b",
        messages=[
            {"role": "user", "content": userPrompt}
        ],
    )


    import json
    raw_content = response.message.content
    print("raw content:", raw_content)
    try:
        data = json.loads(raw_content)
        if isinstance(data, dict) and "queries" in data:
            return data["queries"]
        elif isinstance(data, list):
            return data
        elif isinstance(data, dict) and "result" in data:
            return data["result"]
        else:
            raise ValueError(f"Unexpected JSON format generate by LLM: \n{data}")
    except json.JSONDecodeError:
        print("Model return non-JSON, please try again")
        return generate_dual_rag_queries_O(query)