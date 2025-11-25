<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Itinerary Model
 * Represents a detailed trip itinerary with dates, budget, and complete plan
 * Unlike Trip model, this stores all plan details in JSON format
 * Better for complex trip planning with structured day-by-day plans
 * 
 * Relationship:
 * - belongs to User (user_id)
 * 
 * Special Features:
 * - plan_details is automatically converted between JSON (database) and Array (PHP)
 * - dates are automatically converted to Carbon date objects
 */
class Itinerary extends Model
{
    use HasFactory;

    // Fields that can be mass-assigned using create() or update()
    protected $fillable = [
        'user_id', // Owner of the itinerary
        'title', // Trip title
        'main_destination', // Primary location/city
        'start_date', // Trip start date
        'end_date', // Trip end date
        'total_budget', // Total budget amount
        'plan_details', // Complete plan stored as JSON array
    ];

    /**
     * Automatic type casting
     * Laravel automatically converts these fields between database format and PHP types
     */
    protected $casts = [
        'plan_details' => 'array', // JSON string <-> PHP array (automatic)
        'start_date' => 'date', // Database date <-> Carbon date object
        'end_date' => 'date', // Database date <-> Carbon date object
    ];

    /**
     * Relationship: Itinerary belongs to User
     * Each itinerary is owned by one user
     * Use this to get the owner: $itinerary->user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
