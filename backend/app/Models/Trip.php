<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    protected $fillable = ['user_id', 'title', 'city', 'days'];

    public function items()
    {
        return $this->hasMany(TripItem::class);
    }
}