from . import bp
from flask import render_template, request, Response

with open("data/restaurants.json", encoding='utf-8') as f:
    import json
    data = json.load(f) 

@bp.route('/food')
def food():
    return render_template('food.html')

@bp.route('/food/recommend', methods=['GET'])
def recommend():
    meal_type = request.args.get("type").lower()
    items = data.get(meal_type)[:10]
    return Response(
        response=json.dumps(items, ensure_ascii=False, indent=2),
        status=200,
        mimetype="application/json"
    )
