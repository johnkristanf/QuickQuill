<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;


Route::middleware('guest')->group(function (){
    Route::get('auth/google', [AuthController::class, 'redirectToGoogle']);
    Route::get('auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

    Route::get('auth/facebook', [AuthController::class, 'redirectToFacebook']);
    Route::get('auth/facebook/callback', [AuthController::class, 'handleFacebookCallback']);
});

Route::middleware('auth')->group(function () {
    Route::post('/signout/user', [AuthController::class, 'signoutUser']);
});


