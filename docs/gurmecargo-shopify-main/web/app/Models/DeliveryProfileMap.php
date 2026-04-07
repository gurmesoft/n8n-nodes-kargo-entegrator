<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryProfileMap extends Model
{
    protected $fillable = [
        'user_id',
        'profile',
        'cargo_integration_id',
        'package_type',
        'payor_type',
        'payment_type',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
