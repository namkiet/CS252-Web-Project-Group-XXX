from flask import Blueprint, request, jsonify
from app.services.supa_client import get_db

from app.utils.decorators import token_required
from app.services.history_service import ChatHistoryService

chat_bp = Blueprint('chat', __name__)

history_service = ChatHistoryService()

@chat_bp.route('/message', methods = ['POST'])
@token_required
def handle_message():
    data = request.get_json()
    user = request.user
    
    user_id = user.id
    
    user_message = data.get('message', '')
    session_id = data.get('session_id')
    
    return 
    if not user_message:
        return jsonify({"error" : "Empty message"}), 400
    
    # create new conversation
    if not session_id:
        new_session = history_service.create_session(user.id, title=user_message[:30])
        session_id = new_session['id']
    
    try:
        history_service.add_message(session_id, "user", user_message)
        chat_history = history_service.get_history(session_id)
        
        response = AI(user_message, chat_history)
        
        if not response:
            return jsonify({"error" : "No response"}), 500
        
        history_service.add_message(
            session_id,
            "assistant",
            response['response'],
            metadata = response.get('metadata', {})
        ) 
        
        return jsonify({
            "session_id": session_id,
            "message": response['response'],
            "data": response.get('data'),
            "metadata": response.get('metadata')
        }), 200
        
    except Exception as e:
        return jsonify({"error" : "Internal server error"}), 500
    
