<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Itinerary;

class ItineraryController extends Controller
{
    // إضافة خطة رحلة جديدة
    public function store(Request $request)
    {
        // التحقق من البيانات
        $fields = $request->validate([
            'title' => 'required|string|max:255',
            'main_destination' => 'nullable|string|max:255',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'total_budget' => 'nullable|integer',
            'plan_details' => 'required|array', // نتوقع Array من الأيام/الأماكن
        ]);

        // إنشاء الخطة في قاعدة البيانات
        $itinerary = Itinerary::create([
            'user_id' => $request->user()->id, // من التوكن
            'title' => $fields['title'],
            'main_destination' => $fields['main_destination'] ?? null,
            'start_date' => $fields['start_date'] ?? null,
            'end_date' => $fields['end_date'] ?? null,
            'total_budget' => $fields['total_budget'] ?? null,
            'plan_details' => $fields['plan_details'],
        ]);

        return response()->json([
            'message' => 'Itinerary created successfully',
            'itinerary' => $itinerary,
        ], 201);
    }
    public function index(Request $request)
    {
        // نجيب كل الخطط الخاصة بالمستخدم الحالي
        $itineraries = Itinerary::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($itineraries);
    }

    // جلب خطة محددة
    public function show(Request $request, $id)
    {
        $itinerary = Itinerary::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$itinerary) {
            return response()->json(['message' => 'Itinerary not found'], 404);
        }

        return response()->json($itinerary);
    }

    // حذف خطة
    public function destroy(Request $request, $id)
    {
        $itinerary = Itinerary::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$itinerary) {
            return response()->json(['message' => 'Itinerary not found'], 404);
        }

        $itinerary->delete();

        return response()->json(['message' => 'Itinerary deleted successfully']);
    }

}
