<?php

namespace App\Mappers\Returned;

class CreateMapper
{
    /**
     * BaseMapper instance.
     *
     * @param  BaseMapper  $mapper
     */
    public $mapper;

    public function __construct(BaseMapper $mapper)
    {
        $this->mapper = $mapper;
    }

    public function map()
    {
        return [
            'platform_id' => $this->mapper->order['id'],
            'platform_d_id' => $this->mapper->order['name'],
            'note' => $this->mapper->order['note'],
            'platform' => 'shopify',
            'notification_url' => route('service-returned-webhook'),
            'customer' => $this->mapper->mapCustomer(),
            'returns' => $this->mapReturns(),
        ];
    }

    private function mapReturns()
    {
        return array_map(
            fn ($return) => array_merge([
                'return_id' => $return['id'],
                'return_d_id' => $return['name'],
                'reverse_fulfillment_order_id' => $this->findRFOId($return['reverseFulfillmentOrders']),
                'need_return' => true,
                'is_pay_at_door' => false,
                'currency' => $this->mapper->order['currencyCode'],
                'total' => 0.00,
                'invoice_number' => $return['id'],
                'waybill_number' => $return['id'],
                'return_at' => \Carbon\Carbon::now()->addDay()->format('Y-m-d'),
                'lines' => array_values(array_map(function ($line) {
                    return [
                        'platform_id' => $line['id'],
                        'reason' => $this->getReasonText($line['returnReason']),
                        'customer_note' => $line['customerNote'],
                        'quantity' => $line['quantity'],
                        'sold_qty' => $line['fulfillmentLineItem']['quantity'],
                        'title' => $line['fulfillmentLineItem']['lineItem']['name'],
                        'sku' => $line['fulfillmentLineItem']['lineItem']['sku'],
                        'image' => $line['fulfillmentLineItem']['lineItem']['image']['src'] ?? null,
                    ];
                }, $return['returnLineItems'])),
            ], $this->mapper->getLocationSettings()),
            $this->mapper->order['returns']
        );
    }

    private function getReasonText($reason)
    {

        $reasons = [
            'SIZE_TOO_SMALL' => 'Beden çok küçük',
            'SIZE_TOO_LARGE' => 'Beden çok büyük',
            'UNWANTED' => 'Fikrimi değiştirdim',
            'NOT_AS_DESCRIBED' => 'Ürün açıklamada belirtildiği gibi değil',
            'WRONG_ITEM' => 'Yanlış ürün gönderildi',
            'DEFECTIVE' => 'Hasarlı veya kusurlu',
            'STYLE' => 'Tarz',
            'COLOR' => 'Renk',
            'OTHER' => 'Diğer',
        ];

        return $reasons[$reason] ?? 'Diğer';
    }

    private function findRFOId($orders)
    {

        if (! is_array($orders) || empty($orders)) {
            return false;
        }

        $avaiableOrders = array_values(
            array_filter($orders, fn ($order) => $order['status'] === 'OPEN')
        );

        if (empty($avaiableOrders)) {
            return false;
        }

        return $avaiableOrders[0]['id'];
    }
}
