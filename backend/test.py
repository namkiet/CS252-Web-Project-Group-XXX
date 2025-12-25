 
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()

# Access the API key using os.environ.get()
# Using .get() is safer as it returns 'None' if the key isn't found
api_key = os.environ.get("API_KEY")


client = genai.Client()

prompt = "What are the best restaurants within a 5-minute walk from here?"

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=prompt,
    config=types.GenerateContentConfig(
        # Turn on grounding with Google Maps
        tools=[types.Tool(google_maps=types.GoogleMaps())],
        # Optionally provide the relevant location context (this is in Los Angeles)
        tool_config=types.ToolConfig(retrieval_config=types.RetrievalConfig(
            lat_lng=types.LatLng(
                latitude=10.762715, longitude=106.682499))),
    ),
)

print("Generated Response:")
print(response.text)

if grounding := response.candidates[0].grounding_metadata:
  if grounding.grounding_chunks:
    print('-' * 40)
    print("Sources:")
    for chunk in grounding.grounding_chunks:
      print(f'- [{chunk.maps.title}]({chunk.maps.uri})')