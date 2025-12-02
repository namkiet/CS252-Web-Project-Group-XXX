# app/services/chat_service.py

from typing import List, Dict, Any, Optional
import random

# ====================== MOCK DATA (same as your TypeScript mock) ======================
MOCK_RESTAURANTS = [
    {
        "restaurant_name": "Phở Thìn Lò Đúc",
        "dish_name": "Phở bò tái nạm",
        "lat": "21.0278",
        "lon": "105.8342",
        "desc": "Legendary Hanoi beef pho with over 40 years of history. Rich, clear broth.",
        "star": "4.8"
    },
    {
        "restaurant_name": "Bún Chả Hương Liên",
        "dish_name": "Bún chả Obama combo",
        "lat": "21.0290",
        "lon": "105.8520",
        "desc": "Famous bun cha spot visited by President Obama in 2016.",
        "star": "4.7"
    },
    {
        "restaurant_name": "Phở Bát Đàn",
        "dish_name": "Phở chín nạm gầu",
        "lat": "21.0345",
        "lon": "105.8485",
        "desc": "One of the oldest and most authentic pho places in Hanoi Old Quarter.",
        "star": "4.9"
    }
]

# Natural intros when recommending food
RECOMMENDATION_PHRASES = [
    "Dựa trên yêu cầu của bạn, đây là vài quán ngon mình gợi ý:",
    "Mình tìm được mấy chỗ ăn rất hợp với bạn nè:",
    "Đây là top quán đang hot mà bạn nên thử:",
    "Gần khu vực bạn đang đứng có vài quán siêu chất lượng đây:",
]

# Default greetings when no food intent detected
DEFAULT_GREETINGS = [
    "Chào bạn! Mình là trợ lý tìm quán ăn địa phương. Hôm nay bạn muốn ăn món gì?",
    "Hi! Bạn đang ở đâu vậy? Muốn tìm quán ngon gần đó không?",
    "Chào bạn! Thèm món gì nào, mình gợi ý liền!",
]

# ====================================================================================

def _detect_food_intent(message: str) -> bool:
    """
    Simple keyword-based detection to check if user is asking about food/restaurants.
    Later can be replaced with NLP or LLM intent classification.
    """
    if not message:
        return False

    keywords = [
        "ăn", "quán", "nhà hàng", "gợi ý", "tìm", "ngon", "phở", "bún", "cơm", "lẩu",
        "buffet", "cafe", "trà sữa", "bánh", "hải sản", "đồ ăn", "ăn gì", "ăn đâu",
        "gần đây", "ở đâu", "recommend", "restaurant", "food"
    ]
    return any(kw in message.lower() for kw in keywords)


def get_ai_response(
    user_message: str,
    history: List[Dict[str, Any]] = None,
    user_context: Optional[Dict[str, Any]] = None,
    attachments: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Main AI response generator.
    Currently uses mock logic (same behavior as your TypeScript mock).
    In the future: replace with real call to Grok / OpenAI / Claude + structured output.
    """
    # Optional: use history/context/attachments to make smarter decisions later
    _ = history, user_context, attachments  # unused for now

    if _detect_food_intent(user_message):
        return {
            "response": random.choice(RECOMMENDATION_PHRASES),
            "widget_type": "recommendation",
            "widget_payload": random.sample(MOCK_RESTAURANTS, k=min(3, len(MOCK_RESTAURANTS)))
        }
    else:
        return {
            "response": random.choice(DEFAULT_GREETINGS),
            "widget_type": "chat",
            "widget_payload": None
        }


