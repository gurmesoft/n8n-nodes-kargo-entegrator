<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class NotificationController extends Controller
{
    public function shipmentNotification(Request $request)
    {
        \App\Jobs\ShipmentUpdatedBySaasJob::dispatch($request->get('shipment_id'))->delay(now()->addSeconds(5));

        return response('OK', 200)
            ->header('Content-Type', 'text/plain');
    }

    public function returnedNotification(Request $request)
    {
        \App\Jobs\ReturnedUpdatedBySaasJob::dispatch($request->get('returned_id'))->delay(now()->addSeconds(5));

        return response('OK', 200)
            ->header('Content-Type', 'text/plain');
    }
}
