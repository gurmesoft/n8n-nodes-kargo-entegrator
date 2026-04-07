<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Services\Shopify;
use Osiset\ShopifyApp\Contracts\Queries\Shop as IShopQuery;
use Osiset\ShopifyApp\Objects\Values\ShopDomain;
use Illuminate\Validation\ValidationException;
use App\Services\CargoSAAS\ApiRequests;

class FlowController extends Controller
{
    /**
     * Shopify Flow Action'dan gelen gönderi oluşturma talebini işler
     *
     * @param Request $request Shopify Flow'dan gelen veri
     * @return \Illuminate\Http\JsonResponse
     */
    public function createShipment(Request $request, IShopQuery $shopQuery)
    {
        $ids = [];
        $flowData = $request->all();
        $domain = ShopDomain::fromNative($flowData['shopify_domain']);
        $user = $shopQuery->getByDomain($domain);

        $apiRequests = new ApiRequests($user->api_key);

        $profile = $apiRequests->getProfile();

        $restrictedPlanIds = [2, 3, 16, 17, 18];
        if (in_array($profile['plan']['plan_id'], $restrictedPlanIds)) {
            return response()->json(['return_value' => ['status' => 'FAILED', 'barcode_numbers' => [], 'error_message' => 'Bu işlemi gerçekleştirmek için Business planınızın olması gerekmektedir.']]);
        }

        try {
            if ($user instanceof \App\Models\User) {
                $orderReference = $flowData['properties']['order_id'];

                $cargoIntegrationId = $flowData['properties']['cargo_integration_id'];

                $orderId = $this->extractOrderIdFromGlobalId($orderReference);

                $order = Shopify\Api::graph(Shopify\GraphQL\Query::getOrderForShipmentMapper($orderId), user: $user);

                $mapper = new \App\Mappers\Shipment\BaseMapper(
                    $user,
                    $user->saasSetting->warehouses,
                    $user->saasSetting->cargo_integrations,
                    $user->saasSetting->shipment_settings,
                    $order,
                    $user->otherSettings,
                );

                $mapperData = $mapper->createMapper()->map();

                if ($cargoIntegrationId) {
                    foreach ($mapperData['fulfillment_orders'] as &$fulfillmentOrder) {
                        $fulfillmentOrder['cargo_integration_id'] = $cargoIntegrationId;
                    }
                    unset($fulfillmentOrder);
                }

                $ids = (new \App\Jobs\CreateShipmentJob($mapperData, $user, true))->handle();
            }

            $barcodeNumbers = array_map(function ($id) use ($user) {
                /** @var \App\Models\User $user */
                return $user->shipments()->where('shipment_id', $id)->first()->shipment['barcode'];
            }, $ids);
            return response()->json(['return_value' => ['status' => 'COMPLETE', 'barcode_numbers' => $barcodeNumbers, 'error_message' => '']]);
        } catch (ValidationException $e) {
            return response()->json(['return_value' => ['status' => 'FAILED', 'barcode_numbers' => [], 'error_message' => $e->getMessage()]]);
        }
    }

    /**
     * Shopify Flow Action'dan gelen iade oluşturma talebini işler
     *
     * @param Request $request Shopify Flow'dan gelen veri
     * @param IShopQuery $shopQuery Shopify Flow'dan gelen veri
     */
    public function createReturned(Request $request, IShopQuery $shopQuery)
    {
        $ids = [];
        $flowData = $request->all();
        $domain = ShopDomain::fromNative($flowData['shopify_domain']);
        $user = $shopQuery->getByDomain($domain);

        $apiRequests = new ApiRequests($user->api_key);

        $profile = $apiRequests->getProfile();

        $restrictedPlanIds = [2, 3, 16, 17, 18];
        if (in_array($profile['plan']['plan_id'], $restrictedPlanIds)) {
            return response()->json(['return_value' => ['status' => 'FAILED', 'barcode_numbers' => [], 'error_message' => 'Bu işlemi gerçekleştirmek için Business planınızın olması gerekmektedir.']]);
        }

        try {
            if ($user instanceof \App\Models\User) {
                $orderReference = $flowData['properties']['order_id'];
                $cargoIntegrationId = $flowData['properties']['cargo_integration_id'];
                $lastReturnDate = (int) ($flowData['properties']['last_return_date']);

                $orderId = $this->extractOrderIdFromGlobalId($orderReference);

                $order = Shopify\Api::graph(Shopify\GraphQL\Query::getOrderForReturnedMapper($orderId), user: $user);

                $mapper = new \App\Mappers\Returned\BaseMapper(
                    $user,
                    $user->saasSetting->warehouses,
                    $user->saasSetting->cargo_integrations,
                    $user->saasSetting->returned_settings,
                    $order,
                );

                $mapperData = $mapper->createMapper()->map();

                if ($cargoIntegrationId) {
                    foreach ($mapperData['returns'] as &$return) {
                        $return['cargo_integration_id'] = $cargoIntegrationId;
                    }
                }

                if ($lastReturnDate) {
                    foreach ($mapperData['returns'] as &$return) {
                        $return['return_at'] = \Carbon\Carbon::now()->addDays($lastReturnDate)->format('Y-m-d');
                    }
                }

                $ids = (new \App\Jobs\CreateReturnedJob($mapperData, $user, true))->handle();
            }
            $barcodeNumbers = array_map(function ($id) use ($user) {
                /** @var \App\Models\User $user */
                return $user->returneds()->where('returned_id', $id)->first()->returned['barcode'];
            }, $ids);
            return response()->json(['return_value' => ['status' => 'COMPLETE', 'barcode_numbers' => $barcodeNumbers, 'error_message' => '']]);
        } catch (\Exception $e) {
            return response()->json(['return_value' => ['status' => 'FAILED', 'barcode_numbers' => [], 'error_message' => $e->getMessage()]]);
        }
    }

    /**
     * Shopify Global ID'den Order ID'yi çıkarır
     *
     * @param string $globalId Shopify Global ID (örn: gid://shopify/Order/123456)
     * @return string|null Order ID
     */
    private function extractOrderIdFromGlobalId(string $globalId): ?string
    {
        if (preg_match('/gid:\/\/shopify\/Order\/(\d+)/', $globalId, $matches)) {
            return $matches[1];
        }

        return null;
    }
}
