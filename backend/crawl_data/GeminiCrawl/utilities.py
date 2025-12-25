from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
import re
import pandas as pd

def UniqueCsv(csv_path):
    df = pd.read_csv(csv_path)

    df = df.drop_duplicates(subset=["restaurant_name"], keep="first")  # or keep="last"

    df.to_csv(csv_path, index=False, encoding="utf-8-sig")
    print("Rows after dedupe:", len(df))


def GeminiCrawl(Message: str, loopCount = 5) -> dict:
    try:
        print("Called\n")
        final_result = {
                "message": (
                    ""
                ),
                "payload": []
            }
        if loopCount <= 1:
            modelName = "gemini-3-pro"        
        if loopCount <= 3:
            modelName = "gemini-2.5-pro"
        if loopCount <= 5:
            modelName = "gemini-2.5-flash"
        if loopCount > 5:
            modelName = "gemini-2.5-flash"
        load_dotenv()
        api_key = os.environ.get("GOOGLE_API_KEY")
        if loopCount > 20:
            print(f"WARNING: you are going to have massive loop count (loop count = {loopCount}). If this is not your intention please cancel or break the run!")
        print(f"Notify: Based on the loop count, choosing model name = {modelName}")
        for i in range(loopCount):
            print(f"Notify: In the current loop = {i}")
            
            prompt = (
                "Your job is to find around the provided location in the user query"
                f"User query : {Message}"
                f"Find at least more than 20 location base on query."
                "On message you MUST return output nothing"
            )
            client = genai.Client(api_key=api_key)
            # I ASSUME THAT YOU ALREADY HAVE MESSAGE IN THE INPUT

            response = client.models.generate_content(
                model=modelName,
                contents=prompt,
                config=types.GenerateContentConfig(
                    # Turn on grounding with Google Maps
                    tools=[types.Tool(google_maps=types.GoogleMaps())],
                ),
            )

            
            final_result["message"] = response.text
            if grounding := response.candidates[0].grounding_metadata:
                if grounding.grounding_chunks:
                    for chunk in grounding.grounding_chunks:
                        final_result["payload"].append(
                            {
                                "restaurant_name": chunk.maps.title,
                                "url": chunk.maps.uri
                            }
                        )
        return {"output" :final_result}
    except:
        return {
                "error" : "API key dead",
                "output":{
                    
                    "message": (
                        f"API key dead : {api_key}"
                    )
                }
            }