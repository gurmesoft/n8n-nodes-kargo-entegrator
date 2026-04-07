<?php

namespace App\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'localizeData' => fn (Request $request) => $this->localizeData($request),
        ]);
    }

    private function localizeData(Request $request): array
    {
        $default = [
            'version' => 'v1.0.8',
            'locale' => app()->getLocale(),
            'appUrl' => config('app.url'),
            'env' => config('app.env'),
        ];

        if (! $request->user()) {
            return $default;
        }

        return $default + [
            'user' => $request->user(),
        ];
    }
}
