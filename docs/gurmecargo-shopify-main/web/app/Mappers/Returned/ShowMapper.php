<?php

namespace App\Mappers\Returned;

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
        return $this->mapper->user->returneds()->where('order_id', $this->mapper->order['id'])->get()->toArray();
    }

    public function getReturnedIds()
    {
        return $this->mapper->user->returneds()->where('order_id', $this->mapper->order['id'])->pluck('returned_id')->toArray();
    }
}
