import io
import os
import uvicorn
import uuid
import asyncio
import json

from fastapi import FastAPI, WebSocket, WebSocketDisconnect

from dotenv import load_dotenv
from middleware.api_token import JWTMiddleware
from fastapi.middleware.cors import CORSMiddleware

from generative.chatbot import ChatBotLLAMA
from generative.audiobot import AudioBot

load_dotenv()

app = FastAPI()
chat = ChatBotLLAMA()   
audio_bot = AudioBot()

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


@app.websocket('/audio/ws')
async def audio_websocket(websocket: WebSocket):
    audio_data = io.BytesIO()

    await websocket.accept() 
    print("Client connected")

    try:
        while True:
            # Receive audio chunk from the WebSocket connection
            audio_chunk = await websocket.receive_bytes()
            
            if audio_chunk:
                print(f"Received {len(audio_chunk)} bytes")
                audio_data.write(audio_chunk)

            if audio_data.tell() > 0:

                file_name = f"audio/{uuid.uuid4()}.webm"

                print(f"Total bytes to send {audio_data.tell()} bytes")
                await asyncio.to_thread(audio_bot.upload_audio_s3, audio_data, file_name)

                s3_bucket_name = "quickquill"
                uploaded_file_name = f"s3://{s3_bucket_name}/{file_name}"


                transcribed_text = await audio_bot.transcribe_audio(uploaded_file_name)
                print("transcribed_text: ", transcribed_text)

                if transcribed_text:
                    response_text = chat.message_api_chatBot(transcribed_text) 

                    speech_file_name = audio_bot.convert_response_to_speech(response_text)

                    file_size = os.path.getsize(speech_file_name)
                    print(f"Total bytes to send: {file_size}")

                    with open(speech_file_name, "rb") as audio_file:
                        while chunks := audio_file.read(64 * 1024):
                            await websocket.send_bytes(chunks)

                    await websocket.send_text(json.dumps({
                        'is_end_of_audio': True,
                        'content': response_text,
                    }))

    except Exception as e:
        print(f"Error in WebSocket handling: {e}")
        await websocket.close()  
    except WebSocketDisconnect:
        print("Client disconnected")
       
if __name__ == "__main__":
    uvicorn.run(app, port=5000, log_level="info")

# uvicorn main:app --port 5000 --reload