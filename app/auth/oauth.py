from flask import Blueprint, request, jsonify, url_for
from flask_jwt_extended import create_access_token
from app.extensions import db, oauth
from app.models.user import User
from validators import validate_register


bp = Blueprint("auth", __name__)

@bp.route('/google/login', methods=["GET", "POST"])
def google_login():
    redirect_uri = url_for("auth.google_callback", _external=True)
    return oauth.google.authorize_redirect(redirect_uri)


@bp.get("/google/callback")
def google_callback():
    token = oauth.google.authorize_access_token()
    user_info = oauth.google.parse_id_token(token)

    email = user_info.get("email")
    name = user_info.get("name")

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(username=name, email=email, password_hash=None)
        db.session.add(user)
        db.session.commit()

    jwt_token = create_access_token(identity=user.id)
    return jsonify({"access_token": jwt_token})