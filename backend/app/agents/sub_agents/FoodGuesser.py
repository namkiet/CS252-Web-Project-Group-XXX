from app.agents.BaseAgent import BaseAgent
class FoodGuesserAgent(BaseAgent):
    def __init__(self, CoreModel) -> None:
        super().__init__(
            "Food_Guesser_Agent",
            "When need to guess the food from the user query"
        )
        self.model = CoreModel

    def run(self, payload: dict) -> dict:
        # Model need query
        message = payload["message"]

        prompt = f"""
            You are expert in vietnamese food, your job is to guess the food in vietname via user query.
            If you cannot find anything, response "Món"
            user prompt : {message}
            Only return a single name of food with no addition text.
        """


        return {"output" :{ "message": self.model(prompt)}}
