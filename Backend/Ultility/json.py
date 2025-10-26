import json
import re
from typing import List

def extract_json(text: str):
    text = text.strip()

    try:
        return json.loads(text)
    except Exception:
        pass     
    m = re.search(r'(\{.*\}|\[.*\])', text, flags=re.DOTALL)
    if not m:
        raise ValueError("given text is not valid JSON.")
    return json.loads(m.group(1))