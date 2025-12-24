from app.agents.BaseAgent import BaseAgent
class DefaultAgent(BaseAgent):
    def __init__(self, CoreModel) -> None:
        super().__init__(
            "Request_Clarify_agent",
            "This agent will handle the chat event, call this if the input of user request need to be clarify."
        )
        self.model = CoreModel

    def run(self, payload: dict) -> dict:
        # Model need query
        message = payload["message"]

        prompt = f"""
            You are expert in food service. Your job is to ask for further clarification if needed. IF NOT, return the "the user has provided enough information."
            user prompt : {message}
        """
        return {"output" :{ "message": self.model(message)}}
