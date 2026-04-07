<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property array|null $warehouses
 * @property array|null $cargo_integrations
 * @property array|null $shipment_settings
 * @property array|null $returned_settings
 */
class SaasSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'warehouses',
        'cargo_integrations',
        'shipment_settings',
        'returned_settings',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'warehouses' => 'array',
        'cargo_integrations' => 'array',
        'shipment_settings' => 'array',
        'returned_settings' => 'array',
    ];

    /**
     * Get the user that owns the location.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
