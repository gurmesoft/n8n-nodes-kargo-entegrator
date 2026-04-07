<?php

namespace App\Jobs;

use App\Services\CargoSAAS\Resources;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Validation\ValidationException;
use App\Jobs\Flow\TriggerShipmentCreated;
use App\Jobs\AddTagsJob;

class CreateShipmentJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    protected $mapperData;

    protected $user;

    protected $autoShipment;

    /**
     * Create a new job instance.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function __construct(array $mapperData, $user, bool $autoShipment = false)
    {
        $this->mapperData = $mapperData;
        $this->user = $user;
        $this->autoShipment = $autoShipment;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        $shipments = $this->mapperData['fulfillment_orders'];
        unset($this->mapperData['fulfillment_orders']);
        $orderReference = 'gid://shopify/Order/' . $this->mapperData['platform_id'];

        $shipmentIds = [];
        try {
            foreach ($shipments as $shipment) {
                $apiResource = (new Resources\Shipments($this->user->api_key))->store(array_merge($shipment, $this->mapperData));

                if ($apiResource instanceof \Illuminate\Http\Client\Response) {
                    if ($this->autoShipment && $this->mapperData['platform_id']) {
                        AddTagsJob::dispatch(
                            $orderReference,
                            ['Gönderi otomatik oluşturulamadı'],
                            $this->user
                        );
                    }
                    throw ValidationException::withMessages([$apiResource->json()['message'] ?? 'Gönderi oluşturulurken bir hata oluştu. Lütfen daha sonra tekrar deneyin']);
                }

                $otherSettings = $this->user->otherSettings;
                $addMetafield = $otherSettings && $otherSettings->barcode_metafield;

                $this->user->shipments()->create([
                    'shipment_id' => $apiResource['id'],
                    'shipment' => $apiResource,
                    'order_id' => $apiResource['platform_id'],
                    'fulfillment_order_id' => $shipment['fulfillment_order_id'],
                ]);

                if ($addMetafield) {
                    UpdateOrderMetafieldJob::dispatch(
                        $apiResource['platform_id'],
                        $apiResource['id'],
                        $this->user
                    )->delay(now()->addSeconds(3));
                }

                AddTagsJob::dispatch(
                    $orderReference,
                    ['Gönderi oluşturuldu'],
                    $this->user
                );

                $shipmentIds[] = $apiResource['id'];

                TriggerShipmentCreated::dispatch($apiResource, $this->user);
            }

            return $shipmentIds;
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
