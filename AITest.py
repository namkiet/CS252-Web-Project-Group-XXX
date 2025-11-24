from Backend.AI.CoreRoot.RootController import RootControllerAgent
from Backend.AI.AgentList.Ollama import OllamaLocalModel
from Backend.AI.AgentList.Test import DeepseekFinder
payload = {
    "message": "Dựa trên prompt: Tôi muốn ăn bún nhưng không muốn ăn phở. Món nào sau đây là tốt nhất : Phở Bò, Bún Bò Huế, Cơm Sườn"
}

router = OllamaLocalModel("qwen2.5:1.5b")
root = RootControllerAgent(router)

DeepseekF = DeepseekFinder()
root.register_agent(DeepseekF)

print(root.handle(payload)["output"])