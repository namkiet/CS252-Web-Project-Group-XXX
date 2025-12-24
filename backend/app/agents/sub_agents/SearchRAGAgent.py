from app.agents.BaseAgent import BaseAgent

from app.services.search_service.hybrid_search_service import HybridSearchService
from app.agents.sub_agents.NotifyAgent import NotifyAgent
from app.agents.sub_agents.FoodGuesser import FoodGuesserAgent
class Hybrid_RAG_agent(BaseAgent):
    def __init__(self, coreModel) -> None:
        super().__init__(
            "RAG_Food_Search",
            "This is food Search model, which is most optimize one to use. Try this one first if location found"
        )
        self.HybridSearch = HybridSearchService(table_name="abcd")
        self.notify_agent = NotifyAgent(coreModel=coreModel)
        self.FoodGuesser = FoodGuesserAgent(coreModel)
    def _format_output(self, data):
        result = []
        try:
            for d in data:
                restaurant = d.get("restaurant", {})
                if restaurant is None:
                    continue
                dish = d.get("dish", {})
                result.append({
                    "restaurant_name": restaurant.get("raw_name", "Unknown"),
                    "description" : restaurant.get("description", ""),
                    "address": restaurant.get("address", ""),
                    "url": restaurant.get("url", ""),
                    "image": restaurant.get("img_src", ""),
                    "price_range": restaurant.get("price_range", "N/A")
                })
            return result
        except Exception as e:
            print(f"Error Hybrid: {e}")
            
            return []
        
    def run(self, payload: dict) -> dict:
        try:
            
            FoodGuessData = self.FoodGuesser.run(payload)
            msg = payload["message"]
            msg2 = FoodGuessData["output"]["message"]
            data = self.HybridSearch.search_restaurants(msg)
            data2 = self.HybridSearch.search_restaurants(msg2)

            if len(data) * 2 < len(data2):
                data= data2

            if len(data) > 1:

                final_result = {
                    "message": "The agent success on returning the food list, stop the agent loop.",
                    "payload": self._format_output(data),
                    "success": True                
                }
                
                return {"output" :final_result,
                        "payload": data}
            else:
                print("Calling notify agent")
                self.notify_agent.run({"message" : msg})
                return {"output" :{ "message": "The current database does not have enough data, continue attempt using other food agent", "success": False}}
        except:
            return {"output" :{ "message": "The most effiecient agent has failed to return output, continue attempt using other food agent", "success": False}}
    