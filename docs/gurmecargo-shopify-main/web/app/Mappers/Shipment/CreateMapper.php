<?php

namespace App\Mappers\Shipment;

use Illuminate\Support\Str;

class CreateMapper
{
    /**
     * BaseMapper instance
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
        $request = [
            'platform_id' => $this->mapper->order['id'],
            'platform_d_id' => $this->mapper->order['name'],
            'note' => $this->mapper->order['note'],
            'platform' => 'shopify',
            'notification_url' => route('service-webhook'),
            'customer' => $this->mapper->mapCustomer(),
            'fulfillment_orders' => array_values(array_filter($this->mapFulfillmentOrders(), fn ($fulfillment) => ! empty($fulfillment['lines']))),
        ];

        $request = $this->profileMap($request);

        return $request;
    }

    private function mapFulfillmentOrders()
    {
        return array_map(
            fn ($fulfillmentOrder) => array_merge([
                'fulfillment_order_id' => $fulfillmentOrder['id'],
                'need_fulfillment' => true,
                'is_pay_at_door' => $this->isCOD(),
                'currency' => $this->mapper->order['currencyCode'],
                'total' => $this->mapper->order['currentTotalPriceSet']['presentmentMoney']['amount'],
                'invoice_number' => $fulfillmentOrder['id'],
                'waybill_number' => $fulfillmentOrder['id'],
                'desi' => $this->calculateDesi($fulfillmentOrder['lineItems']),
                'package_count' => $this->calculatePackageCount($fulfillmentOrder['lineItems']),
                'kg' => '',
                'description' => '',
                'barcode' => $this->generateBarcode(),
                'location_name' => $fulfillmentOrder['assignedLocation']['location']['name'],
                'lines' => array_values(array_map(function ($line) {
                    return [
                        'platform_id' => $line['id'],
                        'quantity' => $line['remainingQuantity'],
                        'fulfillable_quantity' => $line['remainingQuantity'],
                        'title' => $this->getProductTitle($line),
                        'sku' => $line['sku'],
                        'image' => $line['image'] ? $line['image']['src'] : null,
                        'weight' => $line['weight'] ? $line['weight']['value'] : null,
                        'price' => $line['lineItem']['originalUnitPriceSet']['presentmentMoney']['amount'] ?? null,
                        'gtip_code' => $line['variant']['inventoryItem']['harmonizedSystemCode'] ?? null,
                    ];
                }, array_filter($fulfillmentOrder['lineItems'], fn ($line) => $line['requiresShipping']))),
            ], $this->mapper->getLocationSettings($fulfillmentOrder['assignedLocation']['location']['id'])),
            $this->mapper->order['fulfillmentOrders']
        );
    }

    private function isCOD()
    {
        return Str::contains(implode(' ', $this->mapper->order['paymentGatewayNames']), 'kapıda', true) ||
            in_array('Cash on Delivery (COD)', $this->mapper->order['paymentGatewayNames']) ||
            Str::contains(implode(' ', $this->mapper->order['paymentGatewayNames']), 'cod', true);
    }

    private function getProductTitle($line)
    {
        if (empty($line['variantTitle']) === false) {
            return $line['productTitle'] . ' - ' . $line['variantTitle'];
        }

        return $line['productTitle'];
    }

    /**
     * Generate a barcode based on user settings
     *
     * @return string|null
     */
    private function generateBarcode()
    {
        $otherSettings = $this->mapper->user->otherSettings ?? null;

        if (!$otherSettings || !$otherSettings->barcode_number || empty($otherSettings->barcode_number_format)) {
            return null;
        }

        $orderNumber = preg_replace('/[^0-9]/', '', $this->mapper->order['name']);
        $orderGlobalNumber = $this->mapper->order['id'];

        $barcode = $otherSettings->barcode_number_format;
        $barcode = str_replace('${orderNumber}', $orderNumber, $barcode);
        $barcode = str_replace('${orderGlobalNumber}', $orderGlobalNumber, $barcode);
        $barcode = preg_replace('/[^0-9]/', '', $barcode);
        return $barcode;
    }

    /**
     * Satırlardaki ürün metafield 'desi' değerlerini toplar
     * Desi olmayan ürünler 0 kabul edilir. 'nodes' yapısı varsa desteklenir.
     */
    private function calculateDesi($lineItems): string
    {
        if (!is_array($lineItems)) {
            return '';
        }

        $total = 0.0;
        $metafieldSettings = $this->mapper->user->metafieldSettings ?? [];
        $desiMetafieldKey = $metafieldSettings->where('target_field', 'desi')->first()['metafield_key'] ?? 'desi';
        foreach ($lineItems as $item) {
            if (empty($item['requiresShipping'])) {
                continue;
            }

            $desiSum = $this->mapper->user->otherSettings->desi_sum_enabled ?? false;

            $metafields = collect($item['lineItem']['product']['metafields'] ?? []);

            $desi = $metafields->where('key', $desiMetafieldKey)->first()['value'] ?? 0.0;

            if ($desiSum) {
                $total = max($total, (float) $desi);
            } else {
                $total += (float) $desi;
            }
        }

        return $total > 0 ? (string) $total : '';
    }

    private function calculatePackageCount($lineItems)
    {
        $otherSettings = $this->mapper->user->otherSettings ?? null;

        if (!$otherSettings || !$otherSettings->package_count_enabled) {
            return 1;
        }

        return $otherSettings->package_count_per_item * count($lineItems);
    }

    private function profileMap($request)
    {
        $maps = $this->mapper->user->deliveryProfileMaps?->toArray() ?? [];
        $shippingLine = $this->mapper->order['shippingLine'];

        if (empty($maps) || empty($shippingLine)) {
            return $request;
        }

        $title = $shippingLine['title'] ?? $shippingLine[0]['title'] ?? null;

        if (null === $title) {
            return $request;
        }


        foreach ($maps as $map) {
            if ($map['profile'] === $title) {
                foreach ($request['fulfillment_orders'] as $index => $fulfillmentOrder) {
                    $request['fulfillment_orders'][$index]['cargo_integration_id'] = $map['cargo_integration_id'];
                    $request['fulfillment_orders'][$index]['package_type'] = $map['package_type'];
                    $request['fulfillment_orders'][$index]['payor_type'] = $map['payor_type'];
                    $request['fulfillment_orders'][$index]['payment_type'] = $map['payment_type'];
                }
                break;
            }
        }

        return $request;
    }
}
