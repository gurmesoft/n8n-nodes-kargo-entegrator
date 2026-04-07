<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property \App\Models\User $user
 * @property string $target_field
 * @property string $metafield_key
 */
class MetafieldSetting extends Model
{
    /**
     * Toplu atamaya izin verilen alanlar.
     *
     * @var List<string>
     */
    protected $fillable = [
        'user_id',
        'target_field',
        'metafield_key',
    ];

    /**
     * Ayarın ait olduğu kullanıcı.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
