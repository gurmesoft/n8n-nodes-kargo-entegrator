<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OtherSettings extends Model
{
    protected $fillable = [
        'fulfillment_update',
        'barcode_metafield',
        'barcode_number',
        'barcode_number_format',
        'package_count_enabled',
        'package_count_per_item',
        'desi_sum_enabled',
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
        'fulfillment_update' => 'boolean',
        'barcode_metafield' => 'boolean',
        'barcode_number' => 'boolean',
        'package_count_enabled' => 'boolean',
        'desi_sum_enabled' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
