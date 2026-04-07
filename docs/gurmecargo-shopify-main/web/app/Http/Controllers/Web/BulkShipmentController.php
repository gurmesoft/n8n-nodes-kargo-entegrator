<?php

namespace App\Http\Controllers\Web;

use App\Mappers\Shipment;
use App\Services\Shopify;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;

class BulkShipmentController extends Controller
{
    public function index(Request $request)
    {
        syncSaasSetting($request->user()); // TODO: Remove this

        $shipments = [];
        $warehouses = $request->user()->saasSetting->warehouses;
        $cargoIntegrations = $request->user()->saasSetting->cargo_integrations;
        $shipmentSetting = $request->user()->saasSetting->shipment_settings;

        if (is_array($request->get('ids'))) {
            $formattedIds = array_map(function ($id) {
                return 'gid://shopify/Order/' . $id;
            }, $request->get('ids'));
            $variables = [
                'ids' => $formattedIds,
            ];
            $orders = Shopify\Api::graph(
                Shopify\GraphQL\Query::getOrdersForBulkShipmentMapper(),
                $variables,
                user: $request->user()
            );

            if (empty($orders) === false) {
                foreach ($orders as $order) {
                    $mapper = new Shipment\BaseMapper(
                        $request->user(),
                        $warehouses,
                        $cargoIntegrations,
                        $shipmentSetting,
                        $order,
                        $request->user()->otherSettings,
                    );

                    $shipments[] = $mapper->createMapper()->map() + ['shipment_ids' => $mapper->showMapper()->getShipmentIds()];
                }
            }
        }

        $shipments = array_filter($shipments, fn ($shipment) => ! empty($shipment['fulfillment_orders']) || ! empty($shipment['shipment_ids']));

        return Inertia::render(
            'bulk-shipment/index',
            [
                'shipments' => array_values($shipments),
                'cargoIntegrations' => $cargoIntegrations,
            ]
        );
    }
}
