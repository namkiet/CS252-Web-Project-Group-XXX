from Backend.AI.RankerSystem.AIType.Base import AIModel
from Backend.AI.RankerSystem.Embedder.localEmbedManager import local_embeded_Manager
class MiniModel(AIModel):
    def __init__(self):
        super().__init__()
        self.embeder = local_embeded_Manager()