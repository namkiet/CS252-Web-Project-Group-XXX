# Only for Test
class AIService:
    def process_message(self, message, history):
        message = message.lower()
        
        if "gợi ý" in message or "ăn gì" in message or "recommend" in message:
            return {
                "response": "Dựa trên yêu cầu của bạn, mình tìm thấy vài quán này ngon lắm nè:",
                "metadata": { "type": "recommendation" },
                "data": [
                    {
                        "id": "mock_1",
                        "restaurant_name": "Phở Thìn Lò Đúc",
                        "image": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=1000",
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
                        "image": "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1000",
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
            "response": f"AI đã nhận được tin nhắn: '{message}'. Bạn cần giúp gì thêm không?",
            "metadata": { "type": "chat" },
            "data": None
        }