<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            // المستخدم اللي كتب التقييم
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // المعلم / المكان (نخليه نص عادي الآن مثل slug أو اسم ثابت)
            $table->string('place_key');

            // التقييم من 1 إلى 5
            $table->unsignedTinyInteger('rating');

            // التعليق
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
