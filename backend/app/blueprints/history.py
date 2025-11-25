from flask import Blueprint, request, jsonify

from app.utils.decorators import token_required
from app.services.history_service import ChatHistoryService

history_bp = Blueprint('history', __name__)

history_service = ChatHistoryService()

@history_bp.route('/sessions', methods = ['GET'])
@token_required
def get_sessions_sidebar():
    user = request.current_user

    try:
        sessions = history_service.get_user_sessions(user['id'])
        response = {
            "status" : "success",
            "data" : sessions
        }
        
        return jsonify(response), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"Error" : "Internal server error"}), 500


@history_bp.route('/<session_id>', methods = ['GET'])
@token_required
def get_history_messages(session_id):
    if not session_id:
        return jsonify({"error": "Invalid session ID"}), 400
    
    try:
        history = history_service.get_history(session_id, 10)
        messages = []
        
        for msg in history:
            msg_obj = {
                "id" : msg.get('id'),
                "message" : {
                    "role" : msg.get('role'),
                    "content" : msg.get('content'),
                    "created_at": msg.get('created_at')
                },
                "widget" : {
                    "type" : "chat",
                    "payload" : None
                }
            }
            
            meta = msg.get('metadata') or {}
            mtype = meta.get('type')
            mdata = meta.get('data')
            
            if mtype == 'recommendation' and mdata:
                msg_obj['widget']['payload'] = mdata
                msg_obj['widget']['type'] = mtype
            # elif
                
            messages.append(msg_obj)
        response = {
            "status" : "success",
            "session_id" : session_id,
            "messages" : messages
        }
        
        return jsonify(response), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"Error" : "Internal server error"}), 500
