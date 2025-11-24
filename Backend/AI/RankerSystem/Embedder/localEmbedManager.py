from Backend.AI.RankerSystem.Loader.ModelLoader import loadEmbedding, embedText

class local_embeded_Manager:
    def __init__(self, model_name = "all-MiniLM-L6-v2"):
        self.model = loadEmbedding(model_name)
    
    def embed_text(self, text):
        return self.model.encode(text, convert_to_numpy = True, show_progress_bar = True)
    