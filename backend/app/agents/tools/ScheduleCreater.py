import random

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