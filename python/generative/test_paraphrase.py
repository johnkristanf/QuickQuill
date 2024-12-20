import os 
import requests


def paraphrase_text(text: str, paraphrase_mode: str = "standard"):

    API_URL = "https://api-inference.huggingface.co/models/tuner007/pegasus_paraphrase"
    headers = {
        "Authorization": f"Bearer {os.getenv('HF_API_KEY')}"
    }


    if paraphrase_mode.lower() == "standard":
        params = {"max_length": 256, "num_beams": 2, "no_repeat_ngram_size": 2}
    elif paraphrase_mode.lower() == "creative":
        params = {"max_length": 256, "temperature": 1.0, "do_sample": True, "top_k": 50, "num_beams": 3, "no_repeat_ngram_size": 2}
    else:
        params = {"max_length": 256, "do_sample": True, "top_p": 0.9, "num_beams": 3, "no_repeat_ngram_size": 2}

    payload = {"inputs": text, "parameters": params}
    response = requests.post(API_URL, headers=headers, json=payload)

    print('responded')

    if response.status_code == 200:
        result = response.json()[0]["generated_text"]
        print(f'result: {result}')
        
        return result
    else:
        raise Exception(f"Error: {response.status_code}, {response.text}")