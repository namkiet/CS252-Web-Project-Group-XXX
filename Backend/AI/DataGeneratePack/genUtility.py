from openai import OpenAI
import pandas as pd

def generate_food_dataset(n=10):
    system = f"""
    Generate a JSON list of {n} Vietnamese specialty food
    Each items contain following 
    - Name for food
    - Detail description (include ingredients, taste, what is the best time to eat and the story of the food if possible) - vietnamese and english version
    - Location (city or where it famous for)

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
