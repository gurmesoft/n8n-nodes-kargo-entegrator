<?php

namespace App\Http\Middleware;

use App\Models\Returned;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyReturned
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = Returned::where('returned_id', $request->get('returned_id'))->first()?->user?->api_key;

        $hash = hash_hmac('sha512', "{$request->get('returned_id')}{$request->get('status')}{$request->get('time')}", $apiKey);

        if ($request->get('hash') === $hash) {
            return $next($request);
        }

        abort(401);
    }
}
