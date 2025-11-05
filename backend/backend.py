from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

with open("backend/data.json", encoding='utf-8') as f:
    data = json.load(f) 

@app.route('/recommend', methods=['GET'])
def recommend():
    meal_type = request.args.get("type").lower()
    items = data.get(meal_type)[:10]
    return Response(
        response=json.dumps(items, ensure_ascii=False, indent=2),
        status=200,
        mimetype="application/json"
    )

@app.route('/')
def home():
    return "Backend Flask đang chạy!"

if __name__ == "__main__":
    app.run(debug=True, port=5000)
