from app.agents.BaseAgent import BaseAgent
class DefaultAgent(BaseAgent):
    def __init__(self, CoreModel) -> None:
        super().__init__(
            "default_agent",
            "This is default model for the system, if there is no model sufficient for the task then use this model."
        )
        self.model = CoreModel

    def run(self, payload: dict) -> dict:
        # Model need query
        message = payload["message"]

        prompt = f"""
            You are an expert food guesser in vietnamese food. You given a query, your job is to guess and return an array of food in vietnamese base on that.
            user prompt : {message}
        """
        return {"output" :{ "message": self.model(message)}}
