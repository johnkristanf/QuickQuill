<?php

use App\Models\User;
use App\Services\AuthService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthServiceTest extends TestCase
{
    use RefreshDatabase; // This will refresh and migrate the database before each test.

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

        // Mocking the JWTAuth methods
        JWTAuth::shouldReceive('claims')
            ->andReturnSelf()
            ->shouldReceive('fromUser')
            ->andReturn('jwt_token');

        $result = $this->authService->handleSocialLogin($socialUser, "google");

        $this->assertNotEmpty($result); 
        $this->assertIsString($result);

        // Assert that the user is saved in the database
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
