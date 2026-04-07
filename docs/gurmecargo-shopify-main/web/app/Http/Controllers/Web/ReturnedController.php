<?php

namespace App\Http\Controllers\Web;

use App\Jobs\CreateReturnedJob;
use App\Mappers\Returned;
use App\Services\CargoSAAS\ApiRequests;
use App\Services\Shopify;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ReturnedController extends Controller
{
    public function create(Request $request)
    {
        syncSaasSetting($request->user()); // TODO: Remove this
        
        $api = new Shopify\Api();
        $order = $api::graph(Shopify\GraphQL\Query::getOrderForReturnedMapper($request->get('id')));

        $warehouses = $request->user()->saasSetting->warehouses;
        $cargoIntegrations = $request->user()->saasSetting->cargo_integrations;
        $returnedSetting = $request->user()->saasSetting->returned_settings;
        $args = [
            'warehouses' => $warehouses,
            'cargoIntegrations' => $cargoIntegrations,
            'returnedSetting' => $returnedSetting,
            'returned' => [
                'platform_d_id' => $request->get('id'),
                'returns' => [],
            ],
            'order' => [],
            'returneds' => [],
        ];

        if (is_array($order) && empty($order['returns']) === false) {
            $mapper = new Returned\BaseMapper(
                $request->user(),
                $warehouses,
                $cargoIntegrations,
                $returnedSetting,
                $order,
            );
            $args['order'] = $mapper->order;
            $args['returned'] = $mapper->createMapper()->map();
            $args['returneds'] = $mapper->showMapper()->map();
        }

        return Inertia::render('returned/create', $args);
    }

    public function store(Request $request)
    {
        try {
            $returnedIds = (new CreateReturnedJob($request->all(), $request->user()))->handle();

            return response()->json(['print' => (new ApiRequests())->print($returnedIds, 'returneds')]);
        } catch (\Exception $e) {
            throw ValidationException::withMessages(['error' => $e->getMessage()]);
        }
    }

    public function destroy(Request $request, $id)
    {
        $dbLine = $request->user()->returneds()->findOrFail($id);
        $dbLine->delete();

        $mutation = Shopify\GraphQL\Query::getReturnCancelMutation();
        $variables = [
            'id' => 'gid://shopify/Return/' . $dbLine->return_id,
        ];
        Shopify\Api::graph($mutation, $variables);
    }

    public function index(Request $request)
    {
        $status = $request->query('status');

        $data = $request->user()->returneds();

        if ($status) {
            $data->where('returned->status', $status);
        }

        $data = $data->paginate(10)->withQueryString();

        return Inertia::render('returned/index', [
            'data' => $data,
            'appName' => config('app.toml_name'),
        ]);
    }
}
