<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ParaphraseController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user/data', [AuthController::class, 'getUserData']);
    Route::post('text/paraphrase', [ParaphraseController::class, 'paraphrase']);
    Route::get('paraphrasing/history', [ParaphraseController::class, 'getParaphrasingHistory']);

});

