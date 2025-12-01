from app.agents.BaseAgent import BaseAgent
class DeepseekFinder(BaseAgent):
    def __init__(self) -> None:
        super().__init__(
            "DeepseekFinder",
            "If user ask about deepseek information, use this agent."
        )

    def run(self, payload: dict) -> dict:
        # Model need query
        return {"output":
                 {"message":"Deepseek has different kind of meaning, but consider in your case, deepseek is something that can be found deep into the research."}}