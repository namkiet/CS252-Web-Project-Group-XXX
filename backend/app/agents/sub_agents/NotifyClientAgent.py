from app.agents.BaseAgent import BaseAgent
class NotifyClientAgent(BaseAgent):
    def __init__(self, CoreModel) -> None:
        super().__init__(
            "NotifyClientAgent",
            "The model itself check if the agent return good or not to notify client."
        )
        self.model = CoreModel

    def run(self, payload: dict) -> dict:
        # Model need query
        message = payload["message"]

        prompt = f"""
            You are given a success or failure result. Your job is to notify user as following rule:
                - The user prompt will be in English or Vietnamese, only answer within these two language base on the user prompt.
                - ONLY answer in one language, never mix English and Vietnamese at the same time EXCEPT for name.
                - If successfully done, Return something like "Sau đây là món gợi ý cho bạn, nếu bạn có yêu cầu nào cụ thể hơn thì nói mình nhé", keep this as friendly as possible
                - If failure, Return something like "Hiện tại có vẻ mình chưa hiểu ý định của bạn lắm, bạn có thể cụ thể hơn được không?", also keep this friendly
                - Avoid using markdown or latex, result in plain text only.
            user prompt : {message}
        """
        return {"output" :{ "message": self.model(message)}}
