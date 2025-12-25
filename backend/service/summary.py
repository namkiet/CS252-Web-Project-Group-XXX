import unicodedata
import re

from service.ollama_emb import OllamaEmb

class Summary():
    def __init__(self):
        try:
            URL = "https://collotypic-pablo-unridiculous.ngrok-free.dev"
            self.root = OllamaEmb(base_url=URL, model="qwen2.5:14b")
        except Exception as e:
            print(f"Summary: Failed to initialize AI Agent: {e}")
            self.root = None
            
    def normalize_text(self, text: str) -> str:
        if not text:
            return ""

        text = text.lower()
        
        text = unicodedata.normalize('NFD', text)
        text = re.sub(r'[\u0300-\u036f]', '', text)
        text = unicodedata.normalize('NFC', text)
        
        return text.strip()
    
    def generate_dish_summary(self, dish_data, restaurant_data):
        if not self.root:
            return "Summary unavailable (Agent offline)."
        
        # name = dish_data.get('name', 'Unknown Dish')
        # name = self.normalize_text(name)
        
        menu_items = [d.get('name', '') for d in restaurant_data.get('dishes', [])]
        menu_context = menu_items[:150]
        
        prompt = f"""
            ROLE: Multilingual Food Data Enrichment Specialist.
            TASK: Write a dense, keyword-rich description of a specific dish for a vector search engine.
            
            --- INPUT DATA ---
            DISH NAME: {dish_data.get('name', 'Unknown Dish')}
            PRICE: {dish_data.get('price', 'N/A')}
            RESTAURANT: {restaurant_data.get('name', 'Unknown')}
            RESTAURANT RATING: {restaurant_data.get('ratings', 'N/A')}
            RESTAURANT ADDRESS: {restaurant_data.get('address', 'Unknown')}
            MENU CONTEXT (Other items served): {menu_context}
            ------------------

            INSTRUCTIONS:
            1. ANALYZE: Guess the ingredients and cooking style based on the name and the restaurant's cuisine context.
            2. DESCRIBE: Focus on TASTE (Spicy, Sweet, Umami), TEXTURE (Crispy, Soft), and TEMPERATURE.
            3. VERIFY: If the restaurant rating is high, mention "Highly rated". If the price is low, mention "Affordable".
            4. SAFETY ALERT: Explicitly list likely allergens. Use format: [Contains: Peanuts, Shellfish, etc.]. If unsure, do not guess.
            5. TRANSLATION: If the name is Vietnamese, provide the closest English translation (e.g., "Bun Bo" -> "Beef Noodle Soup").
            
            OUTPUT FORMAT: 
            "[English Description]. [Allergen Warnings]. Keywords: [Vietnamese Keywords]"
            
            CONSTRAINT: Keep it under 70 words. No flowery language. Focus on search keywords.
        """

        try:
            print(f" > Generating summary for dish: {dish_data.get('name')}...")
            response = self.root.generate_content(prompt)
            return response
        except Exception as e:
            print(f"Error generating summary for dish {dish_data.get('name')}: {e}")
            return f"{dish_data.get('name')} served at {restaurant_data.get('name')}."
    
    def generate_restaurant_summary(self, restaurant_data):
        if not self.root:
            return "Summary unavailable (Agent offline)."
        
        
        menu_text = ", ".join([f"{d['name']} ({d.get('price', '')})" for d in restaurant_data.get('dishes', [])[:50]])
        print(menu_text)
        
        prompt = f"""
            ROLE: Restaurant Critic & Data Specialist.
            TASK: Create a comprehensive profile for this restaurant to be used in semantic search.
            
            --- INPUT DATA ---
            NAME: {restaurant_data.get('name', 'Unknown')}
            ADDRESS: {restaurant_data.get('address', 'Unknown')} (Use this to infer neighborhood vibe if possible)
            RATING: {restaurant_data.get('ratings', 'N/A')} / 5.0
            MENU SAMPLES: {menu_text}
            ------------------

            INSTRUCTIONS:
            1. CUISINE ID: Be specific (e.g., instead of "Vietnamese", say "Northern Vietnamese Pho Specialist").
            2. FLAVOR PROFILE: Explicitly list the dominant notes (e.g., "Heavy use of fish sauce," "Spicy Szechuan peppercorns," "Sweet desserts").
            3. VIBE & VALUE: Infer from the prices and address (e.g., "Budget-friendly street food," "Upscale fine dining").
            4. DIETARY NOTS: Mention if the menu seems to have many Veggie or Meat options.
            5. RATING: Start the description with the rating (e.g., "Rated 4.6/5 stars...).
            
            OUTPUT FORMAT:
            "[Rating]. [English Description]. Keywords: [Vietnamese Keywords]"
        
            CONSTRAINT: Keep it under 100 words. Prioritize factual descriptors over marketing fluff.
        """

        try:
            response = self.root.generate_content(prompt)
            return response
        except Exception as e:
            print(f"Error generating summary for {restaurant_data.get('name')}: {e}")
            return "Description unavailable."
    