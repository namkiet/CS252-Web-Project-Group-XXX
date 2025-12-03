from app.agents.BaseAgent import BaseAgent
from app.agents.sub_agents.Default import DefaultAgent
import json

class RootControllerAgent:
    def __init__(self, router_model = None):
        self.router_model = router_model
        self.agents = {}
        default_router = DefaultAgent(router_model)
        self.agents[default_router.name] = default_router
    def register_agent(self, agent: BaseAgent):
        self.agents[agent.name] = agent

    def route(self, user_input: str) -> str:
        if self.router_model is None:
            return self.simple_route(user_input)
        else:
            return self.llm_route(user_input)
    
    def simple_route(self, user_input:str) -> str:
        text = user_input.lower()        
        return "default_agent"
    
    def llm_route(self, user_input: str) -> str:
        
        agents_info = {
            name: agent.description
            for name, agent in self.agents.items()
        }

        prompt = f"""
        You are a routing controller. The user may prompt in englist or in vietnamese.
        User request: "{user_input}"

        Choose the most suitable agent ONLY from the list BELOW:
        {agents_info}

        Replay ONLY in simple name:
        "chosen_agent_name"
        """

        
        result = self.router_model(prompt)
        return result
    
    def LLM_Handle(self, payload) -> dict:
        user_input = payload["message"]
        agent_name = self.route(user_input)
        
        if agent_name not in self.agents:
            print(f"ERROR: Agent Router return unexpected agent - {agent_name} - Process to use the default agent")
            agent_name = "default_agent"
        try:
            agent = self.agents[agent_name]
        except:
            print("ERROR: an unknown error occur, This is very rare so congrat if you get it. chosen agent:", agent_name)
            print("Falling back to default agent...")
            agent_name = "default_agent"
            agent = self.agents[agent_name]
        print("I'm calling:", agent_name)
        return agent.run(payload)
    
    def should_continue(self, user_input, agent_output):
        prompt = f"""
            You are a decision making evaluator.

            User asked: "{user_input}"

            The agent responded with:
            {agent_output}

            Decide whether the agent's answer is FINAL or needs ADDITIONAL questions.
            If the agent output ask the user for futher clarification, then consider it is FINAL.

            Reply with ONLY one word
            - "continue"
            - "stop"
"""
        decision = self.router_model(prompt).strip().lower()
        return decision == "continue"

    def sythesize(self, user_input:str, history:list):
        base_prompt = f"""
            You are a synthesis model. The user originally asked :

            "{user_input}"

            The agent produce multiple partial answer during refinement
            Here are all collected outputs in order:
            {history}

            your job are descripe as following:
                - Combine and integrate the information
                - Remove duplicates
                - produce the BEST final answer in clear JSON format:
                "{{
                    "message": "...",
                    "payload": {{ ... }}
                }}"

            payload is a diction as below:
                "quán ăn 1" : {{"name", "description", "địa chỉ"}}
                "quán ăn 2" : {{"name", "description", "địa chỉ"}}
                "quán ăn n" : {{"name", "description", "địa chỉ"}}
                ...

            with n is the ammount of "quán ăn"
            respond ONLY with the final JSON format for the code to understand, anything else will NOT be accept
            Example response:
            "{{
                "message": "Các món ăn phổ biến giữa phở và bún như cơm phụ hoặc bún hủ sẽ giúp bạn có một trải nghiệm ăn uống thú vị hơn.",
                "payload":{{
                    {{"name": "Quán Gà Rán","description": "Bánh quanh, thịt mềm, vị đặc trưng của món ăn dân dã.","địa chỉ": "83 Nguyễn Thị Minh Khai, Q. Đống Đa"}}
                }} 
            }}"
            STRICT RULE:
                - ONLY JSON INCLUDE
                - NO \\n
                - NO ADDITION TEXT
                - NO ADDITION TAB
"""
        prompt = base_prompt
        last_raw = None
        max_retries = 1
        for attempt in range(max_retries):
            raw = self.router_model(prompt)
            if isinstance(raw, dict):
                return raw
            last_raw = raw

            try:
                parsed = json.loads(raw)
                if "message" not in parsed:
                    raise ValueError("Missing 'message' key in sythesis result")
                return parsed
            except Exception:
                prompt = f"""
                The previous answer fail to satify a VALID JSON or did not match the required structure most likely you put \\n and json text at the beginning.
                Here is What you returned:
                {raw}

                You MUST now reponse again with VALID JSON ONLY for THE CODE TO READ, following EXACTLY this schema:
                {{
                    "message": "...",
                    "payload": {{ ... }}
                }} 
                payload is a diction as below:
                    "quán ăn 1" : {{"name", "description", "địa chỉ"}}
                    "quán ăn 2" : {{"name", "description", "địa chỉ"}}
                    "quán ăn n" : {{"name", "description", "địa chỉ"}}
                    ...
                with n is the ammount of "quán ăn"             
                do NOT INCLUDE any extra text outside the JSON
                Example response:
            "{{
                "message": "Các món ăn phổ biến giữa phở và bún như cơm phụ hoặc bún hủ sẽ giúp bạn có một trải nghiệm ăn uống thú vị hơn.",
                "payload":{{
                    {{"name": "Quán Gà Rán","description": "Bánh quanh, thịt mềm, vị đặc trưng của món ăn dân dã.","địa chỉ": "83 Nguyễn Thị Minh Khai, Q. Đống Đa"}}
                }} 
            }}"
            STRICT RULE:
                - ONLY JSON INCLUDE
                - NO \\n
                - NO ADDITION TEXT
                - NO ADDITION TAB
                - NO include "json" text at the start
                - NO endline if in message
""".strip()
                print(f"WARNING: Synthesis attempt {attempt} failed, retrying")
        print("ERROR: Synthesis model failed to return valid JSON after retries.")
        
        return {
            "message": last_raw or "Synthesis failed",
            "payload": None
        }

    def handle(self, payload) -> dict:
        if self.router_model is None:
            return self.LLM_Handle(payload)
        user_input = payload["message"]
        MAX_LOOPs = 5
        loop_count = 0

        conversation_history = []
        last_result = None

        while loop_count < MAX_LOOPs:
            loop_count += 1

            agent_result = self.LLM_Handle(payload)
            last_result = agent_result

            output = agent_result.get("output", {})
            message = output.get("message", "")
            extra_payload = output.get("payload", None)

            conversation_history.append({
                "message": message,
                "payload": extra_payload
            })

            if self.router_model is None:
                break

            if not self.should_continue(user_input, output):
                break


            payload["message"] = (
                f"{user_input}\n\n"
                f"Previous agent attempt:\n{message}\n"
                f"Additional data: {extra_payload}"
            )

        final_result = self.sythesize(user_input, conversation_history)
        return {"output" :final_result}