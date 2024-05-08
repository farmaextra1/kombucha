import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function OrderConfirmation() {
    useEffect(() => {
        // Clear cart and checkout data from localStorage
        localStorage.removeItem('cartItems');
        localStorage.removeItem('checkoutData');
    }, []);

    return (
        <>
            <Head title="Order Confirmation" />
            <div className="container mx-auto px-4">
                <div className="text-center py-8">
                    <h1 className="text-4xl font-bold mb-4">Thank you for your order!</h1>
                    <p className="text-xl mb-8">Your order has been successfully placed.</p>
                    <div className="mb-8">
                        <p className="text-lg">Order Number: <span className="font-bold">ORDER-XXXXXX</span></p>
                        <p className="text-lg">Order Date: <span className="font-bold">{new Date().toLocaleDateString()}</span></p>
                    </div>
                    <p className="text-lg mb-8">You will receive an email confirmation shortly with your order details.</p>
                    <div className="flex justify-center">
                        <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}