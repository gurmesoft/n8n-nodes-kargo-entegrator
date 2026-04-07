<?php

namespace App\Jobs;

use App\Models\Returned;
use App\Services\CargoSAAS\Resources;
use App\Services\Shopify;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ReturnedUpdatedBySaasJob implements ShouldQueue
{
    use Queueable;

    /**
     * Saas gönderi kimliği.
     *
     * @var int|string
     */
    public $returnedId;

    /**
     * Create a new job instance.
     */
    public function __construct($returnedId)
    {
        $this->returnedId = $returnedId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $row = Returned::where('returned_id', $this->returnedId)->first();

        if ($row) {
            $apiResource = (new Resources\Returneds($row->user->api_key))->show($row->returned_id);

            $row->update(['returned' => $apiResource]);

            if (($apiResource['tracking_number']) && ! $row->tracking_updated) {
                $reverseOrder = Shopify\Api::graph(
                    Shopify\GraphQL\Query::getReverseFulfillmentOrder($row->reverse_fulfillment_order_id),
                    user: $row->user
                );

                $deliveryId = $reverseOrder['reverseDeliveries'][0]['id'];

                Shopify\Api::graph(
                    Shopify\GraphQL\Query::getReverseDeliveryShippingUpdate(),
                    [
                        'reverseDeliveryId' => 'gid://shopify/ReverseDelivery/' . $deliveryId,
                        'trackingInput' => [
                            'number' => $apiResource['tracking_number'],
                            'url' => $apiResource['tracking_link'],
                        ],
                        // 'notifyCustomer' => true
                    ],
                    user: $row->user
                );

                $row->tracking_updated = true;
                $row->save();
            }
        }
    }
}
