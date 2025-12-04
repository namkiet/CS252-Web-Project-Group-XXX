from app.agents.BaseAgent import BaseAgent
class GeminiFoodFinder(BaseAgent):
    def __init__(self) -> None:
        super().__init__(
            "FoodFinder",
            "This is food finder agent, If there is no longitude and latitude, please call LocationFinder first."
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

        if lat is None or lng is None:
            return {
                "output":{
                    "message": (
                        "Currently missing position, please call the agent LocationFinder to get the exact latitude and longitude."
                    )
                }
            }
    
        print("Location found:", lat, lng)
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                # Turn on grounding with Google Maps
                tools=[types.Tool(google_maps=types.GoogleMaps())],
                # Optionally provide the relevant location context (this is in Los Angeles)
                tool_config=types.ToolConfig(retrieval_config=types.RetrievalConfig(
                    lat_lng=types.LatLng(
                        latitude=lat, longitude=lng))),
            ),
        )

        
        final_result = {
            "message": (
                "This will end the loop if there is no FoodRanker in the list.",
                response.text
            ),
            "payload": {}
        }

        if grounding := response.candidates[0].grounding_metadata:
            if grounding.grounding_chunks:
                for chunk in grounding.grounding_chunks:
                    final_result["payload"][chunk.maps.title] = {
                        "name": chunk.maps.title,
                        "description": "",
                        "địa chỉ": "",
                        "url": chunk.maps.uri
                    }
        return {
            "position": {
                "latitude": lat,
                "longitude": lng,
            },
            "output" :final_result}
