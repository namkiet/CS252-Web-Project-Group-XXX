from app.agents.supervisor import RootControllerAgent
from app.agents.tools.sub_tools.Router.Ollama import OllamaLocalModel
from app.agents.sub_agents.Test import DeepseekFinder
from app.agents.sub_agents.GeminiFoodFinder import GeminiFoodFinder
from app.agents.sub_agents.LocationFinder import LocationFinder
from app.agents.tools.sub_tools.Router.openRouter import novaLite
from app.agents.tools.PromptCreater import json_to_prompt
payload = {
    "message": "Xung quanh tôi tại Thành phố Hồ Chí Minh có những quán ăn nào?"
}

router = OllamaLocalModel("qwen2.5:14b")
router2 = novaLite()
root = RootControllerAgent(router2)

DeepseekF = DeepseekFinder()
FoodFounder = GeminiFoodFinder()
locFinder = LocationFinder()
root.register_agent(DeepseekF)
root.register_agent(FoodFounder)
root.register_agent(locFinder)
print(root.handle(payload)["output"])

# GOOGLE_API_KEY = ""
# from google import genai
# from google.genai import types
# import os
# from dotenv import load_dotenv

# load_dotenv()

# # Access the API key using os.environ.get()
# # Using .get() is safer as it returns 'None' if the key isn't found
# api_key = os.environ.get("API_KEY")


# client = genai.Client(api_key=GOOGLE_API_KEY)

# prompt = "What are the best restaurants with rice within a 5-minute walk from here?"

# response = client.models.generate_content(
#     model='gemini-2.5-flash',
#     contents=prompt,
#     config=types.GenerateContentConfig(
#         # Turn on grounding with Google Maps
#         tools=[types.Tool(google_maps=types.GoogleMaps())],
#         # Optionally provide the relevant location context (this is in Los Angeles)
#         tool_config=types.ToolConfig(retrieval_config=types.RetrievalConfig(
#             lat_lng=types.LatLng(
#                 latitude=10.762715, longitude=106.682499))),
#     ),
# )

# print("Generated Response:")
# print(response.text)

# if grounding := response.candidates[0].grounding_metadata:
#   if grounding.grounding_chunks:
#     print('-' * 40)
#     print("Sources:")
#     for chunk in grounding.grounding_chunks:
#       print(f'- [{chunk.maps.title}]({chunk.maps.uri})')