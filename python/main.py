import uvicorn

from fastapi import FastAPI
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

class Paraphrase(BaseModel):
    original_text: str


# IMPLEMENT A MIDDLEWARE THAT CHECK THE BEARER TOKEN FROM THE PHP REQUEST
# THE TOKEN IS STATIC IN THE DATABASE

@app.post("/paraphrase")
async def paraphrase(data: Paraphrase):
    # IMPLEMENT THE PARAPHRASE LOGIC
    return {
        "paraphrased_text": data.original_text,
    }

if __name__ == "__main__":
    print("Fast API Server Listens to Port 5000")
    uvicorn.run(app, port=5000, host='0.0.0.0')