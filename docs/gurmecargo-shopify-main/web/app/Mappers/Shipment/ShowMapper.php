<?php

namespace App\Mappers\Shipment;

class ShowMapper
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
        return $this->mapper->user->shipments()->where('order_id', $this->mapper->order['id'])->get()->toArray();
    }

    public function getShipmentIds()
    {
        return $this->mapper->user->shipments()->where('order_id', $this->mapper->order['id'])->pluck('shipment_id')->toArray();
    }
}
