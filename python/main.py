import io
import os
import uvicorn
import asyncio
import json


import ffmpeg

from google.cloud import speech

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

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\John Kristan\Documents\quickquill_service_account_key.json"

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



client = speech.SpeechClient()

def convert_webm_to_linear16(audio_data: io.BytesIO) -> bytes:
    """Convert the WebM audio chunk into LINEAR16 PCM format."""
    input_data = audio_data.getvalue()

    print('convert_function_used')

    try:
        stdout, stderr = (
            ffmpeg.input('pipe:0')
            .output('pipe:1', ac=1, ar=16000, f='wav', acodec='pcm_s16le')
            .run(input=input_data, capture_stdout=True, capture_stderr=True, quiet=True)
        )

        print("FFmpeg stderr:", stderr.decode())

        return stdout


    except Exception as e:
        print(f"Error converting WebM to LINEAR16: {e}")
        raise e
    

@app.websocket('/audio/ws')
async def audio_websocket(websocket: WebSocket):
    await websocket.accept()
    print("Client connected")

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="en-US",
    )

    stream_config = speech.StreamingRecognitionConfig(config=config)
    buffer = io.BytesIO()

    try:
        while True:
            try:
                # Receive audio chunks
                audio_chunks = await websocket.receive_bytes()
                if audio_chunks:
                    print(f"Received chunk of size: {len(audio_chunks)} bytes")
                    buffer.write(audio_chunks)
                else:
                    print("Empty chunk received, skipping.")

                if buffer.tell() > 0:
                    converted_audio = convert_webm_to_linear16(buffer)

                    # Clear the buffer for the next operation
                    buffer.seek(0)
                    buffer.truncate(0)

                    def audio_generator():
                        yield speech.StreamingRecognizeRequest(audio_content=converted_audio)

                    def process_responses():
                        results = []
                        for response in client.streaming_recognize(stream_config, audio_generator()):
                            results.append(response)
                        return results

                    responses = await asyncio.to_thread(process_responses)

                    for response in responses:
                        print(f"Google Cloud response: {response}")
                        for result in response.results:
                            if result.is_final:
                                transcribed_text = result.alternatives[0].transcript
                                print("Final Transcript:", transcribed_text)

                                response_text = chat.message_api_chatBot(transcribed_text)

                                audio_bot.convert_response_to_speech(response_text, buffer)

                                buffer.seek(0)
                                while chunk := buffer.read(64 * 1024):
                                    await websocket.send_bytes(chunk)

                                await websocket.send_text(json.dumps({
                                    'END_OF_AUDIO': True,
                                    'content': response_text,
                                }))

                                buffer.seek(0)  # Reset pointer
                                buffer.truncate(0)  # Clear buffer for next chunk

            except WebSocketDisconnect:
                print("WebSocket disconnected")
                break

            except Exception as e:
                print(f"Error processing audio: {e}")
                break

    except Exception as e:
        print(f"WebSocket error: {e}")



    
# @app.websocket('/audio/ws')
# async def audio_websocket(websocket: WebSocket):
#     audio_data = io.BytesIO()

#     await websocket.accept() 
#     print("Client connected")

#     try:
#         while True:
#             # Receive audio chunk from the WebSocket connection
#             audio_chunk = await websocket.receive_bytes()
            
#             if audio_chunk:
#                 print(f"Received {len(audio_chunk)} bytes")
#                 audio_data.write(audio_chunk)

#             if audio_data.tell() > 0:

#                 file_name = f"audio/{uuid.uuid4()}.webm"

#                 print(f"Total bytes to send {audio_data.tell()} bytes")
#                 await asyncio.to_thread(audio_bot.upload_audio_s3, audio_data, file_name)

#                 s3_bucket_name = "quickquill"
#                 uploaded_file_name = f"s3://{s3_bucket_name}/{file_name}"


#                 transcribed_text = await audio_bot.transcribe_audio(uploaded_file_name)
#                 print("transcribed_text: ", transcribed_text)

#                 if transcribed_text:
#                     response_text = chat.message_api_chatBot(transcribed_text) 

#                     speech_file_name = audio_bot.convert_response_to_speech(response_text)

#                     file_size = os.path.getsize(speech_file_name)
#                     print(f"Total bytes to send: {file_size}")

#                     with open(speech_file_name, "rb") as audio_file:
#                         while chunks := audio_file.read(64 * 1024):
#                             await websocket.send_bytes(chunks)

#                     await websocket.send_text(json.dumps({
#                         'is_end_of_audio': True,
#                         'content': response_text,
#                     }))

#     except Exception as e:
#         print(f"Error in WebSocket handling: {e}")
#         await websocket.close()  
#     except WebSocketDisconnect:
#         print("Client disconnected")
       
if __name__ == "__main__":
    uvicorn.run(app, port=5000, log_level="info")
