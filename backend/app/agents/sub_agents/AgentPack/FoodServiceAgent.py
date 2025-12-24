from app.agents.BaseAgent import BaseAgent
from app.agents.sub_agents.LocationFinder import LocationFinder
from app.agents.sub_agents.GeminiFoodFinder import GeminiFoodFinder
from app.agents.sub_agents.NotifyAgent import NotifyAgent
from app.agents.sub_agents.SearchRAGAgent import Hybrid_RAG_agent
from app.agents.sub_agents.NotifyClientAgent import NotifyClientAgent
class FoodServiceAgent(BaseAgent):
    def __init__(self, CoreModel) -> None:
        super().__init__(
            "food_agent",
            "Whenever the user request for food, call this."
        )
        self.model = CoreModel
        self.LocationModel = LocationFinder()
        self.HybridSearch = Hybrid_RAG_agent(CoreModel)
        self.GeminiModel = GeminiFoodFinder() # This is fallback model in bad case!
        self.NotifyClient = NotifyClientAgent(CoreModel)
    def run(self, payload: dict) -> dict:
        payload["output"] = {}
        tmpPayload = self.HybridSearch.run(payload)
        if not tmpPayload["output"]["success"]:
            payload["output"] = self.LocationModel.run(payload)["output"]
            print(payload)
            payload = self.GeminiModel.run(payload)
        else:
            payload["output"] = tmpPayload["output"]
        return payload