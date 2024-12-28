import asyncio
import uvicorn

from fastapi import FastAPI
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler


from dotenv import load_dotenv
from middleware.api_token import JWTMiddleware
from fastapi.middleware.cors import CORSMiddleware

from generative.chatbot import ChatBotLLAMA

load_dotenv()


# LIFESPAN USAGE: LOADING A MACHINE LEARNING MODEL 
# BEFORE THE USER CAN MAKE AN API REQUEST 


app = FastAPI()
chat = ChatBotLLAMA()   

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000", "http://localhost:4000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

app.add_middleware(JWTMiddleware)


@app.post("/message/chatbot")
async def paraphrase(data: dict):
    message = data.get('message')

    response = chat.message_api_chatBot(message)
    return { "response": response }


if __name__ == "__main__":
    uvicorn.run(app, port=5000, log_level="info")

# uvicorn main:app --port 5000 --reload