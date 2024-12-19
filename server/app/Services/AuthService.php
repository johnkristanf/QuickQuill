<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    public function handleSocialLogin($socialUser, $provider)
    {
        $existingUser = User::where($provider . '_id', $socialUser->getId())->first();

        if($existingUser){
            $user = $existingUser;
        } else {
            $user = User::create([
                'avatar' => $socialUser->getAvatar(),
                'name' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                $provider . '_id' => $socialUser->getId(),
                'provider' => $provider,
            ]);
        }   

        Auth::login($user);

        $jwtToken = JWTAuth::claims(['exp' => now()->addMinutes(1440)->timestamp])->fromUser($user);

        Log::info("token in login: ", [
            'jwt_token' => $jwtToken
        ]);

        Session::put('jwt_token',  $jwtToken);

        return $user->createToken('access_token')->plainTextToken;
    }

    public function getUserData()
    {
        return User::select('id', 'name', 'email', 'avatar')->where('id',  Auth::id())->first();
    }
}