import requests
import json
import os
class OllamaLocalModel:
    def __init__(self, base_url = None, model="deepseek-r1:1.5b", MaxToken = 100):
        if base_url is None:
            self.base_url = os.environ.get("OLLAMA_URL", "https://collotypic-pablo-unridiculous.ngrok-free.dev")
        else:
            self.base_url = base_url
        self.model = model
        self.MaxToken = MaxToken
    
    def __call__(self, prompt:str):
        # It state that it would use this as a local generate gate
        # url = "http://localhost:11434/api/generate"
        url = f"{self.base_url}/api/generate"
        
        payload = {
            "model": self.model,
            "prompt": prompt, 
            "stream": False,
            "num_predict": self.MaxToken
        }
        # response = requests.post(url, json=payload)
        headers = {
            "ngrok-skip-browser-warning": "true",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Content-Type": "application/json",
        } 
        
        response = requests.post(url, json=payload, headers=headers, timeout=120)
        
        if response.status_code != 200:
            return f"Error connecting to Colab: {response.text}"
        
        data = response.json()
        try:
            return json.loads(data["response"])
        except:
            return data["response"]