<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        // التحقق من البيانات
        $fields = $request->validate([
            'place_key' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        // إنشاء التقييم
        $review = Review::create([
            'user_id' => $request->user()->id,   // المستخدم صاحب التوكن
            'place_key' => $fields['place_key'],
            'rating' => $fields['rating'],
            'comment' => $fields['comment'] ?? null,
        ]);

        return response()->json([
            'message' => 'Review added successfully',
            'review' => $review,
        ], 201);
    }
    public function getByPlace($place_key)
    {
        // نجيب كل التقييمات الخاصة بالمكان
        $reviews = Review::with('user')
            ->where('place_key', $place_key)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }

}
