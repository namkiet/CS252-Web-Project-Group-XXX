from app.agents.tools.sub_tools.RankerSystem.Reranker.Utility import rerank_withReason, rerank, rerank_withSimilarity


class GPTRerank:
    def __init__(self):
        self.__history = []

    def rerank(self, data, prompt, top_k = 5, mode = "similarity", column = "combined"):
        # this method provide 3 mode, with lower case matter:
        # standard
        # reason
        # similarity
        mode.lower()
        if mode == "similarity":
            rankedData = rerank_withSimilarity(data, prompt, column = column, top_k = top_k)
        elif mode == "standard":
            rankedData = rerank(data, prompt, column = column, top_k = top_k)
        elif mode == "reason":
            rankedData = rerank_withReason(data, prompt, column = column, top_k = top_k)
        else:
            for c in mode:
                if int(c) >= int('A') and int(c) <= int('Z'):
                    raise TypeError(f"Your mode ({mode}) contant upper case, please notice that lower case does matter")
            raise TypeError(f"mode {mode} is not found. Please select in the following: standard, season, similarity")
        return rankedData
    
