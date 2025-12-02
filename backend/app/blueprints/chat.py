# app/blueprints/chat.py

from flask import Blueprint, request, jsonify
from app.utils.decorators import token_required
from app.services.history_service import ChatHistoryService
from app.services.chat_service import get_ai_response

chat_bp = Blueprint('chat', __name__)
history_service = ChatHistoryService()


@chat_bp.route('', methods=['POST'])
@token_required
def chat_endpoint():
    """
    POST /api/chat
    Receives user message → returns AI response + optional widget
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid or missing JSON"}), 400

    # User from JWT (set by @token_required → flask_jwt_extended)
    user = request.current_user
    if not user:
        return jsonify({"message": "Token is missing or invalid"}), 401
    user_id = user.id

    # Extract payload
    session_id = data.get("session_id")
    user_message = data.get("message", "").strip()
    user_context = data.get("user_context", {})
    attachments = data.get("attachments", [])

    # Must have at least a message or attachment
    if not user_message and not attachments:
        return jsonify({"error": "Message or attachments required"}), 400

    try:
        # 1. Create new session if none provided
        if not session_id:
            new_session = history_service.create_session(
                user_id=user_id,
                first_message=user_message or "New Chat"
            )
            session_id = new_session["id"]

        # 2. Ownership check is intentionally skipped (dev mode / trust frontend)
        # If you want it later → implement is_session_owner() in ChatHistoryService

        # 3. Save user message
        history_service.add_message(
            session_id=session_id,
            role="user",
            user_message=user_message or "",           # nội dung tin
            type="chat",
            data=attachments or None,                  # ← attachments → data
            metadata=user_context or None,             # ← user_context để đây luôn
        )

        # 4. Load conversation history for AI context
        chat_history = history_service.get_history(session_id)

        # 5. Call AI (mock or real LLM)
        ai_result = get_ai_response(
            user_message=user_message,
            history=chat_history,
            user_context=user_context,
            attachments=attachments,
        )

        assistant_content = ai_result["response"]
        widget_type = ai_result.get("widget_type", "chat")
        widget_payload = ai_result.get("widget_payload")

        # 6. Save assistant response
        history_service.add_message(
            session_id=session_id,
            role="assistant",
            user_message=assistant_content,
            type=widget_type,                          # chat / image / file / etc.
            data=widget_payload,                       # payload của widget (nếu có)
            metadata={"widget_type": widget_type, "widget_payload": widget_payload},
        )

        # 7. Return response in the exact format expected by frontend
        return (
            jsonify(
                {
                    "status": "success",
                    "session_id": session_id,
                    "message": {"role": "assistant", "content": assistant_content},
                    "widget": {"type": widget_type, "payload": widget_payload},
                }
            ),
            200,
        )

    except Exception as e:
        print(f"[CHAT ERROR] User {user_id} - Session {session_id}: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500