<?php

namespace App\Services;

use App\Models\History;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class ParaphraseService
{
    public function paraphraseText($originalText, $paraphraseMode)
    {

        $jwtToken = Session::get('jwt_token');

        Log::info("token fetch in session: ". $jwtToken);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $jwtToken

        ])->post('http://localhost:5000/paraphrase', [
            'original_text' => $originalText,
            'paraphrase_mode' => $paraphraseMode
        ]);

        if ($response->successful()) {
            return $response->json()['paraphrased_text'];  
        }

        throw new \Exception('Error occurred while paraphrasing');
    }


    public function saveHistory($type, $originalText, $transformedText)
    {
        $history = History::create([
            'type' => $type,
            'original_text' => $originalText,
            'transformed_text' => $transformedText,
            'user_id' => Auth::id(),
        ]);

        return $history;
    }


    // ADD NEW METHOD HERE FOR STORING PARAPHRASE HISTORY

    // THE HISTORY SCHEMA IS JUST ONE TABLE HISTORY
    // COLUMNS: type(paraphrase, summarized), original_text, transformed_text, user_id, timestamps
}