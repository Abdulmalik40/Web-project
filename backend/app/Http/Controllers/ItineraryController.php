<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Itinerary;

/**
 * Itinerary Controller
 * Manages detailed trip itineraries with dates, budget, and full plan details
 * Unlike trips, itineraries store all plan information in JSON format (plan_details)
 * This system is better for complex trip planning with dates and budgets
 */
class ItineraryController extends Controller
{
    /**
     * Create a new itinerary
     * Stores complete trip plan including dates, budget, and detailed plan structure
     * Plan details are stored as JSON array (automatically converted by model)
     * 
     * POST /api/itineraries
     * Required: title, plan_details (array)
     * Optional: main_destination, start_date, end_date, total_budget
     */
    public function store(Request $request)
    {
        // Validate input - plan_details must be an array
        $fields = $request->validate([
            'title' => 'required|string|max:255',
            'main_destination' => 'nullable|string|max:255', // Main city or location
            'start_date' => 'nullable|date', // Trip start date
            'end_date' => 'nullable|date', // Trip end date
            'total_budget' => 'nullable|integer', // Total budget in currency units
            'plan_details' => 'required|array', // Array containing day-by-day plan structure
        ]);

        // Create itinerary and assign to current user
        // plan_details will be automatically converted to JSON when saved
        $itinerary = Itinerary::create([
            'user_id' => $request->user()->id, // From authentication token
            'title' => $fields['title'],
            'main_destination' => $fields['main_destination'] ?? null,
            'start_date' => $fields['start_date'] ?? null,
            'end_date' => $fields['end_date'] ?? null,
            'total_budget' => $fields['total_budget'] ?? null,
            'plan_details' => $fields['plan_details'], // Stored as JSON in database
        ]);

        return response()->json([
            'message' => 'Itinerary created successfully',
            'itinerary' => $itinerary,
        ], 201);
    }

    /**
     * Get all itineraries for the authenticated user
     * Returns list ordered by creation date (newest first)
     * 
     * GET /api/itineraries
     */
    public function index(Request $request)
    {
        // Get all itineraries for current user, newest first
        $itineraries = Itinerary::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc') // Most recent first
            ->get();

        return response()->json($itineraries);
    }

    /**
     * Get a specific itinerary by ID
     * Only returns itinerary if it belongs to the authenticated user
     * Includes security check to prevent accessing other users' itineraries
     * 
     * GET /api/itineraries/{id}
     */
    public function show(Request $request, $id)
    {
        // Find itinerary and verify it belongs to current user
        $itinerary = Itinerary::where('id', $id)
            ->where('user_id', $request->user()->id) // Security: only owner can view
            ->first();

        // Return 404 if not found (user doesn't own it or doesn't exist)
        if (!$itinerary) {
            return response()->json(['message' => 'Itinerary not found'], 404);
        }

        return response()->json($itinerary);
    }

    /**
     * Delete an itinerary
     * Only the owner can delete their itinerary
     * 
     * DELETE /api/itineraries/{id}
     */
    public function destroy(Request $request, $id)
    {
        // Find itinerary and verify ownership before deleting
        $itinerary = Itinerary::where('id', $id)
            ->where('user_id', $request->user()->id) // Security: only owner can delete
            ->first();

        // Return 404 if not found (same as show() for security)
        if (!$itinerary) {
            return response()->json(['message' => 'Itinerary not found'], 404);
        }

        // Delete the itinerary
        $itinerary->delete();

        return response()->json(['message' => 'Itinerary deleted successfully']);
    }
}
