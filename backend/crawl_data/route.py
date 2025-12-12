from flask import Blueprint, request, jsonify
import threading
import time

crawl_bp = Blueprint('crawl', __name__)

@crawl_bp.route('/trigger', methods = ['POST'])
def trigger():
    data = request.json
    info = data.get('info', "")

    if info != "Crawl plRaAe 1232131@@das!":
        return jsonify({
            "status" : "error",
            "message" : "Unauthorized"
        })
        
    thread = threading.Thread(target=crawl_data_task)
    thread.start()
    
    return jsonify({
        "status" : "success",
        "message" : "Running"
    })
    

def crawl_data_task():
    # ge
    time.sleep(10)
    print("ge")
    
    # Cao
    time.sleep(10)
    print("cao")
    
    # emb
    time.sleep(10)
    print("eb")
    
    # db
    time.sleep(10)
    print("db")
    
    print("Xong")
