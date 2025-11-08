from sentence_transformers import SentenceTransformer


def loadEmbedding(modelName = 'all-MiniLM-L6-v2'):
    model = SentenceTransformer(modelName)
    return model

def embedText(text, model, show_progress_bar = True):
    return model.encode(text, convert_to_numpy = True, show_progress_bar = show_progress_bar)

