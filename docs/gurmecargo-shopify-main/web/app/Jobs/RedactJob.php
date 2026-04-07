<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Osiset\ShopifyApp\Contracts\Commands\Shop as IShopCommand;
use Osiset\ShopifyApp\Contracts\Queries\Shop as IShopQuery;
use stdClass;

/**
 * Webhook job responsible for handling when the app is uninstalled.
 */
class RedactJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * The webhook data.
     *
     * @var mixed
     */
    protected $data;

    /**
     * Create a new job instance.
     *
     * @param  mixed  $data  The webhook data (JSON decoded).
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @param  IShopQuery  $shopQuery  The querier for shops.
     */
    public function handle(IShopQuery $shopQuery): void
    {
    }
}
