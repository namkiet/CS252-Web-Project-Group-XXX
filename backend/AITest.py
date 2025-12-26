import time
from app.agents.supervisor import RootControllerAgent
from app.agents.tools.sub_tools.Router.Ollama import OllamaLocalModel
from app.agents.sub_agents.Test import DeepseekFinder
from app.agents.sub_agents.GeminiFoodFinder import GeminiFoodFinder
from app.agents.sub_agents.LocationFinder import LocationFinder
from app.agents.tools.sub_tools.Router.openRouter import novaLite
from app.agents.tools.PromptCreater import json_to_prompt
from app.agents.sub_agents.SearchRAGAgent import Hybrid_RAG_agent
from app.agents.sub_agents.NotifyAgent import NotifyAgent
from app.agents.sub_agents.AgentPack.FoodServiceAgent import FoodServiceAgent
from app.agents.PrebuiltAgent.SupervisorMain import SupervisorAgentPrebuilt1
from app.agents.tools.ScheduleCreater import ScheduleCreate
from app.agents.sub_agents.ScheduleAgent import ScheduleAgent
payload = {
    "message": "Món có vị cay ở quận tân phú Thành phố Hồ chí Minh",
}

# data = ScheduleCreate(payload)
# print(data)


router = OllamaLocalModel(model = "qwen2.5:14b")
router2 = novaLite()
root = SupervisorAgentPrebuilt1(router)

HybridSearch = Hybrid_RAG_agent(router)
notify_agent = NotifyAgent(router)
myFoodAgent = FoodServiceAgent(router)
myScheduleAgent = ScheduleAgent(router)

print("10")
start_time = time.perf_counter()
data = myScheduleAgent.run(payload)
end_time = time.perf_counter()
elapsed_time = end_time - start_time
print(f"Tra loi trong {elapsed_time:.2f} giây")
print(data)
print("finish")

# DeepseekF = DeepseekFinder()
# FoodFounder = GeminiFoodFinder()
# locFinder = LocationFinder()

# root.register_agent(DeepseekF)
# root.register_agent(FoodFounder)
# root.register_agent(locFinder)
# ans = root.handle(payload)
# print("My message:", ans)
# print("------------------------------------\n",ans)
# # GOOGLE_API_KEY = ""
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

# from GeminiCrawl.utilities import GeminiCrawl, UniqueCsv
# import pandas as pd
# import os
# # result = GeminiCrawl("Những Món ăn đặc sản của Việt Nam", 50)
# # for food in result["output"]["payload"]:
# #     print(food["restaurant_name"])
# # payload = result["output"]["payload"]
# # new_df = pd.DataFrame(payload)
# csv_path = "data/geminiCrawlTest.csv"
# # if os.path.exists(csv_path):
# #     old_df = pd.read_csv(csv_path)
# #     df = pd.concat([old_df, new_df], ignore_index=True)
# # else:
# #     df = new_df

# # df.to_csv(csv_path, index=False, encoding="utf-8-sig")
# UniqueCsv(csv_path)
# print("saved")