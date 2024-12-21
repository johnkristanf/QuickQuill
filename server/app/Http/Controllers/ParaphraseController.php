<?php

namespace App\Http\Controllers;

use App\Services\ParaphraseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ParaphraseController extends Controller
{
    protected $paraphraseService;

    public function __construct(ParaphraseService $paraphraseService)
    {
        $this->paraphraseService = $paraphraseService;
    }

    public function paraphrase(Request $request)
    {
        $validated = $request->validate([
            'original_text' => 'required|string',
            'paraphrase_mode' => 'required|string',
        ]);

        $paraphrasedText = $this->paraphraseService->paraphraseText($validated['original_text'], $validated['paraphrase_mode']);
        $isSavedHistory = $this->paraphraseService->saveHistory("paraphrase", $validated['original_text'], $paraphrasedText);

        return response()->json([
            'paraphrased_text' => $paraphrasedText,
            'saved_history' => $isSavedHistory ? true : false
        ], 200);
    }

    public function getParaphrasingHistory()
    {
        $history = $this->paraphraseService->getHistory();
        return response()->json(['history' => $history], 200);
    }
}
