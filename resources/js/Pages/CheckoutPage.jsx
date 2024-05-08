import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';

export default function CheckoutPage() {
    const defaultFormData = {
        email: '',
        country: 'CZ',
        firstName: '',
        lastName: '',
        company: '',
        address: '',
        city: '',
        zip: '',
        phone: ''
    };

    const [cartItems, setCartItems] = useState([]);
    const [formData, setFormData] = useState(defaultFormData);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const storedFormData = JSON.parse(localStorage.getItem('checkoutData'));
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(items);
        if (storedFormData) {
            setFormData(storedFormData);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear errors on input change
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        // Required fields
        ['email', 'firstName', 'lastName', 'address', 'city', 'zip', 'phone'].forEach(field => {
            if (!formData[field]) {
                newErrors[field] = 'This field is required';
            }
        });
        // Email format
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid';
        }
        // Phone number must be numbers only
        if (formData.phone && !/^\d+$/.test(formData.phone)) {
            newErrors.phone = 'Phone number must be numeric';
        }
        // ZIP code checks
        if (formData.zip && (!/^\d{5}$/.test(formData.zip))) {
            newErrors.zip = 'ZIP code must be exactly 5 digits';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            console.log("ddsawad", validationErrors)

            setErrors(validationErrors);
            return;
        }
        console.log("dwad")
        localStorage.setItem('checkoutData', JSON.stringify(formData));
        router.visit('/payment'); // Navigate to payment page
    };

    return (
        <>
            <Head title="Checkout" />
            <div className="container mx-auto px-4">
                <h1 className="text-2xl mb-4">Checkout</h1>
                <div className="flex flex-wrap md:flex-nowrap">
                    <div className="w-full md:w-2/3 p-5">
                        {cartItems.map((item, index) => (
                            <div key={index} className="mb-4 flex items-center">
                                <img src={item.image} alt={item.name} className="w-20 h-20 mr-4" />
                                <div>
                                    <h5 className="text-lg font-semibold">{item.name}</h5>
                                    <p>{item.quantity} x {item.price} CZK</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="w-full md:w-1/3 p-5 bg-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Example for email input field with error display */}
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="E-mail"
                                className={`w-full px-4 py-2 border rounded-md ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                            {/* Additional form fields as shown above, similar setup with error handling */}
                            {/* Example for select input field */}
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-md"
                            >
                                <option value="CZ">Czech Republic</option>
                                <option value="SK">Slovakia</option>
                                <option value="DE">Germany</option>
                                <option value="PL">Poland</option>
                            </select>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className={`w-full px-4 py-2 border rounded-md ${errors.firstName ? 'border-red-500' : ''}`}
                            />
                            {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName}</p>}
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className={`w-full px-4 py-2 border rounded-md ${errors.firstName ? 'border-red-500' : ''}`}
                            />
                            {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName}</p>}
                            <input
                             type="text"
                             name="company"
                             value={formData.company}
                             onChange={handleChange}
                             placeholder="Company (Optional)"
                             className="w-full px-4 py-2 border rounded-md"
                         />
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Address"
                                className={`w-full px-4 py-2 border rounded-md ${errors.firstName ? 'border-red-500' : ''}`}
                            />
                            {errors.address && <p className="text-red-500 text-xs italic">{errors.address}</p>}
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="City"
                                className={`w-full px-4 py-2 border rounded-md ${errors.firstName ? 'border-red-500' : ''}`}
                            />
                            {errors.city && <p className="text-red-500 text-xs italic">{errors.city}</p>}
                            <input
                                type="text"
                                name="zip"
                                value={formData.zip}
                                onChange={handleChange}
                                placeholder="ZIP Code"
                                className={`w-full px-4 py-2 border rounded-md ${errors.firstName ? 'border-red-500' : ''}`}
                            />
                            {errors.zip && <p className="text-red-500 text-xs italic">{errors.zip}</p>}
                            <input
                                type="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone"
                                className={`w-full px-4 py-2 border rounded-md ${errors.firstName ? 'border-red-500' : ''}`}
                            />     
                            {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Proceed to Payment
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
