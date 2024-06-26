import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Head } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from '@/Components/NavLink';
import '../../css/welcomePage.css'; 

export default function Welcome({ auth, laravelVersion, phpVersion, canLogin, canRegister }) {
    const [categories, setCategories] = useState([]); 
    const [cartItems, setCartItems] = useState([]);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [isActive, setIsActive] = useState(false);

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


    const handleToggle = () => {
        setIsActive(!isActive);
    };

    return (
        <>
            <Head title="Welcome" />
            <div className={`menu_section ${isActive ? 'hidden' : ''}`}>
                <div className="menuDiv">
                    <NavLink href={route('dashboard')} active={route().current('dashboard')}>Přehled</NavLink>
                    {auth.user?.role === 'admin' && (
                        <NavLink href={route('admin.index')} active={route().current('admin.index')}>Administrátorský přehled</NavLink>
                    )}
                    <NavLink href={route('profile.edit')}>Profil</NavLink>
                    <NavLink href={route('logout')} method="post" as="button">Odhlásit se</NavLink>
                </div>
            </div>
            <div className="welcome-container">
                <div className="header">
                    <div className="header-content">
                        {auth.user ? (
                            <div className="auth-user-container">
                                <div className="auth-user-content">
                                    <div className="auth-user-logo">
                                        <Link href="/">
                                            <ApplicationLogo className="logo" />
                                        </Link>
                                    </div>
                                    <div className="nav-links">
                                        <NavLink href={route('dashboard')} active={route().current('dashboard')}>Přehled</NavLink>
                                        {auth.user.role === 'admin' && (
                                            <NavLink href={route('admin.index')} active={route().current('admin.index')}>Administrátorský přehled</NavLink>
                                        )}
                                    </div>
                                </div>
                                <div className="right-container">
                                    <div className="auth-user-dropdown">
                                        <div className="dropdown-container">
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <span className="dropdown-trigger">
                                                        <button type="button" className="dropdown-button">
                                                            {auth.user.name}
                                                            <svg className="dropdown-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </span>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content>
                                                    <Dropdown.Link href={route('profile.edit')}>Profil</Dropdown.Link>
                                                    <Dropdown.Link href={route('logout')} method="post" as="button">Odhlásit se</Dropdown.Link>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <Link href={route('cart')} className="cart-link">
                                        <span className="cart-icon"></span>
                                        Košík (<span className="cart-count">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>)
                                    </Link>
                                    <div id="menu-toggle" onClick={handleToggle}>
                                        <div id="menu-icon" className={isActive ? 'active' : ''}>
                                            <div className="bar"></div>
                                            <div className="bar bar2"></div>
                                            <div className="bar"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="guest-header">
                                    <div className="auth-user-logo">
                                        <Link href="/">
                                            <ApplicationLogo className="logo" />
                                        </Link>
                                    </div>
                                    <div className="right-container">
                                        <Link href={route('login')} className="login-link">Přihlásit se</Link>
                                        <Link href={route('register')} className="register-link">Registrovat</Link>
                                        <Link href={route('cart')} className="cart-link">
                                            <span className="cart-icon"></span>
                                            Košík (<span className="cart-count">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>)
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {categories.map(category => (
                    <div key={category.id} className="welcome-category">
                        <h2 className="welcome-category-title">{category.name}</h2>
                        <div className="welcome-product-grid">
                            {category.products.filter(product => product.stock > 0).map(product => {
                                const cartProduct = cartItems.find(item => item.id === product.id);
                                return (
                                    <div key={product.id} className="welcome-card">
                                        <Link href={route('product', product.id)}>
                                            <img src={`/storage/${product.image}`} alt={product.name} className="welcome-product-image" />
                                        </Link>
                                        <div className="card-content">
                                            <h5 className="welcome-product-name">{product.name}</h5>
                                            <p className="welcome-product-price">{Number(product.price).toFixed(0)} Kč</p>
                                            <p className="welcome-product-stock">Skladem: {product.stock} ks</p>
                                            {cartProduct ? (
                                                <div className="welcome-cart-controls">
                                                    <button className="welcome-cart-button welcome-cart-remove-button" onClick={() => handleRemoveFromCart(product)}>-</button>
                                                    <span className="welcome-cart-quantity">{cartProduct.quantity}</span>
                                                    <button className={`welcome-cart-button welcome-cart-add-button ${cartProduct.quantity >= product.stock ? 'disabled' : ''}`} onClick={() => handleAddToCart(product)} disabled={cartProduct.quantity >= product.stock}>+</button>
                                                    {cartProduct.quantity >= product.stock && <p className="welcome-out-of-stock">Víc není skladem</p>}
                                                </div>
                                            ) : (
                                                <button className="welcome-add-to-cart-button" onClick={() => handleAddToCart(product)}>Přidat do košíku</button>
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
