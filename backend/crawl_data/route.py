from flask import Blueprint, request, jsonify
import threading
import time
import os

from dotenv import load_dotenv
load_dotenv() 

crawl_bp = Blueprint('crawl', __name__)

@crawl_bp.route('/trigger', methods = ['POST'])
def trigger():
    data = request.get_json(silent=True) or {}
    info = data.get("info", "")

    secret = os.environ.get('SECRET_KEY')
    
    print(secret)
    print(info)
    
    if info != secret:
        return jsonify({
            "status" : "error",
            "message" : "Unauthorized"
        }), 401
    
    topic = data.get("topic", "")
    if not topic:
        return jsonify({
            "status" : "error",
            "message" : "Missing topic"
        }), 401
    
    thread = threading.Thread(target=crawl_data_task, args=(topic,), daemon=True)
    thread.start()
    
    return jsonify({
        "status" : "success",
        "message" : "Running"
    }), 202
    

def crawl_data_task(topic):
    try:    
        # ge
        # time.sleep(10)
        # print("ge")

        # # Cao
        # time.sleep(10)
        # print("cao")
        # data = []
        # data = seleniumCao(topic)
        print("[START_LOAD]\n")
        # data = load_restaurants()             <= emb current db
        data = []
        #emb & db
        from service.ingestor import Ingestor
        ing = Ingestor()
        print("[INGEST]\n")
        ing.process(data)

        print("[DONE]\n")
    except Exception as e:
        print(f"Crawl Data Task error: {e}")
        
def load_restaurants():
    from service.supabase import get_admin_db
    db = get_admin_db()
    print("---Start---\n")
    
    try:
        response = db.table('restaurants').select('*, dishes(*)').execute()
        restaurants = response.data
    except Exception as e:
        print(f"Error when query DB: {e}")
        return []
    
    if not restaurants:
        print("No Restaurants")
        return []
    
    print("---OKE---\n")
    return restaurants

def mock():
    return 