<?php

use App\Models\User;
use App\Services\AuthService;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthServiceTest extends TestCase
{
    protected $authService;

    protected function setup(): void
    {
        parent::setUp();
        $this->authService = new AuthService();
    }

    public function testHandleSocialLogin()
    {
        $socialUser = Mockery::mock();
        $socialUser->shouldReceive('getId')->andReturn('12345');
        $socialUser->shouldReceive('getEmail')->andReturn('johnkristan@gmail.com');
        $socialUser->shouldReceive('getName')->andReturn('John Kristan Torremocha');
        $socialUser->shouldReceive('getAvatar')->andReturn('avatar_url');


        // THIS ERROR OCCURS CAUSE THE INTELEPHENSE RELIES ON STATIC ANALYSIS
        // AND CAN'T RECOGNIZE DYNAMIC RETURN METHOD LIKE ->fromUser($user)

        JWTAuth::shouldReceive('claims')
            ->andReturnSelf()
            ->shouldReceive('fromUser')
            ->andReturn('jwt_token');

        $result = $this->authService->handleSocialLogin($socialUser, "google");

        $this->assertNotEmpty($result); 
        $this->assertIsString($result);

        $this->assertDatabaseHas('users', [
            'google_id' => '12345',
            'email' => 'johnkristan@gmail.com',
        ]);
        
    }


    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }
}
