import requests
import json

class OllamaEmb:
    def __init__(self, base_url, model="nomic-embed-text"):
        self.base_url = base_url
        self.model = model
    
    def embed(self, prompt:str):
        if self.model != "nomic-embed-text":
            return f"error Ollama Emb: Wrong model"
        # It state that it would use this as a local generate gate
        # url = "http://localhost:11434/api/generate"
        url = f"{self.base_url}/api/embeddings"
        
        payload = {
            "model": self.model,
            "prompt": prompt,
            "embedding": True,
            "stream": False
        }
        # response = requests.post(url, json=payload)
        headers = {
            "ngrok-skip-browser-warning": "true",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Content-Type": "application/json",
        } 
        
        response = requests.post(url, json=payload, headers=headers, timeout=240)
        response.raise_for_status()
        if response.status_code != 200:
            return f"Error connecting to Colab: {response.text}"
        try:
            return response.json()["embedding"]
        except Exception as e:
            print("ERROR inOEM")
            return {}
        
    def generate_content(self, prompt):
        if self.model != "qwen2.5:14b":
            return f"error Ollama Emb: Wrong model"
        
        url = f"{self.base_url}/api/generate"
        
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }
        
        headers = {
            "ngrok-skip-browser-warning": "true",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Content-Type": "application/json",
        } 
        
        try:
            response = requests.post(url, json=payload, headers=headers, timeout=240)
            response.raise_for_status()
            
            return response.json().get("response", "")
            
        except Exception as e:
            print(f"Ollama Generate Error: {e}")
            raise e