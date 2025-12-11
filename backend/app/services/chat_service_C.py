# Only for Test
class AIService:
    def process_message(self, message, history):
        message = message.lower()
        
        if "gợi ý" in message or "ăn gì" in message or "recommend" in message:
            return {
                "type" : "recommendation",
                "role" : "assistant",
                "content": "Dựa trên yêu cầu của bạn, mình tìm thấy vài quán này ngon lắm nè:",
                "metadata": { "type": "recommendation" },
                "payload": [
                    {
                        "id": "mock_1",
                        "restaurant_name": "Phở Thìn Lò Đúc",
                        "image": "../src/assets/images/street-food.jpg",
                        "address": "13 Lò Đúc, Hà Nội",
                        "star": 4.8,
                        "desc": "Phở tái lăn trứ danh, nước dùng béo ngậy.",
                        "priceRange": "50k - 100k",
                        "dish_name": "Phở Bò",
                        "coordinates": {
                          "lat": 21.018487,
                          "lng": 105.855278
                        }
                    },
                    {
                        "id": "mock_2",
                        "restaurant_name": "Bún Chả Hương Liên",
                        "image": "../src/assets/images/street-food.jpg",
                        "address": "24 Lê Văn Hưu, Hà Nội",
                        "star": 4.7,
                        "desc": "Quán bún chả nổi tiếng Obama từng ghé thăm.",
                        "priceRange": "40k - 80k",
                        "dish_name": "Bún Chả",
                        "coordinates": {
                          "lat": 10.799356,
                          "lng": 106.674987
                        }
                    }
                ]
            }
        
        return {
            "type" : "chat",
            "role" : "assistant",
            "content": f"AI đã nhận được tin nhắn: '{message}'. Bạn cần giúp gì thêm không?",
            "metadata": { "type": "chat" },
            "payload": None
        }