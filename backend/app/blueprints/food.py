from flask import Blueprint, request, jsonify
from app.services.food_services import get_data_from_keywords

food_bp = Blueprint('food', __name__)

@food_bp.route('/', methods=['POST'])
def food():
    body = request.get_json()

    # Kiểm tra dữ liệu đầu vào
    if not body or "keywords" not in body:
        return jsonify({"error": "Missing 'keywords' field"}), 400
    
    keywords = body["keywords"]

    # Kiểm tra đúng kiểu array string
    if not isinstance(keywords, list) or not all(isinstance(k, str) for k in keywords):
        return jsonify({"error": "'keywords' must be a list of strings"}), 400

    result = get_data_from_keywords(keywords)
    return jsonify(result)
