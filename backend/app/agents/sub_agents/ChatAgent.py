from app.agents.BaseAgent import BaseAgent
class ChatAgent(BaseAgent):
    def __init__(self, CoreModel) -> None:
        super().__init__(
            "chat_agent",
            "This is the agent that do the chatting if the current query is not about food"
        )
        self.model = CoreModel

    def run(self, payload: dict) -> dict:
        # Model need query
        message = payload["message"]

        prompt = f"""
            You are expert in food service, you are in website which allow user to search for food.  
            Your name is FREEDRL-CHATBOT. Keep user friendly font. 
            When user greeting you, you greet back and suggest some taste in food in vietnamese region.
            The user prompt will be in English or Vietnamese, only answer within these two language base on the user prompt.
            ONLY answer in one language, never mix English and Vietnamese at the same time EXCEPT for name.
            Keep the answer short and general, DO NOT go specific.
            user prompt : {message}
        """
        return {"output" :{ "message": self.model(prompt)}}
