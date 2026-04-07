<?php

namespace App\Jobs;

use App\Models\Shipment;
use App\Services\CargoSAAS\Resources;
use App\Services\Shopify;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ShipmentUpdatedBySaasJob implements ShouldQueue
{
    use Queueable;

    /**
     * Saas gönderi kimliği.
     *
     * @var int|string
     */
    public $shipmentId;

    /**
     * Create a new job instance.
     */
    public function __construct($shipmentId)
    {
        $this->shipmentId = $shipmentId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $shipment = Shipment::with(['user', 'user.otherSettings'])->where('shipment_id', $this->shipmentId)->first();

        if ($shipment && $shipment->user) {
            $apiResource = (new Resources\Shipments($shipment->user->api_key))->show($this->shipmentId);

            $shipment->update(['shipment' => $apiResource]);

            $otherSettings = $shipment->user->otherSettings;
            $skipFulfillment = $otherSettings && $otherSettings->fulfillment_update;

            if ($skipFulfillment && $apiResource['status'] === 'non_processed') {
                return;
            }

            if (! $shipment->fulfillment_id) {
                $lineItems = [];
                foreach ($shipment->shipment['lines'] as $line) {
                    $lineItemId = 'gid://shopify/FulfillmentOrderLineItem/' . $line['platform_id'];

                    $lineItems[] = [
                        'id' => $lineItemId,
                        'quantity' => (int) $line['quantity'],
                    ];
                }

                $variables = [
                    'fulfillment' => [
                        'lineItemsByFulfillmentOrder' => [
                            [
                                'fulfillmentOrderId' => 'gid://shopify/FulfillmentOrder/' . $shipment->fulfillment_order_id,
                                'fulfillmentOrderLineItems' => $lineItems,
                            ],
                        ],
                    ],
                ];

                $mutationResponse = Shopify\Api::graph(Shopify\GraphQL\Query::fulfillmentCreateMutation(), $variables, user: $shipment->user);

                if (empty($mutationResponse['userErrors'])) {
                    $shipment->fulfillment_id = $mutationResponse['fulfillment']['id'];
                    $shipment->save();
                } else {
                    $variables = [
                        'fulfillmentOrderId' => 'gid://shopify/FulfillmentOrder/' . $shipment->fulfillment_order_id,
                    ];

                    $queryResponse = Shopify\Api::graph(Shopify\GraphQL\Query::getFulfillmentOrder(), $variables, user: $shipment->user);

                    if (false === empty($queryResponse['fulfillments'])) {
                        $shipment->fulfillment_id = reset($queryResponse['fulfillments'])['id'];
                        $shipment->save();
                    }
                }
            }

            if ($apiResource['tracking_number'] && ! $shipment->tracking_updated) {
                $mutation = Shopify\GraphQL\Query::fulfillmentTrackingInfoUpdateMutation();

                $variables = [
                    'fulfillmentId' => 'gid://shopify/Fulfillment/' . $shipment->fulfillment_id,
                    'trackingInfoInput' => [
                        'company' => $apiResource['cargo_company']['title'],
                        'number' => $apiResource['tracking_number'],
                        'url' => $apiResource['tracking_link'],
                    ],
                    'notifyCustomer' => true,
                ];

                Shopify\Api::graph($mutation, $variables, user: $shipment->user);

                $shipment->tracking_updated = true;
                $shipment->save();
            }

            $status = false;

            switch ($apiResource['status']) {
                case 'non_processed':
                    $status = 'label_purchased';
                    break;
                case 'shipped':
                    $status = 'label_printed';
                    break;
                case 'on_transit':
                    $status = 'in_transit';
                    break;
                case 'in_courier':
                    $status = 'out_for_delivery';
                    break;
                case 'delivered':
                    $status = 'delivered';
                    break;
                case 'on_return':
                    $status = 'attempted_delivery';
                    break;
            }

            if ($status) {
                $message = $apiResource['steps'][array_key_last($apiResource['steps'])]['message'];

                $mutation = Shopify\GraphQL\Query::fulfillmentEventCreateMutation();
                $variables = [
                    'fulfillmentEvent' => [
                        'fulfillmentId' => 'gid://shopify/Fulfillment/' . $shipment->fulfillment_id,
                        'status' => strtoupper($status),
                        'message' => $message,
                    ],
                ];

                Shopify\Api::graph($mutation, $variables, user: $shipment->user);
            }

            if ($status === 'delivered' && $apiResource['is_pay_at_door']) {
                Shopify\Api::graph(Shopify\GraphQL\Query::getOrderMarkAsPaidMutation(), [
                    'input' => [
                        'id' => "gid://shopify/Order/{$apiResource['platform_id']}",
                    ],
                ], user: $shipment->user);
            }
        }
    }
}
