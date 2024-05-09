<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $category = Category::first(); // Ensure a category exists or create one if none

        if (!$category) {
            $category = Category::create([
                'name' => 'Default',
                'description' => 'Default category'
            ]);
        }

        Product::create([
            'id' => 1,
            'name' => 'Original Kombucha',
            'description' => 'Refreshing, slightly sweet, and full of probiotics.',
            'price' => 499,
            'category_id' => 1,
            'stock' => 10,
            'image' => 'images/kombucha1.png' 
        ]);
        Product::create([
            'id' => 2,
            'name' => 'Original Kombucha2',
            'description' => 'Refreshing2, slightly sweet, and full of probiotics.',
            'price' => 899,
            'category_id' => 2, 
            'stock' => 100,
            'image' => 'images/kombucha2.png' 
        ]);

    }
}
