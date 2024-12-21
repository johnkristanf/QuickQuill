<?php

namespace App\Http\Controllers;

use App\Services\AuthService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
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

        // ONLY USE THE SANCTUM TOKEN AUTHENTICATION IF THE USER IS IN STATELESS EG..(MOBILE APP)
        $jwtToken = $this->authService->handleSocialLogin($user, 'google');
        Session::put('jwt_token',  $jwtToken);

        if(!$jwtToken){
            throw new Exception("Failed to authenticate user", 500);
            return redirect()->to(env('UNAUTHENTICATED_REDIRECT_URI'));
        }

        return redirect()->to(env('AUTHENTICATED_REDIRECT_URI'));
    }

    public function getUserData()
    {
        $user = $this->authService->getUserData();
        return response()->json(['user' => $user]);
    }


    public function signoutUser(Request $request)
    {
        $this->authService->signout($request);
        
        $response = response()->json("logout_success", 200);

        $response->headers->clearCookie('XSRF-TOKEN'); // CSRF cookie
        $response->headers->clearCookie('laravel_session'); // Laravel session cookie
        $response->headers->clearCookie('access_token');

        return $response;
    }


}
