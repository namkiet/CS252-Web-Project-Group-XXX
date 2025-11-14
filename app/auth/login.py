from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token
from app.extensions import db
from app.models.user import User

bp = Blueprint("auth", __name__)

@bp.route('/login', methods=["GET", "POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({'msg': 'Missing fields'}), 400
    
    user = User.query.filter_by(username=username).first()
    if user is None or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Invalid credentials"}), 401

    token = create_access_token(identity=user.id)

    return jsonify({
        "access_token": token,
        "user": {
            "id": user.id,
            "username": user.username,
            # "email": user.email
        }
    })
    