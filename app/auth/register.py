from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from app.extensions import db
from app.models.user import User
from validators import validate_register

bp = Blueprint("auth", __name__)

@bp.route('/register', methods=["GET", "POST"])
def register():
    data = request.json
    ata = request.json
    errors = validate_register(data)
    if errors:
        return jsonify({"errors": errors}), 400

    new_user = User(
        username=data["username"],
        email=data["email"],
        password_hash=generate_password_hash(data["password"]),
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Registration successful"}), 201
    