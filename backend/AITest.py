from app.agents.supervisor import RootControllerAgent
from app.agents.tools.Ollama import OllamaLocalModel
from app.agents.sub_agents.Test import DeepseekFinder
payload = {
    "message": "Deepseek là gì?"
}

router = OllamaLocalModel("qwen2.5:14b")
root = RootControllerAgent(router)

DeepseekF = DeepseekFinder()
root.register_agent(DeepseekF)

print(root.handle(payload)["output"])