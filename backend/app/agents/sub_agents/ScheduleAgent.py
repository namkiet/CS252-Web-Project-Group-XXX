from app.agents.BaseAgent import BaseAgent
from app.agents.sub_agents.AgentPack.FoodServiceAgent import FoodServiceAgent
from app.agents.tools.ScheduleCreater import ScheduleCreate
class ScheduleAgent(BaseAgent):
    def __init__(self, CoreModel) -> None:
        super().__init__(
            "ScheduleAgent",
            "Whenever user ask to create a schedule, call this agent."
        )
        self.model = CoreModel
        self.FoodPackAgent = FoodServiceAgent(CoreModel)

    def run(self, payload: dict) -> dict:
        # Model need query
        message = payload["message"]
        payloadOut = payload.get("output", None)
        if payloadOut is None:
            payload["output"] = {}


        FoodPayload = payload["output"].get("payload", None)
        if FoodPayload is None:
            print("NOTICE: The ScheduleAgent need food payload to run, Process to automatically call FoodServiceAgent.")
            FoodAgentResult = self.FoodPackAgent.run(payload)
            payload["output"] = FoodAgentResult["output"]
        try:
            ScheduleList = ScheduleCreate(payload)["output"]["schedule"]
        except:
            return {"output": {
                "message": "Model failed to create a schedule, stop the loop as soon as possible, additional information:" + payload["output"]["message"]
            }}
        return {"output" :{
            "message": payload["output"]["message"],
            "payload": payload["output"]["payload"],
            "schedule": 
            {
                "cntDay": "1",
                "dayList": [
                    {
                        "day": "1",
                        "dish-list": ScheduleList
                    }
                ]
            }
        }}
