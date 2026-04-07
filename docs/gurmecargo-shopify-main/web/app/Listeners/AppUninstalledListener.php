<?php

namespace App\Listeners;

use Illuminate\Support\Facades\Http;
use Osiset\ShopifyApp\Messaging\Events\AppUninstalledEvent;

class AppUninstalledListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(AppUninstalledEvent $event): void
    {
        /** @var \App\Models\User $shop */
        $shop = $event->shop;
        $request = [
            'url' => $shop->name,
            'is_active' => '0',
            'plugin' => 'kargo-entegrator',
        ];

        Http::post('https://activestatuschanged-gobg2kq4lq-uc.a.run.app', $request);

        $request = [
            'url' => $shop->name,
            'plugin' => 'kargo-entegrator',
            'reasons' => [
                [
                    'value' => 'other',
                    'label' => 'Diğer',
                ],
            ],
        ];

        Http::post('https://savedeactivatereasons-gobg2kq4lq-uc.a.run.app', $request);
    }
}
