<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Trip Model
 * Represents a trip plan created by a user
 * 
 * Relationship:
 * - belongs to User (user_id)
 * - has many TripItems (places added to the trip)
 * 
 * Fields:
 * - user_id: Owner of the trip
 * - title: Trip name/title
 * - city: Main city for the trip
 * - days: Number of days for the trip
 */
class Trip extends Model
{
    // Fields that can be mass-assigned (set using create/update)
    protected $fillable = ['user_id', 'title', 'city', 'days'];

    /**
     * Relationship: Trip has many items (places)
     * Each place added to the trip is stored as a TripItem
     * Use this to get all places in a trip: $trip->items
     */
    public function items()
    {
        return $this->hasMany(TripItem::class);
    }
}