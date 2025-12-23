from flask import Blueprint, request, jsonify

from app.utils.decorators import token_required
from app.services.history_service import ChatHistoryService
from app.services.audio_service import StorageService

storage_service = StorageService()
history_bp = Blueprint('history', __name__)

history_service = ChatHistoryService()

@history_bp.route('/sessions', methods = ['GET'])
@token_required
def get_sessions_sidebar():
    user = request.current_user

    try:
        sessions = history_service.get_user_sessions(user.id)
        response = {
            "status": "success",
            "data": sessions
        }
        return jsonify(response), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"Error" : "Internal server error"}), 500


@history_bp.route('/sessions', methods=['POST'])
@token_required
def create_new_sessions():
    user = request.current_user
    data = request.get_json() or {}

    title = data.get('title')
    first_message = data.get('first_message') or data.get('firstMessage')

    try:
        new_session = history_service.create_session(user.id, title=title, first_message=first_message)
        return jsonify({
            "status": "success",
            "data": new_session
        }), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal server error"}), 500


@history_bp.route('/<session_id>', methods = ['GET'])
@token_required
def get_history_messages(session_id):
    if not session_id:
        return jsonify({"error": "Invalid session ID"}), 400
    user = request.current_user
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
            audio_url = None
            if msg.get("audio_path"):
                audio_url = storage_service.get_signed_url(msg["audio_path"])
            # Read widget and schedule directly from DB columns
            widget = msg.get('widget', {"type": "chat", "payload": None})
            schedule = msg.get('schedule', {})
            msg_obj = {
                "id" : msg.get('id', ""),
                "message" : {
                    "role" : msg.get('role', ""),
                    "content" : msg.get('content', ""),
                    "created_at": msg.get('created_at', {"N/A"})
                },
                "widget" : widget,
                "schedule": schedule,
                "audio_url": audio_url
            }

            messages.append(msg_obj)
        
        session = history_service.get_session(session_id)
        
        if not session or session.get("user_id", "") != user.id:
            return jsonify({"error": "Access denied"}), 403
        
        response = {
            "status" : "success",
            "session_id" : session_id,
            "schedule": session.get("schedule"),
            "messages" : messages
        }

        return jsonify(response), 200
    except Exception as e:
        print(f"Error History Message: {e}")
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
    is_pinned = data.get('is_pinned')

    update_data = {}
    if new_title is not None:
        update_data['title'] = new_title
    if is_pinned is not None:
        update_data['is_pinned'] = is_pinned

    if not update_data:
        return jsonify({"error": "No data provided to update"}), 400

    try:
        updated_session = history_service.update_session(user.id, session_id, update_data)
        
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

@history_bp.route('/<session_id>/schedule', methods=['PUT'])
@token_required
def update_chat_session_schedule(session_id):
    user = request.current_user
    data = request.get_json()
    schedule = data.get('schedule')

    if not session_id or schedule is None:
        return jsonify({"error": "Missing session ID or schedule"}), 400

    try:
        updated_session = history_service.update_session_schedule(user.id, session_id, schedule)
        
        if updated_session:
            return jsonify({
                "status": "success",
                "message": "Schedule updated successfully",
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
    
@history_bp.route('/<session_id>/schedule', methods=['GET'])
@token_required
def get_chat_session_schedule(session_id):
    user = request.current_user

    try:
        schedule = history_service.get_session_schedule(user.id, session_id)
        
        return jsonify({
            "status": "success",
            "session_id": session_id,
            "schedule": schedule if schedule is not None else []
        }), 200
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500