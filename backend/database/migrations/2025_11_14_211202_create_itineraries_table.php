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
        Schema::create('itineraries', function (Blueprint $table) {
            $table->id();
            // صاحب الخطة (المستخدم)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // عنوان الخطة (مثلاً: "خطة 3 أيام في مكة والمدينة")
            $table->string('title');
            
            // المدينة / المنطقة الأساسية (اختياري)
            $table->string('main_destination')->nullable();

            // تاريخ البداية والنهاية (اختياري)
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            // الميزانية التقديرية (اختياري)
            $table->integer('total_budget')->nullable();

            // تفاصيل الخطة نفسها (JSON فيه الأيام والأنشطة)
            $table->json('plan_details'); // مثال: [{day:1, place:"الحرم", ...}, ...]

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('itineraries');
    }
};
