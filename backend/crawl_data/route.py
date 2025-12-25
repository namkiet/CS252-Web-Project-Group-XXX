from flask import Blueprint, request, jsonify
import threading
import time
import os
import pandas as pd
from crawl_data.GeminiCrawl.utilities import GeminiCrawl, UniqueCsv
from crawl_data.food_services.crawl import crawl_sele, load_data_from_sql
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
        # topic = "Restaurants in District 5, Ho Chi Minh City, Vietnam"
        
        
        csv_path = "data/geminiCrawlTest.csv"
        print("[CALL GEMINI]\n")
        response = call_gemini(csv_path, topic)
        
        error = response.get("error", "")
        if(error != ""):
            print("Crawl Data Task error:", error)
            return
        
        
        print("[CRAWL SELE]\n")
        crawl_sele(csv_path)
        print("[DONE SELE]\n")
        
        print("[START_UPLOAD]\n")
        upload_supabase()
        print("[DONE SUPA]")
        # data = load_restaurants()             <= emb current db
        
        # data = []
        # #emb & db

        print("[FINISH!]\n")
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

def call_gemini(csv_path, topic, loop_count: int = 2):
    print("[GeminiCrawl]\n")
    result = GeminiCrawl(topic, loop_count)
    
    print(result)
    payload = result["output"]["payload"]
    
    if not payload:
        return {
            "error" : "No payload"
        }
    
    rows = []
    for item in payload:
        name = item.get("restaurant_name")
        url = item.get("url")
        
        if not name or not url:
            continue
        
        rows.append({
            "restaurant_name": name.strip().lower(),
            "url": url.strip()
        })
        
        print(item["restaurant_name"])
    
    if not rows:
        return {"error": "No valid rows"}
    
    new_df = pd.DataFrame(rows).drop_duplicates()
    # csv_path = "backend/data/geminiCrawlTest.csv"
    
    if os.path.exists(csv_path):
        old_df = pd.read_csv(csv_path)
        df = pd.concat([old_df, new_df], ignore_index=True)
    else:
        df = new_df

    df = df.drop_duplicates(subset=["restaurant_name"], keep="first")
    df.to_csv(csv_path, index=False, encoding="utf-8-sig")
    print("[CALL UNIQUE_CSV]")
    
    UniqueCsv(csv_path)
    print(f"[DONE GEMINI]: total rows = {len(df)}")
    
    return {"rows": len(new_df)}

def upload_supabase():
    data = load_data_from_sql()
    if not data:
        return

    #emb & db
    
    from service.ingestor import Ingestor
    ing = Ingestor(table_name = "abcd")
    # ing = Ingestor(table_name = "documents")
    print("[INGEST]\n")
    ing.process(data)
    return