import random
import numpy as np
from sklearn.cluster import KMeans
from itertools import permutations
from math import radians, sin, cos, sqrt, atan2

def ScheduleCreate(payload):
    payloadOut = payload.get("output", None)
    if payloadOut is None:
        raise ValueError("ERROR: There is no Output - High chance of Food Service Agent fail or the agent have NOT call yet!")
    food_list = payloadOut.get("payload", None)
    
    if food_list is None:
        raise ValueError("ERROR: There is no payload in Output - High chance of Food Service Agent fail or the agent have NOT call yet!")



    n = len(food_list)

    if n == 0:
        raise ValueError("Food list is empty - High chance of Food Service Agent fail!")
    
    weighted = list(range(n, 0, -1))

    if n <= 2:
        return {
            "output":
            {
                "schedule": food_list
            }
        }
    remaining_foods = food_list[:]
    remaining_weight = weighted[:]
    # I will assume choose 3 / days
    ScheduleList = []
    for i in range(3):
        choice = random.choices(
            remaining_foods,
            weights= remaining_weight,
            k = 1
        )[0]
        idx = remaining_foods.index(choice)
        ScheduleList.append(choice)

        remaining_foods.pop(idx)
        remaining_weight.pop(idx)

    return {
        "output":
        {
            "schedule": ScheduleList
        }
    }

def haversine_distance(coord1, coord2):
    R = 6371
    lat1, lon1 = radians(coord1[0]), radians(coord1[1])
    lat2, lon2 = radians(coord2[0]), radians(coord2[1])

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c

def solve_tsp_order(items):
    """
    Finds the order of items that minimizes total travel distance.
    Since N <= 3 (Breakfast, Lunch, Dinner), brute force is efficient.
    """
    if len(items) <= 1:
        return items

    indices = range(len(items))
    shortest_dist = float('inf')
    best_order_indices = []

    for perm in permutations(indices):
        current_dist = 0
        valid_perm = True
        
        for i in range(len(perm) - 1):
            p1 = items[perm[i]]["coordinates"]
            p2 = items[perm[i+1]]["coordinates"]
            
            if not p1 or not p2:
                valid_perm = False
                break
                
            dist = haversine_distance(
                (p1["lat"], p1["lng"]),
                (p2["lat"], p2["lng"])
            )
            current_dist += dist
        
        if valid_perm and current_dist < shortest_dist:
            shortest_dist = current_dist
            best_order_indices = perm

    return [items[i] for i in best_order_indices]

def ScheduleCreate_(food_list):
    try:
        print(" > Generating schedule from food list...")
        valid_items = []
        print(f"len food list: {len(food_list)}")
        
        # print(f"food list sample: {food_list}")
        for item in food_list:
            if not isinstance(item, dict):
                continue
            coords = item.get("coordinates")
            try:
                if coords:
                    lat = float(coords.get("lat"))
                    lng = float(coords.get("lng"))
                    coords["lat"] = lat
                    coords["lng"] = lng
                    valid_items.append(item)
            except (TypeError, ValueError):
                pass
        
        total_items = len(valid_items)
        print(f" > Total valid items with coordinates: {total_items}")
        if total_items <= 0:
            return {
                "cntDay": 0,
                "schedule": [],
                "restaurant_list": []
            }

        if total_items <= 3:
            return {
                "cntDay": 1,
                "schedule": [
                    {
                        "day": 1,
                        "dish-list": valid_items
                    }
                ],
                "restaurant_list": valid_items
            }
            
        schedule = []
        day = 1
        meal_types = ["Breakfast", "Lunch", "Dinner"]
        restaurants = []
        
        print(" > Clustering restaurants for daily plans...")
        while len(valid_items) >= 3:
            seed = valid_items[0]

            distances = []
            for other in valid_items[1:]:
                dist = haversine_distance(
                    (seed["coordinates"]["lat"], seed["coordinates"]["lng"]),
                    (other["coordinates"]["lat"], other["coordinates"]["lng"])
                )
                distances.append((dist, other))

            distances.sort(key=lambda x: x[0])
            nearest = [seed] + [pair[1] for pair in distances[:2]]

            for item in nearest:
                valid_items.remove(item)

            ordered_items = solve_tsp_order(nearest)

            daily_plan = {
                "day": day,
                "dish-list": []
            }

            for i, item in enumerate(ordered_items):
                meal_entry = {
                    "meal": meal_types[i],
                    "restaurant_name": item.get("restaurant_name", "Unknown"),
                    "description": item.get("description", ""),
                    "address": item.get("address", ""),
                    "url": item.get("url", ""),
                    "coordinates": item.get("coordinates"),
                    "price_range": item.get("price_range", "N/A"),
                    "image": item.get("image", "")
                }
                daily_plan["dish-list"].append(meal_entry)
                restaurants.append(item)
            schedule.append(daily_plan)
            
            day += 1

        print(" > Finished generating schedule.")
        return {
            "cntDay": len(schedule),
            "schedule": schedule,
            "restaurant_list": restaurants
        }
    except Exception as e:
        print(f"Error in ScheduleCreate_: {e}")
        return {
            "cntDay": 0,
            "schedule": [],
            "restaurant_list": []
        }