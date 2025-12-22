from app.agents.BaseAgent import BaseAgent

from app.services.search_service.hybrid_search_service import HybridSearchService
from app.agents.sub_agents.NotifyAgent import NotifyAgent
class Hybrid_RAG_agent(BaseAgent):
    def __init__(self, coreModel) -> None:
        super().__init__(
            "RAG_Food_Search",
            "This is food Search model, which is most optimize one to use. Try this one first if location found"
        )
        self.HybridSearch = HybridSearchService(table_name="abcd")
        self.notify_agent = NotifyAgent(coreModel=coreModel)
    def run(self, payload: dict) -> dict:
        # try:
        msg = payload["message"]
        data = self.HybridSearch.search_restaurants(msg)
        if len(data) > 0:
            return {"output" :{ "message": "The agent success on returning the food list, stop the agent loop."},
                    "payload": data}
        else:
            print("Calling notify agent")
            self.notify_agent.run({"message" : msg})
            return {"output" :{ "message": "The current database does not have enough data, continue attempt using other food agent"}}
        # except:
        #     return {"output" :{ "message": "The most effiecient agent has failed to return output, continue attempt using other food agent"}}
    