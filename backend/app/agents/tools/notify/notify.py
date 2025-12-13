import requests
import os

def notify_crawl(topic):
    try:
        secret = os.environ.get('SECRET_KEY')
        res = requests.post("http://127.0.0.1:5001/trigger", json={"info": secret, "topic" : topic}, timeout=1)
        
        if res.status_code != 202:
            print("Notify failed:", res.status_code)    
        return "Notify"
    except Exception as e:
        print(f"Notify Crawl error: {e}")
        return "Connection Error to Crawl"