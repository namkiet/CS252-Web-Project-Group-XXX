from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

data = {
    "Đà Nẵng": "Mì Quảng",
    "Hà Nội": "Phở",
    "Hồ Chí Minh": "Bánh mìiiiiii",
    "Nha Trang": "Cơm gàaaaaaa"
}

@app.route('/api/recommend', methods=['POST'])
def recommend():
    city = request.json.get("city")
    dish = data.get(city, "Món đặc sản địa phương")
    return jsonify({"city": city, "dish": dish})

@app.route('/')
def home():
    return "Backend Flask đang chạy!"

if __name__ == "__main__":
    app.run(debug=True, port=5000)
