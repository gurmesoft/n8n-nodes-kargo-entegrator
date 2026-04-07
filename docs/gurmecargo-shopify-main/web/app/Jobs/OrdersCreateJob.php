<?php

namespace App\Jobs;

use App\Services\Shopify;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Osiset\ShopifyApp\Contracts\Commands\Shop as IShopCommand;
use Osiset\ShopifyApp\Contracts\Queries\Shop as IShopQuery;
use Osiset\ShopifyApp\Objects\Values\ShopDomain;
use stdClass;

/**
 * Webhook job responsible for handling when the app is uninstalled.
 */
class OrdersCreateJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * The shop domain.
     *
     * @var ShopDomain|string
     */
    protected $domain;

    /**
     * The webhook data.
     *
     * @var object
     */
    protected $data;

    /**
     * Create a new job instance.
     *
     * @param  string  $domain  The shop domain.
     * @param  stdClass  $data  The webhook data (JSON decoded).
     * @return void
     */
    public function __construct(string $domain, stdClass $data)
    {
        $this->domain = $domain;
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @param  IShopQuery  $shopQuery  The querier for shops.
     */
    public function handle(IShopQuery $shopQuery): void
    {
        try {
            $this->domain = ShopDomain::fromNative($this->domain);
            $user = $shopQuery->getByDomain($this->domain);
            if ($user instanceof \App\Models\User) {
                $apiRequestsService = new \App\Services\CargoSAAS\ApiRequests($user->api_key);
                $profile = $apiRequestsService->getProfile();
                if (! $user->saasSetting) {
                    syncSaasSetting($user);
                }


                $restrictedPlanIds = [2, 3, 16, 17, 18];
                if (in_array($profile['plan']['plan_id'], $restrictedPlanIds)) {
                    return;
                }
                $automaticSetting = $user->automaticShipmentSetting;
                if (! $automaticSetting || ! $automaticSetting->is_enabled) {
                    return;
                }

                $order = Shopify\Api::graph(Shopify\GraphQL\Query::getOrderForShipmentMapper($this->data->id), user: $user);

                $warehousesService = $user->saasSetting->warehouses;
                $cargoIntegrationsService = $user->saasSetting->cargo_integrations;
                $shipmentSettings = $user->saasSetting->shipment_settings;

                $mapper = new \App\Mappers\Shipment\BaseMapper(
                    $user,
                    $warehousesService,
                    $cargoIntegrationsService,
                    $shipmentSettings,
                    $order,
                    $user->otherSettings,
                );

                $mapperData = $mapper->createMapper()->map();

                if ($automaticSetting->fix_address) {
                    $mapperData = $this->fixCustomerAddress($mapperData, $user);
                }

                $delay = (int) $automaticSetting->delay;
                CreateShipmentJob::dispatch($mapperData, $user, true)
                ->delay(now()->addSeconds($delay));
            }
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Müşteri adres bilgilerini düzeltir
     *
     * @param array $mapperData
     * @param mixed $user
     * @return array
     */
    protected function fixCustomerAddress(array $mapperData, $user): array
    {
        if ($user->validatedAddresses()->where('order_id', "gid://shopify/Order/{$this->data->id}")->exists() === true) {
            return $mapperData;
        }

        $customerData = $mapperData['customer'];

        $response = fixCustomerAddress([
            'address' => $customerData['address'],
            'district' => $customerData['district'],
            'city' => $customerData['city'],
            'country' => $customerData['country'],
        ], $user->api_key);


        if (is_array($response) && !empty($response) && isset($response['formattedAddress'])) {
            $customerData = array_merge($customerData, [
                'address' => $response['formattedAddress']['fullAddress'],
                'district' => $response['formattedAddress']['district'],
                'city' => $response['formattedAddress']['city'],
                'country' => $response['formattedAddress']['country'],
            ]);
        }

            $mapperData['customer'] = $customerData;

        return $mapperData;
    }
}
