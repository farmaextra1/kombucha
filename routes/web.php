<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Product;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/welcome', function () {
    return Inertia::render('WelcomePage');
})->name('welcome');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/products', [ProductController::class, 'index']);
Route::post('/create-checkout-session', [StripeController::class, 'createCheckoutSession']);
Route::post('/stripe-webhook', [StripeController::class, 'handleWebhook']);
Route::get('/order-history', [OrderController::class, 'history'])->middleware('auth');


Route::get('/cart', function () {
    return Inertia::render('CartPage');
})->name('cart');

Route::get('/product/{id}', function ($id) {
    return Inertia::render('ProductPage', [
        'product' => Product::find($id),
    ]);
})->name('product');

Route::get('/checkout', function () {
    return Inertia::render('CheckoutPage');
})->name('checkout');

Route::get('/payment', function () {
    return Inertia::render('PaymentPage');
})->name('payment');

Route::get('/order-confirmation', function () {
    return Inertia::render('OrderConfirmation');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
});

Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
    Route::post('/admin/products', [AdminController::class, 'addProduct'])->name('admin.addProduct');
    Route::put('/admin/products/{id}', [AdminController::class, 'updateProduct'])->name('admin.updateProduct');
    Route::delete('/admin/products/{id}', [AdminController::class, 'deleteProduct'])->name('admin.deleteProduct');
    // Add more routes for managing orders as needed
});

require __DIR__.'/auth.php';
