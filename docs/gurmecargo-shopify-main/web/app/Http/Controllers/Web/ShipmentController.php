<?php

namespace App\Http\Controllers\Web;

use App\Jobs\CreateShipmentJob;
use App\Mappers\Shipment;
use App\Services\CargoSAAS\ApiRequests;
use App\Services\CargoSAAS\Resources;
use App\Services\Shopify;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ShipmentController extends Controller
{
    public function create(Request $request)
    {
        syncSaasSetting($request->user()); // TODO: Remove this

        $warehouses = $request->user()->saasSetting->warehouses;
        $cargoIntegrations = $request->user()->saasSetting->cargo_integrations;
        $shipmentSetting = $request->user()->saasSetting->shipment_settings;
        $api = new Shopify\Api();

        $args = [
            'warehouses' => $warehouses,
            'cargoIntegrations' => $cargoIntegrations,
            'shipmentSetting' => $shipmentSetting,
            'order' => [
                'id' => $request->get('id'),
            ],
            'shipment' => [
                'fulfillment_orders' => [],
            ],
            'shipments' => [],
        ];

        $order = $api::graph(Shopify\GraphQL\Query::getOrderForShipmentMapper($request->get('id')));

        if (is_array($order) && array_key_exists('id', $order)) {
            $mapper = new Shipment\BaseMapper(
                $request->user(),
                $warehouses,
                $cargoIntegrations,
                $shipmentSetting,
                $order,
                $request->user()->otherSettings,
            );

            $args['order'] = $mapper->order;
            $args['shipment'] = $mapper->createMapper()->map();
            $args['shipments'] = $mapper->showMapper()->map();
        }

        return Inertia::render('shipment/create', $args);
    }

    public function store(Request $request)
    {
        try {
            $shipmentIds = (new CreateShipmentJob($request->all(), $request->user()))->handle();

            return response()->json(
                [
                    'print' => (new ApiRequests())->print($shipmentIds),
                    'shipment_ids' => $shipmentIds,
                ]
            );
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => $e->getMessage()]);
        }
    }

    public function destroy(Request $request, $id)
    {
        $dbLine = $request->user()->shipments()->findOrFail($id);

        (new Resources\Shipments())->destroy($dbLine->shipment_id);

        $mutation = \App\Services\Shopify\GraphQL\Query::fulfillmentCancelMutation();
        $variables = [
            'id' => 'gid://shopify/Fulfillment/' . $dbLine->fulfillment_id,
        ];
        \App\Services\Shopify\Api::graph($mutation, $variables, user: $request->user());
        $dbLine->delete();
    }

    public function index(Request $request)
    {
        $status = $request->query('status');

        $data = $request->user()->shipments();

        if ($status) {
            $data->where('shipment->status', $status);
        }

        $data = $data->paginate(10)->withQueryString();

        return Inertia::render('shipment/index', [
            'data' => $data,
            'appName' => config('app.toml_name'),
        ]);
    }
}
