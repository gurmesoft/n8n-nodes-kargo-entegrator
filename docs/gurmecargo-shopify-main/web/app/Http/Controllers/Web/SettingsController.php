<?php

namespace App\Http\Controllers\Web;

use App\Services\CargoSAAS\ApiRequests;
use App\Services\CargoSAAS\Resources;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Listeleme.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        syncSaasSetting($request->user()); // TODO: Remove this

        $locationsQuery = \App\Services\Shopify\GraphQL\Query::getLocations();
        $locations = \App\Services\Shopify\Api::graph($locationsQuery, [], user: $request->user());

        $locations = array_map(
            function ($location) {
                return [
                    'id' => (int) $location['id'],
                    'name' => $location['name'] ?? '',
                    ...$location['address'],
                    'active' => $location['isActive'],
                ];
            },
            $locations
        );

        $warehouses = $request->user()->saasSetting->warehouses ?? [];
        $apiRequests = new ApiRequests();
        $shipmentSetting = $request->user()->saasSetting->shipment_settings ?? [];
        $profile = $apiRequests->getProfile();
        $cargoIntegrations = $request->user()->saasSetting->cargo_integrations ?? [];
        $locationSettings = $request->user()->locationSettings->toArray();
        $automaticShipmentSettings = $request->user()->automaticShipmentSetting;
        $otherSettings = $request->user()->otherSettings;
        $metafieldSettings = $request->user()->metafieldSettings;
        $deliveryProfileMaps = $request->user()->deliveryProfileMaps?->toArray() ?? [];
        $settings = [];

        foreach ($locations as $location) {
            $exists = array_search($location['id'], array_column($locationSettings, 'location_id'), true);

            if ($exists === false) {
                $settings[] = array_merge($shipmentSetting, ['location_id' => $location['id']]);
            } else {
                $settings[] = $locationSettings[$exists];
            }
        }

        return Inertia::render(
            'settings/index',
            [
                'locations' => $locations,
                'warehouses' => $warehouses,
                'locationSettings' => $settings,
                'cargoIntegrations' => $cargoIntegrations,
                'profile' => $profile,
                'automaticShipmentSettings' => $automaticShipmentSettings,
                'otherSettings' => $otherSettings,
                'metafieldSettings' => $metafieldSettings,
                'deliveryProfileMaps' => $deliveryProfileMaps,
            ]
        );
    }

    public function sync(Request $request)
    {
        syncSaasSetting($request->user(), true);

        return back(303);
    }
}
