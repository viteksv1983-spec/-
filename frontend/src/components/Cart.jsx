import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) return;

        setIsCheckingOut(true);
        setError('');

        try {
            const orderData = {
                items: cartItems.map(item => ({
                    cake_id: item.id,
                    quantity: item.quantity,
                    flavor: item.flavor
                }))
            };

            await api.post('/orders/', orderData);

            clearCart();
            setIsSuccess(true);
            // Redirection logic can be handled or just show the success state.
        } catch (err) {
            console.error("Checkout failed", err);
            setError('Не вдалося оформити замовлення. Будь ласка, перевірте підключення та спробуйте ще раз.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4 text-center">
                <div className="bg-green-100 p-8 rounded-full shadow-lg mb-6 animate-bounce">
                    <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2 font-serif uppercase tracking-widest">Дякуємо за замовлення!</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">Ваше замовлення успішно прийнято в обробку. Наш менеджер зв'яжеться з вами найближчим часом для уточнення деталей доставки.</p>
                <div className="flex gap-4">
                    <Link to="/" className="bg-vatsak-red text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Продовжити покупки
                    </Link>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 text-center">
                <div className="bg-white p-8 rounded-full shadow-lg mb-6">
                    <svg className="w-16 h-16 text-vatsak-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2 font-serif uppercase tracking-wider">Ваш Кошик Порожній</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Схоже, ви ще не зробили свій вибір. Перегляньте наш каталог, щоб знайти найсмачніші торти.</p>
                <Link to="/" className="bg-vatsak-red text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-red-900 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Перейти до каталогу
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 uppercase tracking-wide border-b-2 border-vatsak-gold pb-4 inline-block">Кошик покупок</h1>

                {error && (
                    <div className="bg-red-50 border-l-4 border-vatsak-red p-4 mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                <div className="bg-white shadow-xl overflow-hidden border-t-4 border-vatsak-red">
                    <ul className="divide-y divide-gray-100">
                        {cartItems.map((item) => (
                            <li key={`${item.id}-${item.flavor}`} className="p-6 sm:flex sm:items-center hover:bg-gray-50 transition-colors">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden border border-gray-200 bg-white shadow-sm rounded-xl">
                                    {item.image_url && (
                                        <img
                                            src={item.image_url.startsWith('http') ? item.image_url : `http://localhost:8000${item.image_url}`}
                                            alt={item.name}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    )}
                                </div>

                                <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                                    <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <div>
                                                <h3 className="uppercase tracking-wide font-bold text-lg">{item.name}</h3>
                                                {item.flavor && (
                                                    <p className="text-sm text-vatsak-red font-bold mt-1 uppercase tracking-wider flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-vatsak-red rounded-full"></span>
                                                        Начинка: {item.flavor}
                                                    </p>
                                                )}
                                                {item.weight && (
                                                    <p className="text-sm text-gray-500 font-bold mt-1 uppercase tracking-wider flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                                        Вага: {item.weight} кг
                                                    </p>
                                                )}
                                            </div>
                                            <p className="ml-4 text-vatsak-red font-bold text-xl">{item.price * item.quantity} <span className="text-sm text-gray-500 font-normal">грн</span></p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">{item.price} грн / шт</p>
                                    </div>
                                    <div className="flex-1 flex items-end justify-between text-sm mt-4">
                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                            <button onClick={() => updateQuantity(item.id, item.flavor, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold text-lg transition-colors">-</button>
                                            <span className="w-12 h-10 flex items-center justify-center font-bold text-gray-900 border-x border-gray-200 bg-gray-50/50">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.flavor, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold text-lg transition-colors">+</button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.id, item.flavor)}
                                            className="font-bold text-gray-400 hover:text-vatsak-red transition-colors uppercase tracking-widest text-[10px] flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            Видалити
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t-2 border-gray-100 p-8 bg-gray-50">
                        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                            <p className="uppercase tracking-wide font-bold text-lg">Підсумок</p>
                            <p className="text-3xl font-bold text-vatsak-red">{cartTotal.toFixed(2)} <span className="text-lg text-gray-500 font-normal">грн</span></p>
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500 mb-8">Доставка та податки розраховуються при оформленні замовлення.</p>
                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className={`w-full flex justify-center items-center bg-vatsak-red border border-transparent py-4 px-4 text-lg font-bold uppercase tracking-widest text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-vatsak-red transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isCheckingOut ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isCheckingOut ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Обробка замовлення...
                                </>
                            ) : (
                                'Оформити замовлення'
                            )}
                        </button>
                        <div className="mt-8 flex justify-center text-center text-sm text-gray-500">
                            <p>
                                або{' '}
                                <Link to="/" className="font-medium text-vatsak-red hover:text-red-800 uppercase tracking-wide ml-1">
                                    Продовжити покупки<span aria-hidden="true"> &rarr;</span>
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
