<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// الصفحة الرئيسية (عدّلها على كيفك)
Route::get('/', function () {
    return view('welcome');
});

// صفحة التسجيل (Sign Up form)
Route::get('/register', [AuthController::class, 'showRegisterForm'])->name('register.form');

// إرسال بيانات التسجيل وتخزينها في قاعدة البيانات
Route::post('/register', [AuthController::class, 'register'])->name('register');

// صفحة تسجيل الدخول (Login form)
Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');

// إرسال بيانات تسجيل الدخول
Route::post('/login', [AuthController::class, 'login'])->name('login.post');

// تسجيل الخروج
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// مثال على صفحة محمية ما يدخلها إلا مستخدم مسجّل
Route::get('/dashboard', function () {
    return view('dashboard'); // سوّي له ملف blade لاحقاً لو حاب
})->middleware('auth');
