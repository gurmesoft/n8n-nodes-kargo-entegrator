<?php

namespace App\Http\Middleware;

use App\Models\Shipment;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyShipment
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $row = Shipment::where('shipment_id', $request->get('shipment_id'))->first();

        if ($row) {
            $hash = hash_hmac('sha512', "{$request->get('shipment_id')}{$request->get('status')}{$request->get('time')}", $row->user->api_key);

            if ($request->get('hash') === $hash) {
                return $next($request);
            }
        }

        abort(401);
    }
}
