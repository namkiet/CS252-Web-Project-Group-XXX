from Backend.app.agents.tools.sub_tools.RankerSystem.AIType.Base import AIModel
from Backend.app.agents.tools.sub_tools.RankerSystem.Embedder.localEmbedManager import local_embeded_Manager
class MiniModel(AIModel):
    def __init__(self):
        super().__init__()
        self.embeder = local_embeded_Manager()