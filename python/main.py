import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from generative.paraphrase import GenerativeParaphrase
from dotenv import load_dotenv
from middleware.api_token import JWTMiddleware

load_dotenv()


app = FastAPI()
gen = GenerativeParaphrase()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

app.add_middleware(JWTMiddleware)

class Paraphrase(BaseModel):
    original_text: str
    paraphrase_mode: str


@app.post("/paraphrase")
async def paraphrase(data: Paraphrase):
    paraphrased_text = gen.paraphrase_text(data.original_text, data.paraphrase_mode)
    return { "paraphrased_text": paraphrased_text }

# uvicorn main:app --port 5000 --reload