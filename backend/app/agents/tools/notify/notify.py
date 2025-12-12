import requests

def notify_crawl():
    try:
        res = requests.post("http://127.0.0.1:5001/trigger", json={"info": "Crawl plRaAe 1232131@@das!"}, timeout=1)
        return "Notify"
    except Exception as e:
        print(f"Notify Crawl error: {e}")
        return "Connection Error to Crawl"