<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ValidatedAddress extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'order_id',
        'address',
        'district',
        'city',
        'country',
    ];
}
