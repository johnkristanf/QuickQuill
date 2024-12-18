<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }  

    public function handleGoogleCallback()
    {
        $user = Socialite::driver('google')->user();

        $token = $this->authService->handleSocialLogin($user, 'google');

        if($token){
            return redirect()->to(env('AUTHENTICATED_REDIRECT_URI'))
                ->cookie('access_token', $token, 60, '/', null, true, true); 
        }

        return redirect()->to(env('UNAUTHENTICATED_REDIRECT_URI'));
    }

    public function getUserData()
    {
        $user = $this->authService->getUserData();
        return response()->json(['user' => $user]);
    }


}
