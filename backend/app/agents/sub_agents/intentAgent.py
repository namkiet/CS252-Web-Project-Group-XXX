import json

from app.agents.BaseAgent import BaseAgent

class IntentAgent(BaseAgent):
    def __init__(self, coreModel) -> None:
        super().__init__(
            "Intent Agent",
            "Returns True if the user is asking for a schedule or a specific dish, False otherwise."
        )
        self.llm = coreModel
        
    def run(self, query: str) -> bool:
        prompt = f"""
        You are an intent classifier.

        Decide whether the user's query is about FOOD/RESTAURANTS or about SCHEDULING/PLANNING.

        Answer TRUE if the query:
        - asks for food recommendations
        - mentions dishes (e.g., phở, bún thịt nướng, cơm tấm)
        - asks for restaurants or places to eat
        - uses phrases like "đề xuất quán", "ăn ở đâu", "quán nào ngon"

        Answer FALSE if the query:
        - asks to create or arrange a schedule
        - plans activities over time
        - mentions days, timelines, itineraries, or trips

        Query:
        "{query}"

        Respond with ONLY one word: TRUE or FALSE.
        """
        try:
            res = self.llm(prompt).strip().upper()
            print(res)
            if "TRUE" in res:
                return True
            return False
            
        except Exception as e:
            print(f"Error in IntentVerifier: {e}")
            return False