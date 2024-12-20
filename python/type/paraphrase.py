from pydantic import BaseModel

class Paraphrase(BaseModel):
    original_text: str
    paraphrase_mode: str