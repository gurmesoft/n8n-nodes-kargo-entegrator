<?php

namespace App\Jobs;

use App\Models\Shipment;
use App\Services\Shopify\Api;
use App\Services\Shopify\GraphQL\Query;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateOrderMetafieldJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * Sipariş ID'si
     *
     * @var string|int
     */
    protected $orderId;

    /**
     * Gönderi ID'si
     *
     * @var string|int
     */
    protected $shipmentId;

    /**
     * Kullanıcı
     *
     * @var \App\Models\User
     */
    protected $user;

    /**
     * Yeni job örneğini oluştur.
     *
     * @param  string|int  $orderId
     * @param  string|int  $shipmentId
     * @param  \App\Models\User  $user
     * @return void
     */
    public function __construct($orderId, $shipmentId, $user)
    {
        $this->orderId = $orderId;
        $this->shipmentId = $shipmentId;
        $this->user = $user;
    }

    /**
     * Job'ı çalıştır.
     *
     * @return void
     */
    public function handle()
    {
        try {
            $mutation = Query::updateOrderMutation();

            $shipments = Shipment::where('order_id', $this->orderId)
                ->get()
                ->map(function ($row) {
                    return [
                        'shipment_id' => $row->shipment_id,
                        'barcode' => $row->shipment['barcode'],
                        'cargo_company' => $row->shipment['cargo_company']['title'],
                    ];
                });

            $variables = [
                'input' => [
                    'metafields' => [
                        [
                            'namespace' => 'kargo_entegrator',
                            'key' => 'shipment_data',
                            'type' => 'json',
                            'value' => $shipments->toJson(),
                        ],
                    ],
                    'id' => "gid://shopify/Order/{$this->orderId}",
                ],
            ];

            Api::graph($mutation, $variables, user: $this->user);
        } catch (\Exception $e) {
            throw $e;
        }
    }
}
