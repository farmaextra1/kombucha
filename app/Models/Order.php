<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'email',
        'address',
        'city',
        'zip',
        'country',
        'shipping_method',
        'payment_method',
        'total_price',
        'status',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_details')->withPivot('quantity', 'price');
    }
}