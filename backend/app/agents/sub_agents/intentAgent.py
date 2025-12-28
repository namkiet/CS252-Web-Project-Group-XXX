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
        Is the following query asking for a specific dish or a specific restaurant/location?

        Query: "{query}"

        Answer "TRUE" if it mentions a concrete dish name or a specific restaurant/place.
        Answer "FALSE" if it is a general food search or unrelated.

        Output only TRUE or FALSE.
        """
        try:
            res = self.llm(prompt).strip().upper()
            
            if "TRUE" in res:
                return True
            return False
            
        except Exception as e:
            print(f"Error in IntentVerifier: {e}")
            return False