import os 
import requests

from transformers import PegasusTokenizer

MAX_TOKENS = 60
API_URL = "https://api-inference.huggingface.co/models/tuner007/pegasus_paraphrase"
tokenizer = PegasusTokenizer.from_pretrained('tuner007/pegasus_paraphrase')


class GenerativeParaphrase:

    def split_text_into_chunks(self, text: str):
        sentences = text.split('.')
        chunks = []
        current_chunk = ""

        for sentence in sentences:
            sentence_tokens = len(tokenizer.encode(sentence, truncation=False))
            current_chunk_tokens = len(tokenizer.encode(current_chunk, truncation=False))

            if current_chunk_tokens + sentence_tokens > MAX_TOKENS:
                chunks.append(current_chunk.strip())
                current_chunk = sentence
            else:
                current_chunk += sentence + '.'

        if current_chunk:
            chunks.append(current_chunk.strip())

        return chunks


    def paraphrase_long_text(self, text: str, params, HEADERS):
        chunks = self.split_text_into_chunks(text)
        paraphrased_text = []

        for chunk in chunks:
            payload = {
                "inputs": chunk,
                "parameters": params
            } 

            response = requests.post(url=API_URL, headers=HEADERS, json=payload)
            if response.status_code == 200:
                paraphrased_text.append(response.json()[0]["generated_text"])
            else:
                raise Exception(f"Error: {response.status_code}, {response.text}")

        return " ".join(paraphrased_text)


    def paraphrase_short_text(self, text: str, params, HEADERS):

        payload = {
            "inputs": text, 
            "parameters": params
        }

        response = requests.post(API_URL, headers=HEADERS, json=payload)

        if response.status_code == 200:
            paraphrased_text = response.json()[0]["generated_text"]
            print(f'paraphrased_text: {paraphrased_text}')

            return paraphrased_text
        else:
            raise Exception(f"Error: {response.status_code}, {response.text}")
        

    def paraphrase(self, text: str, paraphrase_mode: str = "standard"):
        params = self.parameter_checker(paraphrase_mode)
        HEADERS = {"Authorization": f"Bearer {os.getenv('HF_API_KEY')}"}

        token_ids = len(tokenizer.encode(text, truncation=False))

        if token_ids > MAX_TOKENS:
            paraphrased_text = self.paraphrase_long_text(text, params, HEADERS)
        else:
            paraphrased_text = self.paraphrase_short_text(text, params, HEADERS)

        return paraphrased_text
    

    def parameter_checker(self, paraphrase_mode: str = "standard"):

        params = None
        if paraphrase_mode.lower() == "standard":
            params = {
                "max_length": 60, 
                "num_beams": 2, 
                "no_repeat_ngram_size": 2
            }

        elif paraphrase_mode.lower() == "creative":
            params = {
                "max_length": 60, 
                "temperature": 1.0, 
                "do_sample": True, 
                "top_k": 50, 
                "num_beams": 3, 
                "no_repeat_ngram_size": 2
            }

        elif paraphrase_mode.lower() == 'fluency':
            params = {
                "max_length": 60, 
                "num_beams": 5,  
                "no_repeat_ngram_size": 3,  
                "length_penalty": 1.0, 
                "temperature": 0.7, 
                "top_p": 0.9,  
                "max_length": 256,  
            }

        else:    
            params = {
                "max_length": 60, 
                "do_sample": True, 
                "top_p": 0.9, 
                "num_beams": 3, 
                "no_repeat_ngram_size": 2
            }

        return params