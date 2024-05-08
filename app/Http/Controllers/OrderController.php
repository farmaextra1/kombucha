<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $userEmail = $request->user()->email;
        $orders = Order::where('email', $userEmail)
            ->with(['products' => function ($query) {
                $query->with('category');
            }])
            ->get();

        return response()->json($orders);
    }
}