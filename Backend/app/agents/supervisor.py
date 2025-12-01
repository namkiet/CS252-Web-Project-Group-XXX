from Backend.app.agents.BaseAgent import BaseAgent
from Backend.app.agents.sub_agents.Default import DefaultAgent

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
        
    def handle(self, payload) -> dict:
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
        return agent.run(payload)