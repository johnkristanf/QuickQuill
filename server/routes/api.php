<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatBotController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user/data', [AuthController::class, 'getUserData']);
    Route::get('paraphrasing/history', [ChatBotController::class, 'getChatHistory']);

    Route::post('text/paraphrase', [ChatBotController::class, 'paraphrase']);
    Route::post('message/chatbot', [ChatBotController::class, 'messageChatBot']);

});

