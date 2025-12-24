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
            You are the general case assistance, Your task is to try your best and given output.
            The user prompt will be in English or Vietnamese, only answer within these two language base on the user prompt.
            ONLY answer in one language, never mix English and Vietnamese at the same time EXCEPT for name.
            Keep the answer short and general, DO NOT go specific.
            user prompt : {message}
        """
        return {"output" :{ "message": self.model(message)}}
