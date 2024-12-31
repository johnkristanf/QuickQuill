<?php

namespace App\Providers;

use App\Services\AuthService;
use App\Services\ChatBotService;
use App\Services\DocumentService;
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

        $this->app->singleton(DocumentService::class, function ($app) {
            return new DocumentService();
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
