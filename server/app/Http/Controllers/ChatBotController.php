<?php

namespace App\Http\Controllers;

use App\Services\ChatBotService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatBotController extends Controller
{
    protected $chatbotService;

    public function __construct(ChatBotService $chatbotService)
    {
        $this->chatbotService = $chatbotService;
    }

    public function paraphrase(Request $request)
    {
        $validated = $request->validate([
            'original_text' => 'required|string',
            'paraphrase_mode' => 'required|string',
        ]);

        $paraphrasedText = $this->chatbotService->paraphraseText($validated['original_text'], $validated['paraphrase_mode']);
        $isSavedHistory = $this->chatbotService->saveHistory("paraphrase", $validated['original_text'], $paraphrasedText);

        return response()->json([
            'paraphrased_text' => $paraphrasedText,
            'saved_history' => $isSavedHistory ? true : false
        ], 200);
    }


    public function messageChatBot(Request $request)
    {
        Log::info("sdfsfdsf");
        
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $response = $this->chatbotService->chat($validated['message']);
        $isSavedHistory = $this->chatbotService->saveHistory("chatbot_conversation", $validated['message'], $response);


        return response()->json([
            'response' => $response,
            'saved_history' => $isSavedHistory ? true : false
        ], 200);
    }

    public function getChatHistory()
    {
        $history = $this->chatbotService->getHistory();
        return response()->json(['history' => $history], 200);
    }
}
