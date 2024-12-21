import asyncio
import uvicorn

from fastapi import FastAPI
from contextlib import asynccontextmanager
from apscheduler.schedulers.asyncio import AsyncIOScheduler


from dotenv import load_dotenv
from middleware.api_token import JWTMiddleware
from fastapi.middleware.cors import CORSMiddleware

from type.paraphrase import Paraphrase
from generative.paraphrase import GenerativeParaphrase
from generative.warming_model import keep_model_warm

load_dotenv()


# LIFESPAN USAGE: LOADING A MACHINE LEARNING MODEL 
# BEFORE THE USER CAN MAKE AN API REQUEST 

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = AsyncIOScheduler()
    scheduler.add_job(keep_model_warm, "interval", days=1)
    scheduler.start()
    print("Scheduler started.")

    try:
        yield
    finally:
        print("Shutting down scheduler.")
        scheduler.shutdown()


app = FastAPI(lifespan=lifespan)
gen = GenerativeParaphrase()    

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

app.add_middleware(JWTMiddleware)


@app.post("/paraphrase")
async def paraphrase(data: Paraphrase):
    paraphrased_text = gen.paraphrase(data.original_text.strip(), data.paraphrase_mode)
    return { "paraphrased_text": paraphrased_text }


if __name__ == "__main__":
    uvicorn.run(app, port=5000, log_level="info")

# uvicorn main:app --port 5000 --reload