<?php

namespace App\Mappers\Returned;

use App\Services\Shopify;
use App\Models\User;

class BaseMapper extends \App\Mappers\Base
{
    public function __construct(User $user, $warehouses, $cargoIntegrations, $returnedSetting, $order)
    {
        $this->order = $order;
        $this->warehouses = $warehouses;
        $this->cargoIntegrations = $cargoIntegrations;
        $this->deliverySetting = $returnedSetting;
        $this->user = $user;
        $this->api = new Shopify\Api();
        $this->order['returns'] = array_values(
            array_filter(
                $this->order['returns'],
                fn ($e) => ! $this->user->returneds()->where('return_id', $e['id'])->first() && in_array($e['status'], ['OPEN', 'REQUESTED'])
            )
        );
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
