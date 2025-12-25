import requests
import json

class novaLite:
    def __init__(self):
        pass
    
    def __call__(self, prompt:str, reasoning = True):
        import os
        from dotenv import load_dotenv
        print(prompt)
        load_dotenv()

        api_key = os.environ.get("OPENROUTER_API_KEY")
    
        response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        data=json.dumps({
            "model": "amazon/nova-2-lite-v1:free",
            "messages": [
                {
                "role": "user",
                "content": prompt
                }
            ],
            "reasoning": {"enabled": reasoning}
        })
        )
        response = response.json()
        print(response)
        response = response['choices'][0]['message']
        print(response)
        return response['content']