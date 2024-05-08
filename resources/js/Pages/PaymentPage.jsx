import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51N7d6TGb9oIEuaf3cHUvqvYoIuTABOVGqO9QcARE0DrX6dubs4bDdQnpJ5pQB0lXZrktS2SwOIUVVV5LDuxaopKJ00RDMJBtnd');

export default function PaymentPage({ auth }) {
    const [cartItems, setCartItems] = useState([]);
    const [checkoutData, setCheckoutData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        const data = JSON.parse(localStorage.getItem('checkoutData')) || {};
        setCartItems(items);
        setCheckoutData(data);
    }, []);
console.log(checkoutData)
    const handleCashPayment = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/orders', {
                user_id: auth.user ? auth.user.id : null,
                items: cartItems,
                total: calculateTotal(),
                email: checkoutData.email,
                address: checkoutData.address,
                firstName: checkoutData.firstName,
                lastName: checkoutData.lastName,
                company: checkoutData.company,
                city: checkoutData.city,
                zip: checkoutData.zip,
                phone: checkoutData.phone,
                country: checkoutData.country,
                shipping_method: "testshippingmethod",
                payment_method: "testpaymentmethod",
            });
            // Clear cart and checkout data
            localStorage.removeItem('cartItems');
            localStorage.removeItem('checkoutData');
            router.visit('/order-confirmation');
        } catch (error) {
            console.error('Error creating order:', error);
        }
        setLoading(false);
    };

    const handleStripePayment = async () => {
        setLoading(true);
        const stripe = await stripePromise;
        try {
            const response = await axios.post('/create-checkout-session', {
                user_id: auth.user ? auth.user.id : null,
                items: cartItems,
                total: calculateTotal(),
                email: checkoutData.email,
                address: checkoutData.address,
                firstName: checkoutData.firstName,
                lastName: checkoutData.lastName,
                company: checkoutData.company,
                city: checkoutData.city,
                zip: checkoutData.zip,
                phone: checkoutData.phone,
                country: checkoutData.country,
                shipping_method: "testshippingmethod",
                payment_method: "testpaymentmethod",
            });
            const { sessionId } = response.data;
            const result = await stripe.redirectToCheckout({ sessionId });
            if (result.error) {
                console.error('Stripe checkout error:', result.error);
            }
        } catch (error) {
            console.error('Error creating Stripe checkout session:', error);
        }
        setLoading(false);
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <>
            <Head title="Payment" />
            <div className="container mx-auto px-4">
                <h1 className="text-2xl mb-4">Payment</h1>
                <div className="mb-4">
                    <h2 className="text-xl">Order Summary</h2>
                    {cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between">
                            <div>{item.name} x {item.quantity}</div>
                            <div>{item.price * item.quantity} CZK</div>
                        </div>
                    ))}
                    <div className="flex justify-between font-bold">
                        <div>Total</div>
                        <div>{calculateTotal()} CZK</div>
                    </div>
                </div>
                <div className="mb-4">
                    <button
                        onClick={handleCashPayment}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {loading ? 'Processing...' : 'Pay with Cash'}
                    </button>
                </div>
                <div>
                    <button
                        onClick={handleStripePayment}
                        disabled={loading}
                        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {loading ? 'Processing...' : 'Pay with Stripe'}
                    </button>
                </div>
            </div>
        </>
    );
}