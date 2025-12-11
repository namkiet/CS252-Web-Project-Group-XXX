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
        sessions = history_service.get_user_sessions(user.id)
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
        try:
            limit = int(request.args.get('limit', 20))
            offset = int(request.args.get('offset', 0))
        except ValueError:
            limit = 20
            offset = 0

        history = history_service.get_history(session_id, limit=limit, offset=offset)
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
    
@history_bp.route('/<session_id>', methods=['DELETE'])
@token_required
def delete_chat_session(session_id):
    user = request.current_user

    if not session_id:
        return jsonify({"error": "Invalid session ID"}), 400
    
    try:
        is_deleted = history_service.delete_session(user.id, session_id)
        
        if is_deleted:
            return jsonify({
                "status": "success",
                "message": "Session deleted successfully",
                "session_id": session_id
            }), 200
        else:
            return jsonify({
                "status": "error",
                "message": "Session not found or access denied"
            }), 404
            
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal server error"}), 500
    
@history_bp.route('/<session_id>', methods=['PUT'])
@token_required
def update_chat_session(session_id):
    user = request.current_user
    data = request.get_json()
    new_title = data.get('title')

    if not session_id or not new_title:
        return jsonify({"error": "Missing session ID or title"}), 400

    try:
        updated_session = history_service.update_session_title(user.id, session_id, new_title)
        
        if updated_session:
            return jsonify({
                "status": "success",
                "message": "Session updated successfully",
                "data": updated_session
            }), 200
        else:
            return jsonify({
                "status": "error",
                "message": "Session not found or access denied"
            }), 404
            
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal server error"}), 500
