<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Osiset\ShopifyApp\Contracts\ShopModel as IShopModel;
use Osiset\ShopifyApp\Traits\ShopModel;

class User extends Authenticatable implements IShopModel
{
    use Notifiable;
    use ShopModel;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'api_key',
        'last_sync_time',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            //'password' => 'hashed',
        ];
    }

    /**
     * Gönderiler.
     */
    public function shipments(): HasMany
    {
        return $this->hasMany(\App\Models\Shipment::class);
    }

    /**
     * İadeler.
     */
    public function returneds(): HasMany
    {
        return $this->hasMany(\App\Models\Returned::class);
    }

    /**
     * Konum ayarları.
     */
    public function locationSettings(): HasMany
    {
        return $this->hasMany(\App\Models\LocationSetting::class);
    }

    /**
     * Kargo Takip.
     */
    public function tracking(): HasOne
    {
        return $this->hasOne(\App\Models\Tracking::class);
    }

    /**
     * Otomatik Gönderi Ayarları.
     */
    public function automaticShipmentSetting(): HasOne
    {
        return $this->hasOne(AutomaticShipmentSetting::class);
    }

    /**
     * Webhook.
     */
    public function webhooks(): HasMany
    {
        return $this->hasMany(Webhook::class);
    }

    /**
     * Validated Addresses.
     */
    public function validatedAddresses(): HasMany
    {
        return $this->hasMany(ValidatedAddress::class);
    }

    /**
     * Diğer Ayarlar.
     */
    public function otherSettings(): HasOne
    {
        return $this->hasOne(OtherSettings::class);
    }

    /**
     * Konumlar.
     */
    public function saasSetting(): HasOne
    {
        return $this->hasOne(SaasSetting::class);
    }

    /**
     * Metafield Ayarları.
     */
    public function metafieldSettings(): HasMany
    {
        return $this->hasMany(MetafieldSetting::class);
    }

    /**
     * Gönderim Profil Eşleştirmeleri.
     */
    public function deliveryProfileMaps(): HasMany
    {
        return $this->hasMany(DeliveryProfileMap::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::updated(function ($user) {
            if (! $user->api_key) {
                $user->locationSettings()->delete();
                $user->automaticShipmentSetting()->delete();
                $user->otherSettings()->delete();
                $user->saasSetting()->delete();
            } else {
                (new \App\Services\CargoSAAS\ApiRequests($user->api_key))->settingsWebhook([
                    'webhook_url' => route('sync-webhook', ['user' => $user->id]),
                ]);
            }
        });
    }
}
