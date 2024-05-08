<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Order;

class AdminController extends Controller
{
    public function index()
    {
        $products = Product::all();
        $orders = Order::with('products')->get();

        return view('admin.index', compact('products', 'orders'));
    }

    public function addProduct(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required',
            'description' => 'required',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            // Add more validation rules for other fields
        ]);

        // Create a new product
        Product::create($validatedData);

        return redirect()->route('admin.index')->with('success', 'Product added successfully.');
    }

    public function updateProduct(Request $request, $id)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required',
            'description' => 'required',
            'price' => 'required|numeric',
            'stock' => 'required|integer',
            // Add more validation rules for other fields
        ]);

        // Find the product by ID and update it
        $product = Product::findOrFail($id);
        $product->update($validatedData);

        return redirect()->route('admin.index')->with('success', 'Product updated successfully.');
    }

    public function deleteProduct($id)
    {
        // Find the product by ID and delete it
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('admin.index')->with('success', 'Product deleted successfully.');
    }

    // Add more methods for managing orders as needed
}