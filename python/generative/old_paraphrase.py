import torch
import nltk

from transformers import PegasusTokenizer, PegasusForConditionalGeneration
from torch.amp import autocast
from accelerate import Accelerator

accelerator = Accelerator()
torch_device = 'cuda' if torch.cuda.is_available() else 'cpu'
torch.cuda.empty_cache()

print("Loading model...")

model = PegasusForConditionalGeneration.from_pretrained('tuner007/pegasus_paraphrase').to(torch_device)
tokenizer = PegasusTokenizer.from_pretrained('tuner007/pegasus_paraphrase')
model, tokenizer = accelerator.prepare(model, tokenizer)

print("Model loaded successfully.")


nltk.download('punkt_tab')


class GenerativeParaphrase:

    def paraphrase_text(self, text: str, paraphrase_mode: str):

        sentences = nltk.sent_tokenize(text)
        print(f"Sentences: {sentences}")


        batch_size = 8
        paraphrased_text = []


        for i in range(0, len(sentences), batch_size):
            sentences_batch = sentences[i:i + batch_size]

            result = tokenizer.batch_encode_plus(sentences_batch, return_tensors='pt', padding=True, truncation=True)
            print('result: ', result)

            summary_ids_standard = None
                
            with autocast(torch_device):
                if paraphrase_mode.lower() == 'standard':

                    initial_memory = torch.cuda.memory_allocated()
                    print(f"Initial memory usage: {initial_memory / (1024 ** 3)} GB")

                    summary_ids_standard = model.generate(
                        input_ids=result['input_ids'], 
                        max_length=256, 
                        num_beams=2, 
                        no_repeat_ngram_size=2 
                    )

                    final_memory = torch.cuda.memory_allocated()
                    print(f"Final memory usage: {final_memory / (1024 ** 3)} GB")
                    print(f"Memory usage for this batch: {(final_memory - initial_memory) / (1024 ** 3)} GB")
                                        
                elif paraphrase_mode.lower() == 'creative':
                    summary_ids_standard = model.generate(
                        input_ids=result['input_ids'], 
                        max_length=256, 
                        temperature=1.0, 
                        do_sample=True,
                        top_k=50, 
                        num_beams=3, 
                        no_repeat_ngram_size=2
                    )

                else:
                    summary_ids_standard = model.generate(
                        input_ids=result['input_ids'], 
                        max_length=256, 
                        do_sample=True,
                        top_p=0.9, 
                        num_beams=3, 
                        no_repeat_ngram_size=2
                    )

            paraphrased_batch  = [tokenizer.decode(id, skip_special_tokens=True) for id in summary_ids_standard]
            paraphrased_text.extend(paraphrased_batch)

            concatenated_paraphrased_text = ' '.join(paraphrased_text)
            print(f'paraphrased_text: {concatenated_paraphrased_text}')

        return concatenated_paraphrased_text