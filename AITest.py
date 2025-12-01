from Backend.app.agents.supervisor import RootControllerAgent
from Backend.app.agents.tools.Ollama import OllamaLocalModel
from Backend.app.agents.sub_agents.Test import DeepseekFinder
payload = {
    "message": "Dựa trên prompt: Tôi muốn ăn bún nhưng không muốn ăn phở. Món nào sau đây là tốt nhất : Phở Bò, Bún Bò Huế, Cơm Sườn"
}

router = OllamaLocalModel("qwen2.5:1.5b")
root = RootControllerAgent(router)

DeepseekF = DeepseekFinder()
root.register_agent(DeepseekF)

print(root.handle(payload)["output"])