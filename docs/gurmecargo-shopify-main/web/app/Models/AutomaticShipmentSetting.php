<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property \App\Models\User $user
 */
class AutomaticShipmentSetting extends Model
{
    protected $fillable = [
        'is_enabled',
        'delay',
        'fix_address',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'user_id',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'is_enabled' => 'boolean',
        'fix_address' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function ($setting) {
            if ($setting->is_enabled) {
                $setting->registerOrderCreateWebhook();
            }
        });

        static::updated(function ($setting) {
            if ($setting->is_enabled && $setting->wasChanged('is_enabled')) {
                $setting->registerOrderCreateWebhook();
            }

            if (! $setting->is_enabled && $setting->wasChanged('is_enabled')) {
                $setting->unregisterOrderCreateWebhook();
            }
        });

        static::deleted(function ($setting) {
            $setting->unregisterOrderCreateWebhook();
        });
    }

    protected function registerOrderCreateWebhook()
    {
        $webhookUrl = env('APP_URL') . '/webhook/orders-create';

        $mutation = \App\Services\Shopify\GraphQL\Query::getWebhookCreateMutation();

        $variables = [
            'topic' => 'ORDERS_CREATE',
            'webhookSubscription' => [
                'callbackUrl' => $webhookUrl,
                'format' => 'JSON',
            ],
        ];

        $response = \App\Services\Shopify\Api::graph($mutation, $variables);

        $webhookId = $response['webhookSubscription']['id'];

        $this->user->webhooks()->updateOrCreate(
            [
                'topic' => 'ORDERS_CREATE',
            ],
            [
                'topic' => 'ORDERS_CREATE',
                'shopify_webhook_id' => $webhookId,
            ]
        );
    }

    protected function unregisterOrderCreateWebhook()
    {
        $webhook = \App\Models\Webhook::where('user_id', $this->user_id)
            ->where('topic', 'ORDERS_CREATE')
            ->first();

        if ($webhook) {
            $mutation = \App\Services\Shopify\GraphQL\Query::getWebhookDeleteMutation();
            $variables = [
                'id' => 'gid://shopify/WebhookSubscription/' . $webhook->shopify_webhook_id,
            ];

            \App\Services\Shopify\Api::graph($mutation, $variables);

            $webhook->delete();
        }
    }
}
