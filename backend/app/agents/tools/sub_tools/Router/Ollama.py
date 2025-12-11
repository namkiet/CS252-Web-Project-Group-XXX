import requests
import json

class OllamaLocalModel:
    def __init__(self, model="deepseek-r1:1.5b", MaxToken = 100):
        self.model = model
        self.MaxToken = MaxToken
    
    def __call__(self, prompt:str):
        # It state that it would use this as a local generate gate
        url = "http://localhost:11434/api/generate"
        payload = {
            "model": self.model,
            "prompt": prompt, 
            "stream": False,
            "num_predict": self.MaxToken
        }

        response = requests.post(url, json=payload)
        data = response.json()
        try:
            return json.loads(data["response"])
        except:
            return data["response"]