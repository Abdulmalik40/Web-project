<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * TripItem Model
 * Represents a single place/location added to a trip
 * Multiple items make up a complete trip plan
 * 
 * Relationship:
 * - belongs to Trip (trip_id)
 * 
 * Fields:
 * - trip_id: Which trip this place belongs to
 * - day_number: Which day of the trip (1, 2, 3, etc.)
 * - place_id: Unique identifier for the place
 * - place_name: Display name of the place
 * - category: Type of place (e.g., "restaurant", "hotel", "attraction")
 */
class TripItem extends Model
{
    // Fields that can be mass-assigned
    protected $fillable = [
        'trip_id', // Links to parent Trip
        'day_number', // Which day of the trip
        'place_id', // Unique place identifier
        'place_name', // Display name
        'category' // Place category/type
    ];
}