<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Review Model
 * Represents a user review/rating for a place (tourist destination)
 * 
 * Relationship:
 * - belongs to User (user_id)
 * 
 * Fields:
 * - user_id: User who wrote the review
 * - place_key: Unique identifier for the place being reviewed
 * - rating: Star rating from 1 to 5
 * - comment: Optional text review/comment
 */
class Review extends Model
{
    use HasFactory;

    // Fields that can be mass-assigned using create() or update()
    protected $fillable = [
        'user_id', // Reviewer (owner)
        'place_key', // Place identifier (links review to location)
        'rating', // Rating from 1 to 5 stars
        'comment', // Optional text comment
    ];

    /**
     * Relationship: Review belongs to User
     * Each review is written by one user
     * Use this to get reviewer info: $review->user (name, email, etc.)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
