<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ParaphraseService
{
    public function paraphraseText($original_text)
    {
        $response = Http::post('http://localhost:5000/paraphrase', [
            'original_text' => $original_text,
        ]);

        if ($response->successful()) {
            return $response->json()['paraphrased_text'];  
        }

        throw new \Exception('Error occurred while paraphrasing');
    }


    // ADD NEW METHOD HERE FOR STORING PARAPHRASE HISTORY

    // THE HISTORY SCHEMA IS JUST ONE TABLE HISTORY
    // COLUMNS: type(paraphrase, summarized), original_text, transformed_text, user_id, timestamps
}