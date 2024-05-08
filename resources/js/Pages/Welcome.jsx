import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Head } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';

export default function Welcome({ auth, laravelVersion, phpVersion, canLogin, canRegister }) {
    const [categories, setCategories] = useState([]); 
    const [cartItems, setCartItems] = useState([]);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    useEffect(() => {
        axios.get('/categories')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });

        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
    }, []);

    const handleAddToCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity += 1;
                setCartItems([...cartItems]);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            }
        } else {
            if (product.stock > 0) {
                cartItems.push({ ...product, quantity: 1 });
                setCartItems([...cartItems]);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            }
        }
    };

    const handleRemoveFromCart = (product) => {
        const existingItem = cartItems.find(item => item.id === product.id);
        if (existingItem.quantity > 1) {
            existingItem.quantity -= 1;
        } else {
            const index = cartItems.indexOf(existingItem);
            cartItems.splice(index, 1);
        }
        setCartItems([...cartItems]);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    };

    return (
        <>
            <Head title="Welcome to Kombucha Shop" />
            <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
            {auth.user ? (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                            </div>

                            {/* Show this only if the user is an admin */}
                            {auth.user.role === 'admin' && (
                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('admin.index')} active={route().current('admin.index')}>
                                    Admin Dashboard
                                </NavLink>
                                </div>
                            )}
                        </div>

                    <div className="hidden sm:flex sm:items-center sm:ms-6">
                        <div className="ms-3 relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                        >
                                            {auth.user.name}

                                            <svg
                                                className="ms-2 -me-0.5 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    <div className="-me-2 flex items-center sm:hidden">
                        <button
                            onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                        >
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path
                                    className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
                        ) : (
                            <>
                                <Link href={route('login')} className="text-sm text-gray-700 underline">
                                    Log in
                                </Link>
                                <Link href={route('register')} className="ml-4 text-sm text-gray-700 underline">
                                    Register
                                </Link>
                            </>
                        )}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <Link href={route('cart')} className="ml-4 text-sm text-gray-700 underline">
                            Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                        </Link>
                    </div>
                </div>
                {categories.map(category => (
                    <div key={category.id} className="mb-8">
                        <h2 className="text-xl font-bold mb-4">{category.name}</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {category.products
                                .filter(product => product.stock > 0)
                                .map(product => {
                                    const cartProduct = cartItems.find(item => item.id === product.id);
                                    return (
                                        <div key={product.id} className="card">
                                            <Link href={route('product', product.id)}>
                                                <img src={`/storage/${product.image}`} alt={product.name} className="h-96" />
                                            </Link>
                                            <div className="p-2">
                                                <h5 className="text-lg">{product.name}</h5>
                                                <p>{Number(product.price).toFixed(0)} Kč</p>
                                                <p className="text-sm">Stock: {product.stock}</p>
                                                {cartProduct ? (
                                                    <div className="flex items-center">
                                                        <button
                                                            className="hover:bg-red-700 text-white font-bold py-1 px-2 rounded bg-gray-500 rounded-1xl"
                                                            onClick={() => handleRemoveFromCart(product)}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="mx-2">{cartProduct.quantity}</span>
                                                        <button
                                                            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ${cartProduct.quantity >= product.stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            onClick={() => handleAddToCart(product)}
                                                            disabled={cartProduct.quantity >= product.stock}
                                                        >
                                                            +
                                                        </button>
                                                        {cartProduct.quantity >= product.stock && (
                                                            <p className="text-red-500 ml-2">Out of stock</p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}