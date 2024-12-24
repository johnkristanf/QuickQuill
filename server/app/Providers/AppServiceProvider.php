<?php

namespace App\Providers;

use App\Services\AuthService;
use App\Services\ChatBotService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(AuthService::class, function ($app) {
            return new AuthService();
        });

        $this->app->singleton(ChatBotService::class, function ($app) {
            return new ChatBotService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
