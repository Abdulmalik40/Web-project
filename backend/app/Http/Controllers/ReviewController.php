<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;

/**
 * Review Controller
 * Handles user reviews for places (tourist destinations)
 * Reviews are linked to places using place_key identifier
 * Users can create reviews and view all reviews for a specific place
 */
class ReviewController extends Controller
{
    /**
     * Create a new review for a place
     * Automatically links review to authenticated user
     * Place is identified by place_key (unique identifier for the location)
     * 
     * POST /api/reviews
     * Required: place_key, rating (1-5)
     * Optional: comment
     */
    public function store(Request $request)
    {
        // Validate input data
        $fields = $request->validate([
            'place_key' => 'required|string', // Unique identifier for the place
            'rating' => 'required|integer|min:1|max:5', // Rating from 1 to 5 stars
            'comment' => 'nullable|string', // Optional text comment
        ]);

        // Create review and link to current user
        // user_id is automatically set from authentication token
        $review = Review::create([
            'user_id' => $request->user()->id, // From Bearer token
            'place_key' => $fields['place_key'], // Links review to a place
            'rating' => $fields['rating'], // 1-5 star rating
            'comment' => $fields['comment'] ?? null, // Optional text review
        ]);

        return response()->json([
            'message' => 'Review added successfully',
            'review' => $review,
        ], 201);
    }

    /**
     * Get all reviews for a specific place
     * Includes user information for each review
     * This is a public route (no authentication required) so anyone can view reviews
     * 
     * GET /api/reviews/{place_key}
     */
    public function getByPlace($place_key)
    {
        // Get all reviews for this place, including user details
        // with('user') loads user information (name, etc.) in the same query
        // Ordered by newest reviews first
        $reviews = Review::with('user') // Load user relationship
            ->where('place_key', $place_key) // Filter by place
            ->orderBy('created_at', 'desc') // Newest first
            ->get();

        return response()->json($reviews);
    }
}
