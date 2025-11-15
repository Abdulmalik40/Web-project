<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Trip;
class TripController extends Controller
{
    // عرض خطط المستخدم
    public function index(Request $request)
    {
        return Trip::where('user_id', $request->user()->id)->get();
    }

    // إنشاء خطة جديدة
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'days' => 'integer|min:1',
        ]);

        return Trip::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'city' => $request->city,
            'days' => $request->days ?? 1,
        ]);
    }

    // عرض خطة محددة + الأماكن
    public function show(Request $request, Trip $trip)
    {
        if ($trip->user_id !== $request->user()->id)
            return response()->json(['message' => 'Forbidden'], 403);

        return $trip->load('items');
    }

    // حذف خطة
    public function destroy(Request $request, Trip $trip)
    {
        if ($trip->user_id !== $request->user()->id)
            return response()->json(['message' => 'Forbidden'], 403);

        $trip->delete();
        return ['message' => 'deleted'];
    }

    // إضافة مكان داخل الخطة
    public function addItem(Request $request, Trip $trip)
    {
        if ($trip->user_id !== $request->user()->id)
            return response()->json(['message' => 'Forbidden'], 403);

        $request->validate([
            'place_id' => 'required',
            'place_name' => 'required',
            'day_number' => 'integer|min:1',
        ]);

        return $trip->items()->create([
            'place_id' => $request->place_id,
            'place_name' => $request->place_name,
            'category' => $request->category,
            'day_number' => $request->day_number ?? 1,
        ]);
    }
}

