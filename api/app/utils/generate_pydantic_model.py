import json
from pydantic import BaseModel, create_model
from typing import Any, Dict


js_to_py_types = {
    "string": str,
    "number": float,
    "integer": int,
    "boolean": bool,
    "object": dict,
    "array": list,
    "null": None,
    "any": Any,
}

model_counter = {"count": 0}


def generate_model(name: str, schema_str: str) -> BaseModel:
    schema = json.loads(schema_str)

    fields = {}

    for field_name, type_def in schema.items():
        if isinstance(type_def, str):  # base case
            py_type = js_to_py_types.get(type_def, Any)
            fields[field_name] = (py_type, ...)
        elif isinstance(type_def, dict):  # nested object
            model_counter["count"] += 1
            nested_model_name = (
                f"{name}_{field_name.capitalize()}{model_counter['count']}"
            )
            nested_model = generate_model(nested_model_name, type_def)
            fields[field_name] = (nested_model, ...)
        else:
            fields[field_name] = (Any, ...)  # fallback

    return create_model(name, **fields)
