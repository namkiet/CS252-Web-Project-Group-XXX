from app.agents.BaseAgent import BaseAgent
class LocationFinder(BaseAgent):
    def __init__(self) -> None:
        super().__init__(
            "LocationFinder",
            """
                This is location Finder agent, called this when there is no longitude and latitude in the output, ignore it if it in the input.
            """
        )

    def run(self, payload: dict) -> dict:
        from google import genai
        from google.genai import types
        import os
        from dotenv import load_dotenv

        load_dotenv()
        api_key = os.environ.get("GOOGLE_API_KEY")


        client = genai.Client(api_key=api_key)
        # I ASSUME THAT YOU ALREADY HAVE MESSAGE IN THE INPUT
        prompt = payload["message"]
        pos = payload.get("position")
        lat = None
        lng = None
        if pos is not None:
            lat = pos.get("latitude", None)
            lng = pos.get("longitude", None)

        if lat is None:
            location_query = (
                "Extract the most likely latitude from this message, if it contain a location try to find it latitude."
                "Return in a single float number, no EXTRA text."
                "If there is no location return will null."
                f"message: {prompt}"
            )
            loc_resp = client.models.generate_content(
                model = "gemini-2.5-flash",
                contents=location_query
            )

            resp = loc_resp.text
            try:
                cleaned = resp.split()[0]
                cleaned = cleaned.replace(",", "")  
                lat = float(cleaned)
            except:
                if(resp != "null"):
                    print("LLM Response:", resp)

        if lng is None:
            location_query = (
                "Extract the most likely longitude from this message, if it contain a location try to find it longitude."
                "Return in a single float number, no EXTRA text."
                "If there is no location return will null."
                f"message: {prompt}"
            )
            loc_resp = client.models.generate_content(
                model = "gemini-2.5-flash",
                contents=location_query
            )   
            resp = loc_resp.text
            try:
                cleaned = resp.split()[0]
                cleaned = cleaned.replace(",", "")  
                lng = float(cleaned)
            except:
                if(resp != "null"):
                    print("LLM Response:", resp)


        if lat is None or lng is None:
            return {
                "output":{
                    "message": ("End the loop, we will ask client for further clarification, return the following prompt:"
                            "Bạn vui lòng cho minh biết vị trí của bạn ở đâu được không? Mình không rõ bạn đang ở đâu để có thể đề xuất món ăn hoặc nhà hàng cho bạn ^^."
                    )   
                }
            }
        return {
            
            "output" :{
                    "position": {
                        "latitude": lat,
                        "longitude": lng,
                    },
                    "message": "Now there is position, you are free to call other agent that need position.",
                    "payload": {}
                }
            }
