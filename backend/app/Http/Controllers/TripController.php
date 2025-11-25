<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Trip;

/**
 * Trip Controller
 * Manages user trips - a simplified trip planning system
 * Trips contain basic info (title, city, days) and have multiple items (places)
 * Each trip belongs to one user and can only be accessed by that user
 */
class TripController extends Controller
{
    /**
     * Get all trips for the authenticated user
     * Only returns trips that belong to the current user
     * 
     * GET /api/trips
     */
    public function index(Request $request)
    {
        // Filter trips to only show current user's trips
        return Trip::where('user_id', $request->user()->id)->get();
    }

    /**
     * Create a new trip
     * Automatically assigns the trip to the authenticated user
     * 
     * POST /api/trips
     * Required: title
     * Optional: city, days (defaults to 1)
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required', // Trip must have a title
            'days' => 'integer|min:1', // Days must be positive integer if provided
        ]);

        // Create trip and assign to current user
        // $request->user()->id comes from the authentication token
        return Trip::create([
            'user_id' => $request->user()->id, // Automatically set from token
            'title' => $request->title,
            'city' => $request->city, // Optional city name
            'days' => $request->days ?? 1, // Default to 1 day if not provided
        ]);
    }

    /**
     * Get a specific trip with all its items (places)
     * Includes security check to ensure user owns the trip
     * 
     * GET /api/trips/{trip}
     */
    public function show(Request $request, Trip $trip)
    {
        // Security check: prevent users from accessing other users' trips
        if ($trip->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Load trip with all related items (places) in one query
        return $trip->load('items');
    }

    /**
     * Delete a trip
     * Only the trip owner can delete it
     * Related items will be automatically deleted (cascade delete)
     * 
     * DELETE /api/trips/{trip}
     */
    public function destroy(Request $request, Trip $trip)
    {
        // Security check: only owner can delete
        if ($trip->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Delete trip - related items will be deleted automatically
        $trip->delete();
        return ['message' => 'deleted'];
    }

    /**
     * Add a place (item) to a trip
     * Places are stored separately and linked to the trip
     * Useful for adding places from map to a trip
     * 
     * POST /api/trips/{trip}/items
     * Required: place_id, place_name
     * Optional: category, day_number (defaults to 1)
     */
    public function addItem(Request $request, Trip $trip)
    {
        // Security check: only trip owner can add items
        if ($trip->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Validate required fields
        $request->validate([
            'place_id' => 'required', // Unique identifier for the place
            'place_name' => 'required', // Display name of the place
            'day_number' => 'integer|min:1', // Which day of the trip (defaults to 1)
        ]);

        // Create new item linked to this trip
        // Items allow organizing places by day and category
        return $trip->items()->create([
            'place_id' => $request->place_id,
            'place_name' => $request->place_name,
            'category' => $request->category, // Optional category (e.g., "restaurant", "hotel")
            'day_number' => $request->day_number ?? 1, // Default to day 1
        ]);
    }
}

