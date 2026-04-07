<?php

namespace App\Mappers\Shipment;

class BaseMapper extends \App\Mappers\Base
{
    public function __construct($user, $warehouses, $cargoIntegrations, $shipmentSetting, $order, $otherSettings)
    {
        $this->order = $order;
        $this->warehouses = $warehouses;
        $this->cargoIntegrations = $cargoIntegrations;
        $this->deliverySetting = $shipmentSetting;
        $this->user = $user;
        $this->otherSettings = $otherSettings;
        $this->order['fulfillmentOrders'] = isset($this->order['fulfillmentOrders']) && is_array($this->order['fulfillmentOrders'])
            ? $this->order['fulfillmentOrders'] : [];
        $this->order['fulfillmentOrders'] = array_values(array_filter($this->order['fulfillmentOrders'], function ($fulfillmentOrder) {
            $actions = array_map(fn ($e) => $e['action'], $fulfillmentOrder['supportedActions']);
            if (null !== $this->otherSettings && $this->otherSettings->fulfillment_update) {
                $row = \App\Models\Shipment::where('fulfillment_order_id', $fulfillmentOrder['id'])->first();
            } else {
                $row = null;
            }

            return in_array('CREATE_FULFILLMENT', $actions) && ! $row;
        }));
    }

    public function createMapper()
    {
        return new CreateMapper($this);
    }

    public function showMapper()
    {
        return new ShowMapper($this);
    }
}
