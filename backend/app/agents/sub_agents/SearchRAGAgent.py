from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict

from app.agents.BaseAgent import BaseAgent
from app.utils.get_coord import get_coords_with_selenium
from app.services.search_service.hybrid_search_service import HybridSearchService
from app.agents.sub_agents.NotifyAgent import NotifyAgent
from app.agents.sub_agents.FoodGuesser import FoodGuesserAgent
from app.agents.sub_agents.intentAgent import IntentAgent
from app.agents.tools.ScheduleCreater import ScheduleCreate_
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
            "User-Agent": "LocalFood/1.0 (contact: abdss@gmail.com)"
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
        self.Intent = IntentAgent(coreModel)
        self.llm = coreModel
        
    def _format_output(self, data):
        result = []
        
        restaurant_list = [
            d for d in data
            if d.get("restaurant") is not None
        ]
        
        try:
            for d in restaurant_list:
                restaurant = d.get("restaurant", {})

                dish = d.get("dish", {})
                res_url = restaurant.get("url", None)
                address = restaurant.get("address", "")
                address_clean = address + " Ho Chi Minh City, Vietnam"

                lat, lon = get_coords_with_selenium(res_url) if res_url else (None, None)
                print(f"lat: {lat}, lon: {lon}")
                coords = {
                    "lat" : lat,
                    "lng" : lon
                }
                
                # print("Heello")
                targetResult = {
                    "restaurant_name": restaurant.get("raw_name", "Unknown"),
                    "description" : restaurant.get("description", ""),
                    "address": restaurant.get("address", ""),
                    "url": restaurant.get("url", ""),
                    "image": restaurant.get("img_src", ""),
                    "price_range": restaurant.get("price_range", "N/A"),
                    "coordinates": coords
                }
                # print("Waiting")
                result.append(targetResult)   
            return result
        except Exception as e:
            print(f"Error Hybrid: {e}")
            
            return []
    
    def run_dish_search(self, payload: dict) -> dict:
        try:
            msg = payload["message"]
            data = self.HybridSearch.search_restaurants(msg, True)
            if len(data) > 1:
                format_data = self._format_output(data)
                
                final_result = {
                    "message": "The agent success on returning the food list, stop the agent loop.",
                    "payload": format_data,
                    "success": True                
                }
                
                return {"output" :final_result,
                        "payload": data}
            else:
                FoodGuessData = self.FoodGuesser.run(payload)
                msg2 = FoodGuessData["output"]["message"]
                data = self.HybridSearch.search_restaurants(msg2)
                print("NOTICE: The first attempt failed, retry with food guesser. 90% will work =)))")
                
                format_data = self._format_output(data)
                
                if len(data) > 1:
                    final_result = {
                        "message": "The agent success on returning the food list, stop the agent loop.",
                        "payload": format_data,
                        "success": True                
                    }
                    
                    return {"output" :final_result,
                            "payload": data}

                print("NOTICE: Calling notify agent, It seem the food is not in the data base")
                self.notify_agent.run({"message" : msg})
                return {"output" :{ "message": "The current database does not have enough data, continue attempt using other food agent", "success": False}}
        except:
            return {"output" :{ "message": "The most effiecient agent has failed to return output, continue attempt using other food agent", "success": False}}
    
    def _classify_intent(self, query: str) -> bool:
        prompt = f"""
        Does the following query mention food preferences or restrictions
        (e.g., allergies, ingredients, spicy/non-spicy, vegan)?

        Query: "{query}"

        Answer TRUE or FALSE only.
        """
        try:
            res = self.llm(prompt).strip().upper()
            
            if "TRUE" in res:
                return True
            return False
            
        except Exception as e:
            print(f"Error in IntentVerifier: {e}")
            return False
        
    def run_schedule_search(self, payload: dict) -> dict:
        try:
            msg = payload["message"]
            # FoodGuessData = self.FoodGuesser.run(payload)
            # msg2 = FoodGuessData["output"]["message"]
            specific_dish = ["Hủ tiếu", "Phở", "Cơm tấm"]
            print(" > Found specific dishes:", specific_dish)
            
            restaurant_list = []
            # print("0")
            for dish in specific_dish:
                data = self.HybridSearch.search_restaurants(dish, False)
                if len(data) <= 1:
                    continue
                restaurant_list.extend(data[:2])
            # print("1")
            # print(f"-----Restaurant List")
            # print(restaurant_list)
            # print(" > Classify intent for schedule search...")
            intent_has_constraint = self._classify_intent(msg)
            
            if intent_has_constraint:
                print(" > Intent has constraints, verifying results...")
                restaurant_list = self.verify_schedule_search(msg, restaurant_list)
                
            # restaurant_list = self.HybridSearch.verify_results(msg, restaurant_list)
            # print("HERE")
            format_data = self._format_output(restaurant_list)
            
            print(" > Creating schedule...")
            response = ScheduleCreate_(format_data)
            
            if not response or response["cntDay"] == 0:
                return {"output" :{ "message": "Schedule agent failed to create schedule from the found restaurants", "success": False}}
            
            print(f">>> LIST: {response.get("restaurant_list")}")
            format_res = response.get("restaurant_list", [])
            # format_res = self._format_output(response["restaurant_list"])
            # print(f">>> FORMAT: {format_res}")
            schedule_info = {
                "cntDay": response["cntDay"],
                "schedule": response["schedule"],
            }
            
            final_result = {
                "message": "The agent success on returning the schedule plan, stop the agent loop.",
                "payload": format_res,
                "schedule" : schedule_info,
                "success": True
            }
            
            return {"output": final_result}
        except Exception as e:
            print(f"Error in Schedule Search: {e}")
            return {"output" :{ "message": "Schedule agent failed to process the request", "success": False}}
        
    def run(self, payload: dict) -> dict:
        try:
            msg = payload["message"]
            is_dish_search = self.Intent.run(msg)
            if is_dish_search:
                return self.run_dish_search(payload)
            else:
                return self.run_schedule_search(payload)
        except Exception as e:
            print(f"Error in RAG Agent: {e}")
            return {"output" :{ "message": "RAG Agent failed to process the request", "success": False}}
    
    
    def verify_schedule_search(self, user_query: str, candidates: List[Dict]) -> List[Dict]:
        
        print(f" > [Schedule] Verifying {len(candidates[:8])} candidates (Parallel)...")
        verified_results = []

        def verify_single_item(doc: Dict):
            dish = doc.get("dish") or {}
            res = doc.get("restaurant") or {}

            if not res:
                return None

            dish_name = dish.get("raw_dish_name") or dish.get("dish_name") or "UNKNOWN"
            dish_desc = dish.get("description", "")
            restaurant_name = res.get("raw_name") or res.get("name", "UNKNOWN")
            restaurant_desc = res.get("description", "")

            print("--------------------------------")
            print(f" [*] Schedule check: {dish_name} @ {restaurant_name}")
            print("--------------------------------")

            prompt = f"""
            ROLE: You are a Meal Planning Assistant.

            USER REQUEST:
            "{user_query}"

            ITEM:
            - Dish name: {dish_name}
            - Dish description: {dish_desc}
            - Restaurant description: {restaurant_desc}

            TASK:
            Decide if this item VIOLATES any EXPLICIT user constraint.

            RULES (VERY IMPORTANT):
            - Only return NO_MATCH if there is a CLEAR contradiction.
            - If information is missing, unclear, or silent → MATCH.
            - Do NOT require exact dish matching.
            - Schedule planning prioritizes availability over precision.

            Examples:
            - User: "vegetarian" | Desc: "beef noodle soup" → NO_MATCH
            - User: "no spicy" | Desc: "spicy chili beef" → NO_MATCH
            - User: "eat in district 1" | Address missing → MATCH
            - User: "Pho" | Dish: "Hu tieu" → MATCH (same category)

            OUTPUT (ONLY ONE WORD):
            MATCH or NO_MATCH
            """

            try:
                response = self.llm.generate_content(prompt).strip().upper()

                # strict parse
                verdict = "MATCH"
                if "NO_MATCH" in response:
                    verdict = "NO_MATCH"

                if verdict == "MATCH":
                    return doc

                print(f" [x] Schedule rejected: {dish_name} @ {restaurant_name}")
                return None

            except Exception as e:
                # FAIL OPEN for schedule
                print(f" [!] Schedule verifier error → ACCEPT ({e})")
                return doc

        with ThreadPoolExecutor(max_workers=8) as executor:
            futures = [executor.submit(verify_single_item, doc) for doc in candidates[:8]]

            for future in as_completed(futures):
                res = future.result()
                if res:
                    verified_results.append(res)

        print(f" > [Schedule] Accepted {len(verified_results)} items")
        return verified_results
        