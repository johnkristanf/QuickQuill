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

        ])->post(env('PARAPHRASE_REQUEST_URL'), [
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

    
    public function getHistory()
    {
        return History::select('id', 'original_text', 'transformed_text', 'created_at')
                        ->where('user_id', Auth::id())
                        ->get()
                        ->toArray();
    }


    
}