import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import SEOHead from './SEOHead';
import { getProductUrl } from '../utils/urls';

function Cart() {
    const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        phone: '',
        deliveryDate: '', // Added for checkout flow
        deliveryMethod: cartItems.length > 0 ? (cartItems[0].deliveryMethod || 'pickup') : 'pickup'
    });

    const handleDetailsChange = (e) => {
        const { name, value } = e.target;
        setCustomerDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        if (!customerDetails.name || !customerDetails.phone || !customerDetails.deliveryDate) {
            setError('Будь ласка, вкажіть ваше ім\'я, номер телефону та бажану дату отримання.');
            setIsCheckingOut(false);
            return;
        }

        const phoneRegex = /^(\+?380|0)\d{9}$/;
        if (!phoneRegex.test(customerDetails.phone.replace(/[\s\-\(\)]/g, ''))) {
            setError('Будь ласка, введіть коректний номер телефону (наприклад, 0501234567 або +380501234567).');
            setIsCheckingOut(false);
            return;
        }

        try {
            const firstItem = cartItems[0];
            const orderData = {
                customer_name: customerDetails.name,
                customer_phone: customerDetails.phone,
                delivery_method: customerDetails.deliveryMethod,
                delivery_date: customerDetails.deliveryDate,
                items: cartItems.map(item => ({
                    cake_id: item.id,
                    quantity: item.quantity,
                    flavor: item.flavor,
                    weight: item.weight
                }))
            };

            console.log("Submitting order:", orderData);
            const response = await api.post('/orders/', orderData);
            console.log("Order submitted successfully:", response.data);

            clearCart();
            setIsSuccess(true);
        } catch (err) {
            console.error("Checkout failed:", err);
            if (err.response) {
                console.error("Server responded with:", err.response.data);
                setError(`Помилка сервера: ${JSON.stringify(err.response.data.detail || err.response.data)}`);
            } else {
                setError('Не вдалося оформити замовлення. Будь ласка, перевірте підключення та спробуйте ще раз.');
            }
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-[#F8F3EE] flex flex-col justify-center items-center p-4 text-center">
                <SEOHead
                    title="Замовлення прийнято | Antreme Київ"
                    description="Дякуємо за замовлення в кондитерській Antreme! Ваше замовлення успішно прийнято в обробку."
                />
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
            <div className="min-h-screen bg-[#F8F3EE] flex flex-col justify-center items-center p-4 text-center">
                <SEOHead
                    title="Кошик порожній | Antreme Київ"
                    description="Ваш кошик поки що порожній. Перегляньте наш каталог і оберіть свій ідеальний торт від Antreme."
                />
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
        <div className="min-h-screen bg-[#F8F3EE] py-12 px-4 sm:px-6 lg:px-8">
            <SEOHead
                title="Оформлення замовлення | Кошик | Antreme Київ"
                description="Перевірте ваше замовлення та оформіть доставку найсмачніших десертів від кондитерської Antreme."
            />
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 uppercase tracking-wide border-b-2 border-vatsak-gold pb-4 inline-block">Кошик покупок</h1>

                {/* Error message moved down closer to the checkout button */}

                <div className="bg-white shadow-xl overflow-hidden border-t-4 border-vatsak-red">
                    <ul className="divide-y divide-gray-100">
                        {cartItems.map((item) => (
                            <li key={`${item.id}-${item.flavor}-${item.weight}`} className="p-6 sm:flex sm:items-center hover:bg-gray-50 transition-colors">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden border border-gray-200 bg-white shadow-sm rounded-xl">
                                    <Link to={getProductUrl(item)} state={{ fromCategory: item.category }} className="hover:opacity-80 transition-opacity block h-full w-full">
                                        {item.image_url && (
                                            <img
                                                src={item.image_url.startsWith('http') ? item.image_url : `${api.defaults.baseURL}${item.image_url}`}
                                                alt={item.name}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        )}
                                    </Link>
                                </div>

                                <div className="ml-4 flex-1 flex flex-col sm:ml-6">
                                    <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <div>
                                                <Link to={getProductUrl(item)} state={{ fromCategory: item.category }} className="hover:text-vatsak-red transition-colors inline-block text-gray-900">
                                                    <h3 className="uppercase tracking-wide font-bold text-lg">{item.name}</h3>
                                                </Link>
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
                                            <button onClick={() => updateQuantity(item.id, item.flavor, item.weight, item.deliveryDate, item.deliveryMethod, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold text-lg transition-colors">-</button>
                                            <span className="w-12 h-10 flex items-center justify-center font-bold text-gray-900 border-x border-gray-200 bg-gray-50/50">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.flavor, item.weight, item.deliveryDate, item.deliveryMethod, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold text-lg transition-colors">+</button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.id, item.flavor, item.weight, item.deliveryDate, item.deliveryMethod)}
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
                        <p className="mt-0.5 text-sm text-gray-500 mb-6">Доставка оплачується окремо за тарифами служби таксі.</p>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Ваше Ім'я</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={customerDetails.name}
                                    onChange={handleDetailsChange}
                                    placeholder="Введіть ваше ім'я"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-vatsak-red focus:border-transparent transition-all outline-none text-gray-900 font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Ваш Телефон</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={customerDetails.phone}
                                    onChange={handleDetailsChange}
                                    placeholder="+380..."
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-vatsak-red focus:border-transparent transition-all outline-none text-gray-900 font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Дата отримання</label>
                                <input
                                    type="date"
                                    name="deliveryDate"
                                    value={customerDetails.deliveryDate}
                                    onChange={handleDetailsChange}
                                    onClick={(e) => e.target.showPicker()}
                                    min={new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]} // Min 2 days from now
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-vatsak-red focus:border-transparent transition-all outline-none text-gray-900 font-medium cursor-pointer"
                                />
                                <p className="text-[10px] text-gray-400 mt-1 italic">* Мінімальний термін замовлення — 2-3 дні</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Спосіб отримання</label>
                                <div className="relative">
                                    <select
                                        name="deliveryMethod"
                                        value={customerDetails.deliveryMethod}
                                        onChange={handleDetailsChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-vatsak-red focus:border-transparent transition-all outline-none text-gray-900 font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="pickup">🏪 Самовивіз</option>
                                        <option value="uklon">🚕 Доставка Uklon</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Error message moved here, right above the button */}
                        {error && (
                            <div className="bg-red-50 border-2 border-vatsak-red rounded-xl p-4 mb-6 text-center animate-pulse">
                                <p className="text-red-700 font-bold">{error}</p>
                            </div>
                        )}

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
