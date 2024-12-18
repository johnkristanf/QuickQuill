<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

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

        return $user->createToken('access_token')->plainTextToken;
    }

    public function getUserData()
    {
        return User::select('id', 'name', 'email', 'avatar')->where('id',  Auth::id())->first();
    }
}