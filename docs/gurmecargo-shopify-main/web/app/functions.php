<?php

use App\Services\CargoSAAS\ApiRequests;
use App\Services\CargoSAAS\Resources;
use Illuminate\Support\Carbon;

function syncSaasSetting($user, $force = false)
{
    if (! $user->saasSetting || $force) {
        $warehouses = (new Resources\Warehouses($user->api_key))->index();
        $cargoIntegrations = (new Resources\CargoIntegrations($user->api_key))->index();
        $shipmentSetting = (new ApiRequests($user->api_key))->getShipmentSetting();
        $returnedSetting = (new ApiRequests($user->api_key))->getReturnedSetting();

        $user->saasSetting()->updateOrCreate([
            'user_id' => $user->id,
        ], [
            'warehouses' => $warehouses,
            'cargo_integrations' => $cargoIntegrations,
            'shipment_settings' => $shipmentSetting,
            'returned_settings' => $returnedSetting,
        ]);

        $user->update(['last_sync_time' => Carbon::now()->format('d.m.Y H:i')]);

        $user->load('saasSetting');
    }
}

function fixCustomerAddress($data, $apiKey = null)
{
    $response = (new ApiRequests($apiKey))->fixAddress($data);

    return $response;
}
