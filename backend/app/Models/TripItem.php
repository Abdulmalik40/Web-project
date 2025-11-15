<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripItem extends Model
{
    protected $fillable = [
        'trip_id',
        'day_number',
        'place_id',
        'place_name',
        'category'
    ];
}