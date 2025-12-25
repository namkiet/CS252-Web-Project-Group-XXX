import json
from typing import Any, Mapping, Union

def json_to_prompt(
    data: Union[str, Any],
    *,
    heading_predix:str = "###",
    section_sep: str = "\n\n",
    sort_key: bool = False
):
    if isinstance(data, str):
        return data
    if not isinstance(data, Mapping):
        return json.dumps(data, ensure_ascii=False, indent=2)
    return json.dumps(data, ensure_ascii=False, indent=2)
