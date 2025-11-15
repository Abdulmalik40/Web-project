<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Review extends Model
{
    use HasFactory;
    // الأعمدة اللي نسمح بتعبئتها مباشرة
    protected $fillable = [
        'user_id',
        'place_key',
        'rating',
        'comment',
    ];

    // علاقة الريفيو مع المستخدم
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
