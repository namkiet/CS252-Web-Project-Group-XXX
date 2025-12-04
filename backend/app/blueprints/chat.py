from flask import Blueprint, request, jsonify
from app.services.supa_client import get_db

from app.utils.decorators import token_required
from app.services.history_service import ChatHistoryService
from app.services.ai_service import AIService # Test

chat_bp = Blueprint('chat', __name__)

history_service = ChatHistoryService()
ai_service = AIService()

@chat_bp.route('/message', methods = ['POST'])
@token_required
def handle_message():
    data = request.get_json()
    user = request.current_user
    
    user_id = user.id
    
    user_message = data.get('message', '')
    session_id = data.get('session_id')
    
    if not user_message:
        return jsonify({"error" : "Empty message"}), 400
    
    # create new conversation
    if not session_id:
        new_session = history_service.create_session(user.id, first_message=user_message)
        session_id = new_session['id']
    
    try:
        history_service.add_message(session_id, "user", user_message)
        chat_history = history_service.get_history(session_id)
        
        response = ai_service.process_message(user_message, chat_history) #AI_TEST
        
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
    