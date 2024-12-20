import os
import requests
import time

def keep_model_warm():

    API_URL = "https://api-inference.huggingface.co/models/tuner007/pegasus_paraphrase"
    headers = {"Authorization": f"Bearer {os.getenv('HF_API_KEY')}"}
    payload = {"inputs": "Keep-alive request."}
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload)
        print("Keep-alive request sent:", response.status_code)
    except Exception as e:
        print("Error sending keep-alive request:", e)

