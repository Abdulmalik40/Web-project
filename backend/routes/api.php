<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ItineraryController;
use App\Http\Controllers\TripController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/reviews', [ReviewController::class, 'store']); // for reviews
    Route::get('/reviews/{place_key}', [ReviewController::class, 'getByPlace']);
    Route::post('/itineraries', [ItineraryController::class, 'store']);
    // خطط الرحلات
    Route::post('/itineraries', [ItineraryController::class, 'store']);
    Route::get('/itineraries', [ItineraryController::class, 'index']);

    // قائمة الخطط الخاصة بالمستخدم
    Route::get('/trips', [TripController::class, 'index']);

    // إنشاء خطة
    Route::post('/trips', [TripController::class, 'store']);

    // جلب خطة محددة
    Route::get('/trips/{trip}', [TripController::class, 'show']);

    // حذف خطة
    Route::delete('/trips/{trip}', [TripController::class, 'destroy']);

    // إضافة مكان داخل خطة
    Route::post('/trips/{trip}/items', [TripController::class, 'addItem']);
});
