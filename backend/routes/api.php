<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ItineraryController;
use App\Http\Controllers\TripController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public route: anyone can view reviews for a place
Route::get('/reviews/{place_key}', [ReviewController::class, 'getByPlace']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/reviews', [ReviewController::class, 'store']); // for reviews - requires auth

    // خطط الرحلات (Itineraries)
    Route::post('/itineraries', [ItineraryController::class, 'store']);
    Route::get('/itineraries', [ItineraryController::class, 'index']);
    Route::get('/itineraries/{id}', [ItineraryController::class, 'show']);
    Route::delete('/itineraries/{id}', [ItineraryController::class, 'destroy']);

    // قائمة الخطط الخاصة بالمستخدم (Trips - alternative system)
    Route::get('/trips', [TripController::class, 'index']);
    Route::post('/trips', [TripController::class, 'store']);
    Route::get('/trips/{trip}', [TripController::class, 'show']);
    Route::delete('/trips/{trip}', [TripController::class, 'destroy']);
    Route::post('/trips/{trip}/items', [TripController::class, 'addItem']);
});
