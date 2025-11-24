from Backend.AI.CoreRoot.BaseAgent import BaseAgent
class DeepseekFinder(BaseAgent):
    def __init__(self) -> None:
        super().__init__(
            "DeepseekFinder",
            "If user ask about deepseek information, use this agent."
        )

    def run(self, payload: dict) -> dict:
        # Model need query
        return {"output": "1 + 1 = 2"}