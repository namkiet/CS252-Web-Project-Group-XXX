from openai import OpenAI
import pandas as pd

def generate_food_dataset(n=10):
    system = f"""
    Generate a JSON list of {n} Vietnamese specialty food, focus on snack like ice cream
    Each items contain following 
    - Name for food
    - Detail description (include ingredients, taste, what is the best time to eat and the story of the food if possible) - vietnamese and english version
    - Location (city or where it famous for, focus into a city if possible)

"""
    
    ExampleFormat = """
    Example format:
    [
        {{
            "Name": "Bún chả Hà Nội",
            "Detail description en": "the combination of rice noodle and ...",
            "Detail description vn": "là sự kết hợp giữa bún và...",
            "Location": "Hà nội"
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

