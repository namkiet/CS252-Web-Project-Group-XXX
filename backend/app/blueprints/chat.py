import html
from flask import Blueprint, request, jsonify

from app.utils.decorators import token_required
from app.services.history_service import ChatHistoryService
from app.services.chat_service import ChatService
from app.services.chat_service_C import AIService
chat_bp = Blueprint('chat', __name__)

chat_mock = AIService()
history_service = ChatHistoryService()
chat_service = ChatService()

@chat_bp.route('/message', methods = ['POST'])
@token_required
def handle_message():
    data = request.get_json()
    user = request.current_user
    
    user_id = user.id
    
    user_message = data.get('message', '')
    user_message = html.escape(user_message)

    session_id = data.get('session_id')
    
    if not user_message:
        return jsonify({"error" : "Empty message"}), 400
    
    if len(user_message) > 1500:
        return jsonify({"error" : "Message too long"}), 400
    
    # create new conversation
    if not session_id:
        new_session = history_service.create_session(user.id, title=user_message[:30])
        session_id = new_session['id']
    
    try:
        history_service.add_message(session_id, "user", user_message)
        chat_history = history_service.get_history(session_id)
        
        # response = chat_service.generate_response(user_message, chat_history)
        response = chat_mock.process_message(user_message, chat_history)
        if not response:
            return jsonify({"error" : "No response"}), 500
        
        
        
        history_service.add_message(
            session_id,
            "assistant",
            response.get('content', ""),
            widget_type=response.get('type', 'chat'),
            widget_payload=response.get('payload'),
            schedule=response.get('schedule')
        )

        return jsonify({
            "status" : "success",
            "session_id": session_id,
            "message": {
                "role" : "assistant",
                "content" : response.get('content', "")          
            },
            "widget" : {
                "type" : response.get("type", "chat"),
                "payload" : response.get("payload")
            },
            "schedule": response.get('schedule')
        }), 200
        
    except Exception as e:
        print(f"{e}")
        return jsonify({"error" : "Internal server error"}), 500
    
