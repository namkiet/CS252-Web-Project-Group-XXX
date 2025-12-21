from app.agents.supervisor import RootControllerAgent
from app.agents.tools.sub_tools.Router.Ollama import OllamaLocalModel
from app.agents.sub_agents.Test import DeepseekFinder
from app.agents.sub_agents.GeminiFoodFinder import GeminiFoodFinder
from app.agents.sub_agents.LocationFinder import LocationFinder
from app.agents.tools.sub_tools.Router.openRouter import novaLite
from app.agents.tools.PromptCreater import json_to_prompt
from app.agents.sub_agents.SearchRAGAgent import Hybrid_RAG_agent
from app.agents.sub_agents.NotifyAgent import NotifyAgent


def SupervisorAgentPrebuilt1():

    router = OllamaLocalModel(model = "qwen2.5:14b")
    router2 = novaLite()
    root = RootControllerAgent(router)
    HybridSearch = Hybrid_RAG_agent(router)
    DeepseekF = DeepseekFinder()
    FoodFounder = GeminiFoodFinder()
    locFinder = LocationFinder()

    root.register_agent(DeepseekF)
    root.register_agent(FoodFounder)
    root.register_agent(locFinder)
    root.register_agent(HybridSearch)
    return root