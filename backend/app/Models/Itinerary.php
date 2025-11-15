<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Itinerary extends Model
{
    use HasFactory;

    // الأعمدة اللي نسمح تعبئتها بالـ create() / update()
    protected $fillable = [
        'user_id',
        'title',
        'main_destination',
        'start_date',
        'end_date',
        'total_budget',
        'plan_details',
    ];

    // نحول plan_details تلقائيًا من/إلى JSON -> Array
    protected $casts = [
        'plan_details' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // كل خطة تابعة لمستخدم واحد
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
