from app.agents.BaseAgent import BaseAgent
from app.agents.sub_agents.Default import DefaultAgent
from app.agents.tools.PromptCreater import json_to_prompt
import json


class RootControllerAgent:
    def __init__(self, router_model = None):
        self.router_model = router_model
        self.agents = {}
        default_router = DefaultAgent(router_model)
        self.agents[default_router.name] = default_router
        self.PreviousCall = ""
        self.CurrentCall = ""
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
        
        Pay attention to the previous request from agent, if it requested then call it.

        Replay ONLY in simple name:
        chosen_agent_name
        """

        
        result = self.router_model(prompt)
        return result
    
    def LLM_Handle(self, payload) -> dict:
        user_input = payload["message"]
        print("user_input:", user_input)
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
        self.PreviousCall = self.CurrentCall
        self.CurrentCall = agent_name
        if self.__CheckDupeCall():
            return payload
        return agent.run(payload)
    def __CheckDupeCall(self):
        
        if self.PreviousCall != "":
            return self.PreviousCall == self.CurrentCall
        return False
    def should_continue(self, user_input, agent_output):
        prompt = f"""
            You are a decision making evaluator.

            User asked: "{user_input}"

            The agent responded with:
            {agent_output}

            Decide whether the agent's answer is FINAL or needs ADDITIONAL questions.
            If the agent output ask the user for futher clarification, then consider it is FINAL.
            Some model may ask for other agentic to run first with keyword "agent". If that happen then continue.
            If the answer still not answer the user query, continue. 
            If there is apology in generation, stop.
            If the agent specific tell to stop, stop.
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
                - produce the BEST final answer in clear message.
                - If there is apology content from outputs, focus on that ONLY.
                - Avoid using markdown or latex, result in plain text only.
                - Never mention about agent, if the agent tell it success then return something like "Rất vui được hỗ trợ bạn, dưới đây là những món có thể đúng ý bạn, bạn có thể đưa thêm thông tin để tìm chi tiết hơn!"
                - Remove food related, remove link, remove address, remove restaurant , keep it short
            Keep user friendly attitude.
"""
        prompt = base_prompt
        last_raw = None
        max_retries = 1
        raw = self.router_model(prompt)
        return raw

    def handle(self, payload) -> dict:
        self.PreviousCall = ""
        self.CurrentCall = ""
        if self.router_model is None:
            return self.LLM_Handle(payload)
        user_input = json_to_prompt(payload)
        MAX_LOOPs = 5
        loop_count = 0

        conversation_history = []
        last_result = None
        conversation_history_str = ""
        while loop_count < MAX_LOOPs:
            loop_count += 1
            agent_result = self.LLM_Handle(payload)
            if self.__CheckDupeCall():
                break
            output = agent_result.get("output", {})
            last_result = output["message"]
            message = json_to_prompt(output)
            conversation_history_str = (
                "-------------------"
                f"Agent: {loop_count}"
                f"Response: {message}"
            )

            extra_payload = output.get("payload", None)

            conversation_history.append({
                "message": message,
                "payload": extra_payload
            })

            if self.router_model is None:
                break
            
            if not self.should_continue(user_input, conversation_history_str):
                break
            

            payload["message"] = (
                f"{user_input}\n\n"
                f"Previous agent attempt:\n{message}\n"
                f"Additional data: {extra_payload}"
            )
            output["message"] = payload["message"]
            payload = output
        final_result = {}
        
        final_result["output"] = output
        
        
        final_result["output"]["message"] = self.sythesize(user_input, conversation_history)
        return final_result