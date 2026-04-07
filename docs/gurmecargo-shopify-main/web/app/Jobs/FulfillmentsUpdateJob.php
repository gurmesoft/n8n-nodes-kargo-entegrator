<?php

namespace App\Jobs;

use App\Services\CargoSAAS\Resources;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Osiset\ShopifyApp\Contracts\Commands\Shop as IShopCommand;
use Osiset\ShopifyApp\Contracts\Queries\Shop as IShopQuery;
use Osiset\ShopifyApp\Objects\Values\ShopDomain;
use stdClass;

/**
 * Webhook job responsible for handling when the app is uninstalled.
 */
class FulfillmentsUpdateJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * The shop domain.
     *
     * @var ShopDomain|string
     */
    protected $domain;

    /**
     * The webhook data.
     *
     * @var object
     */
    protected $data;

    /**
     * Create a new job instance.
     *
     * @param  string  $domain  The shop domain.
     * @param  stdClass  $data  The webhook data (JSON decoded).
     * @return void
     */
    public function __construct(string $domain, stdClass $data)
    {
        $this->domain = $domain;
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @param  IShopQuery  $shopQuery  The querier for shops.
     */
    public function handle(IShopQuery $shopQuery): void
    {
        $this->domain = ShopDomain::fromNative($this->domain);

        $shop = $shopQuery->getByDomain($this->domain);
        /** @var \App\Models\User $shop */
        if ($this->data->status === 'cancelled') {
            $dbRow = $shop->shipments->where('fulfillment_id', $this->data->id)->first();

            if ($dbRow) {
                (new Resources\Shipments($shop->api_key))->destroy($dbRow->shipment_id);

                $dbRow->delete();
            }
        }
    }
}
