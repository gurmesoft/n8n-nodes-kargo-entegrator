<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Osiset\ShopifyApp\Contracts\Commands\Shop as IShopCommand;
use Osiset\ShopifyApp\Contracts\Queries\Shop as IShopQuery;

/**
 * Webhook job responsible for handling when the app is uninstalled.
 */
class AfterAuthenticateJob implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    /**
     * The webhook data.
     *
     * @var \App\Models\User
     */
    protected $user;

    /**
     * Create a new job instance.
     *
     * @param  \App\Models\User  $user  The webhook data (JSON decoded).
     * @return void
     */
    public function __construct(\App\Models\User $user)
    {
        $this->user = $user;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

        $response = \App\Services\Shopify\Api::graph(\App\Services\Shopify\GraphQL\Query::getShopInfo(), user: $this->user);

        $request = [
            'site_name' => $response['name'] . ' / ' . $response['primaryDomain']['url'],
            'url' => $response['myshopifyDomain'],
            'admin_email' => $response['email'],
            'platform' => 'shopify',
            'plugin' => 'kargo-entegrator',
            'plugin_version' => '1.0.0',
            'active_plugins' => [
                [
                    'name' => 'kargo-entegrator',
                    'version' => '1.0.0',
                ],
            ],
            'server' => [
                'php_version' => null,
                'php_curl' => null,
                'mysql_version' => null,
                'php_soap' => null,
                'software' => null,
            ],
            'wp' => [
                'version' => null,
                'debug_mode' => null,
                'memory_limit' => null,
                'multisite' => null,
                'theme_author' => null,
                'theme_name' => null,
                'theme_slug' => null,
                'theme_uri' => null,
                'theme_version' => null,
            ],
            'is_local' => 'no',
            'ip_address' => null,
            'users' => [
                'total' => null,
            ],
        ];

        Http::post('https://trackingdata-gobg2kq4lq-uc.a.run.app', $request);
    }
}
