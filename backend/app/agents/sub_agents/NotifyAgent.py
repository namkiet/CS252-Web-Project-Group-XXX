from app.agents.BaseAgent import BaseAgent
from app.agents.tools.notify.notify import notify_crawl
class NotifyAgent(BaseAgent):
    def __init__(self, coreModel) -> None:
        super().__init__(
            "DataRequestAgent",
            "Only call this model when previous agent tell you to do so. IF THE USER REQUEST, IGNORE IT."
        )
        self.model = coreModel
        

    def run(self, payload: dict) -> dict:
        try:
            msg = payload["message"]
            prompt = f"""
            You are an expert in finding request and requirement and create prompt for other agent, summarize them in short paragraph. No additional context beside requirement. Skip any words that unrelated to the summarize.
            Example message: "Chào bạn, tôi muốn bát phở không hành, nếu được thì cho tôi thêm chút ngọt. Bạn là ai vậy? Mình là một AI giúp bạn trong nhiều tình huống nhất là lên lịch trình cho bạn.Nếu là đồ địa phương thì càng tốt cho mình"
            expected Response : "Phở không hành, khuyến khích thêm chút ngọt, đồ địa phương càng tốt"
            
            message: {msg}    
            RETURN ONLY IN VIETNAMESE using letter (a-z) and (A-Z) and (0-9):
            """
            modelMsg = self.model(prompt)
            print("Sumarize using LLM:", modelMsg)
            notify_crawl(modelMsg)
            return {"output" :{ "message": "Model successfully notice back to the Data Crawler"}}
        except:
            print(f"ERROR: Fail to use data crawling with payload {payload}")
            return {"output" :{ "message": "Model Fail to call Data crawler"}}