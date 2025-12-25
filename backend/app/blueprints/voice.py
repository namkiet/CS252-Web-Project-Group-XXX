from uuid import uuid4
import json
from flask import Blueprint, request, jsonify

from app.utils.decorators import token_required
from app.services.history_service import ChatHistoryService
from app.services.chat_service import ChatService
from app.services.audio_service import StorageService

from service.whisper_service import TranscribeService

voice_bp = Blueprint('voice', __name__)

history_service = ChatHistoryService()
chat_service = ChatService()
storage_service = StorageService()
transcriber = TranscribeService()

@voice_bp.route('/voice', methods=['POST'])
@token_required
def handle_voice_message():
    user = request.current_user
    
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file"}), 400
    
    file = request.files['audio']
    
    session_id = request.form.get("session_id")

    if file.mimetype not in {"audio/webm", "audio/wav", "audio/mpeg"}:
        return jsonify({"error": "Unsupported audio format"}), 400
    
    if not session_id:
        new_session = history_service.create_session(user.id, title="Voice Conversation")
        session_id = new_session['id']

    try:
        file_bytes = file.read()
        if len(file_bytes) > 1024 * 1024:
            return jsonify({"error" : "Audio File too long"}), 400
        
        audio_path = f"voice/{user.id}/{session_id}/{uuid4()}.webm"  
              
        storage_service.upload_file(
            file_bytes=file_bytes,
            path=audio_path,
            content_type="audio/webm"
        )
        
        print(" > Sending audio to Groq...")
        user_text = transcriber.transcribe(file_bytes) 
        
        if not user_text:
            return jsonify({"error": "Could not understand audio"}), 400


        history_service.add_message(
            session_id=session_id,
            role="user",
            user_message=user_text,
            widget={"type": "audio", "payload": None},
            audio_path=audio_path,
        )
        
        schedule_raw = request.form.get("schedule")
        current_schedule = None

        if schedule_raw:
            current_schedule = json.loads(schedule_raw)
            
        chat_history = history_service.get_history(session_id)
        response = chat_service.generate_response(user_text, chat_history, current_schedule)

        history_service.add_message(
            session_id=session_id,
            role="assistant",
            user_message=response.get("content", ""),
            widget={
                "type": response.get("type", "chat"),
                "payload": response.get("payload")
            },
            audio_path=None
        )
        
        if response.get("schedule"):
            history_service.add_schedule(
                session_id=session_id,
                schedule=response.get("schedule", {})
            )

        return jsonify({
            "status": "success",
            "session_id": session_id,
            "message": {
                "role" : "assistant",
                "content" : response.get('content', "")
            },
            "widget" : {
                "type" : response.get("type", "chat"),
                "payload" : response.get("payload")
            },
            "schedule": response.get("schedule", {})
        })

    except Exception as e:
        print(f"Voice Error: {e}")
        return jsonify({"error": str(e)}), 500