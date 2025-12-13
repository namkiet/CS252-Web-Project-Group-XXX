from flask import Blueprint, request, jsonify

from service.supabase import get_db
from app.services.supa_client import get_auth_db
from app.utils.decorators import token_required
from app.services.history_service import ChatHistoryService

me_bp = Blueprint('me', __name__)

history_service = ChatHistoryService()

@me_bp.route('/', methods = ['GET'])
@token_required
def me():
    user = request.current_user
    if not user:
        return jsonify({"error" : "Unauthorized"}), 401
 
    try:
        user_id = user.id
        profile = history_service.get_user_profile(user_id)
        
        if not profile:
            return jsonify({"error" : "No profile"}), 500
        
        return jsonify({
            "fullname" : profile.get('fullname'),
            "email" : profile.get('email'),
        }), 200
    except Exception as e:
        return jsonify({"error" : str(e)}), 500