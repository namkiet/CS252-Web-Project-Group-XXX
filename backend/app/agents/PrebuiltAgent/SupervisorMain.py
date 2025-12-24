from app.agents.supervisor import RootControllerAgent
from app.agents.tools.sub_tools.Router.Ollama import OllamaLocalModel
from app.agents.sub_agents.Test import DeepseekFinder
from app.agents.sub_agents.GeminiFoodFinder import GeminiFoodFinder
from app.agents.sub_agents.LocationFinder import LocationFinder
from app.agents.tools.sub_tools.Router.openRouter import novaLite
from app.agents.tools.PromptCreater import json_to_prompt
from app.agents.sub_agents.SearchRAGAgent import Hybrid_RAG_agent
from app.agents.sub_agents.NotifyAgent import NotifyAgent
from app.agents.sub_agents.AgentPack.FoodServiceAgent import FoodServiceAgent

def SupervisorAgentPrebuilt1(router):

    root = RootControllerAgent(router)
    foodAgent = FoodServiceAgent(router)

    root.register_agent(foodAgent)
    return root