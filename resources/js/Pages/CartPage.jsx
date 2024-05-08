import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Retrieve cart items from local storage
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
    }, []);

    const handleRemoveFromCart = (productId) => {
        // Decrement the quantity or remove the item if it is the last one
        const updatedCartItems = cartItems
            .map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item)
            .filter(item => item.quantity > 0);
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    const handleAddToCart = (productId) => {
        // Increment the quantity of the product if it is less than the stock
        const updatedCartItems = cartItems.map(item => {
            if (item.id === productId && item.quantity < item.stock) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    return (
        <>
            <Head title="Shopping Cart" />
            <div className="container mx-auto px-4">
                <h1 className="text-2xl mb-4">Shopping Cart</h1>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div>
                        {cartItems.map((item) => (
                            <div key={item.id} className="mb-4 flex items-center">
                                <img src={item.image} alt={item.name} className="w-20 h-20 mr-4" />
                                <div>
                                    <h2 className="text-lg font-semibold">{item.name}</h2>
                                    <p className="text-gray-500">Price: ${item.price}</p>
                                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                                    <p className="text-gray-500">Stock: {item.stock}</p>
                                    <div className="flex items-center">
                                        <button
                                            className="text-red-500 hover:text-red-700 mx-2"
                                            onClick={() => handleRemoveFromCart(item.id)}
                                        >
                                            -
                                        </button>
                                        <button
                                            className={`text-green-500 hover:text-green-700 mx-2 ${
                                                item.quantity >= item.stock ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                            onClick={() => handleAddToCart(item.id)}
                                            disabled={item.quantity >= item.stock}
                                        >
                                            +
                                        </button>
                                        {item.quantity >= item.stock && (
                                            <p className="text-red-500 ml-2">Out of stock</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Link
                            href={route('checkout')}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}