from app.agents.BaseAgent import BaseAgent

from app.services.search_service.hybrid_search_service import HybridSearchService
from app.agents.sub_agents.NotifyAgent import NotifyAgent
from app.agents.sub_agents.FoodGuesser import FoodGuesserAgent
import re
import requests

def geocode_nominatim(address: str):
    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {
            "q": address,
            "format": "jsonv2",
            "limit": 1,
            "countrycodes": "vn",
        }
        headers = {
            "User-Agent": "LocalFood/1.0 (contact: your_email@example.com)"
        }
        r = requests.get(url, params=params, headers=headers, timeout=20)
        r.raise_for_status()
        data = r.json()
        if not data:
            return None
        return {"lat": float(data[0]["lat"]), "lng": float(data[0]["lon"])}
    except:
        return None

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
                res_url = restaurant.get("url", None)
                
                targetResult = {
                    "restaurant_name": restaurant.get("raw_name", "Unknown"),
                    "description" : restaurant.get("description", ""),
                    "address": restaurant.get("address", ""),
                    "url": restaurant.get("url", ""),
                    "image": restaurant.get("img_src", ""),
                    "price_range": restaurant.get("price_range", "N/A"),
                    "coordinates": geocode_nominatim(restaurant.get("address", ""))
                }
                result.append(targetResult)

            return result
        except Exception as e:
            print(f"Error Hybrid: {e}")
            
            return []
        
    def run(self, payload: dict) -> dict:
        try:
            
            
            msg = payload["message"]
            data = self.HybridSearch.search_restaurants(msg)
            if len(data) > 1:

                final_result = {
                    "message": "The agent success on returning the food list, stop the agent loop.",
                    "payload": self._format_output(data),
                    "success": True                
                }
                
                return {"output" :final_result,
                        "payload": data}
            else:
                FoodGuessData = self.FoodGuesser.run(payload)
                msg2 = FoodGuessData["output"]["message"]
                data = self.HybridSearch.search_restaurants(msg2)
                print("NOTICE: The first attempt failed, retry with food guesser. 90% will work =)))")
                
                if len(data) > 1:
                    final_result = {
                        "message": "The agent success on returning the food list, stop the agent loop.",
                        "payload": self._format_output(data),
                        "success": True                
                    }
                    
                    return {"output" :final_result,
                            "payload": data}

                print("NOTICE: Calling notify agent, It seem the food is not in the data base")
                self.notify_agent.run({"message" : msg})
                return {"output" :{ "message": "The current database does not have enough data, continue attempt using other food agent", "success": False}}
        except:
            return {"output" :{ "message": "The most effiecient agent has failed to return output, continue attempt using other food agent", "success": False}}
    