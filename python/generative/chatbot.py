import os
from huggingface_hub import InferenceClient

class ChatBotLLAMA:
    def message_api_chatBot(self, message: str):
        try:

            api_key = os.getenv("INFERENCE_API_KEY")
            client = InferenceClient(api_key=api_key)

            proccessed_message = self.clean_user_message(message)
            messages = [
                {"role": "user", "content": f"{proccessed_message}"},
            ]

            completion = client.chat.completions.create(
                model="meta-llama/Llama-3.2-3B-Instruct", 
                messages=messages,
                temperature=0.5,
                max_tokens=2048,
                top_p=0.7
            )

            print(completion.choices[0].message)

            return completion.choices[0].message['content']
        
        except Exception as e:
            raise Exception(f"An unexpected error occurred: {e}")



    def clean_user_message(self, message: str):
        message = message.strip()

        message = " ".join(message.split())
        message = message.replace("!!", "!").replace("...", ".")

        return message