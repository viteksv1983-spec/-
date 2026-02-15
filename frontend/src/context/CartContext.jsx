import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error("Failed to parse cart from local storage", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (cake, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === cake.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === cake.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                return [...prevItems, { ...cake, quantity }];
            }
        });
    };

    const removeFromCart = (cakeId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== cakeId));
    };

    const updateQuantity = (cakeId, quantity) => {
        if (quantity < 1) return;
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === cakeId ? { ...item, quantity: quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
