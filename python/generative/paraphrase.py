from transformers import PegasusTokenizer, PegasusForConditionalGeneration
import torch

torch_device = 'cuda' if torch.cuda.is_available() else 'cpu'

class GenerativeParaphrase:
    def __init__(self):
        try:
            
            self.pre_trained_model = 'tuner007/pegasus_paraphrase'
            print("Loading model...")
            self.model = PegasusForConditionalGeneration.from_pretrained(self.pre_trained_model).to(torch_device)
            self.tokenizer = PegasusTokenizer.from_pretrained(self.pre_trained_model)
            print("Model loaded successfully.")

        except Exception as e:
            print(f"Error loading model: {e}")
            raise e

    def paraphrase_text(self, text, paraphrase_mode):
        token_ids = self.tokenizer.encode(text, return_tensors='pt')

        print('token_ids: ', token_ids)

        summary_ids_standard = None
            
        if paraphrase_mode == 'standard':
            summary_ids_standard = self.model.generate(
                token_ids, 
                max_length=256, 
                num_beams=3, 
                no_repeat_ngram_size=2 
            )
            
        elif paraphrase_mode == 'creative':
            summary_ids_standard = self.model.generate(
                token_ids, 
                max_length=256, 
                temperature=1.0, 
                do_sample=True,
                top_k=50, 
                num_beams=3, 
                no_repeat_ngram_size=2
            )

        else:
            summary_ids_standard = self.model.generate(
                token_ids, 
                max_length=256, 
                do_sample=True,
                top_p=0.9, 
                num_beams=3, 
                no_repeat_ngram_size=2
            )

        paraphrased_text = self.tokenizer.decode(summary_ids_standard[0], skip_special_tokens=True)

        return paraphrased_text
