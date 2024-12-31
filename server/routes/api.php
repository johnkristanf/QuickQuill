<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\DocumentController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user/data', [AuthController::class, 'getUserData']);

    Route::get('paraphrasing/history', [ChatBotController::class, 'getChatHistory']);
    Route::post('text/paraphrase', [ChatBotController::class, 'paraphrase']);
    Route::post('message/chatbot', [ChatBotController::class, 'messageChatBot']);

    Route::get('saved/documents', [DocumentController::class, 'getDocumentMetaDataDB']);
    Route::get('documents/content/{documentName}', [DocumentController::class, 'getDocumentContent']);
    Route::post('save/document', [DocumentController::class, 'saveDocument']);
    
    Route::put('rename/document/{id}', [DocumentController::class, 'renameDocument']);
    Route::delete('delete/document/{id}/{documentName}', [DocumentController::class, 'deleteDocument']);


});

