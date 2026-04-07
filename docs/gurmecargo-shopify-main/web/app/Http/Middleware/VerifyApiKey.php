<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyApiKey
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {

        if ($request->user()->api_key) {
            return $next($request);
        }

        return \Inertia\Inertia::render(
            'settings/index',
            [
                'invalidApiKey' => true,
            ]
        );
    }
}
