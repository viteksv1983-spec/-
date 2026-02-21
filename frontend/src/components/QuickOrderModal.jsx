import React, { useState } from 'react';
import api from '../api';

const QuickOrderModal = ({
    cake,
    isOpen,
    onClose,
    deliveryDate,
    deliveryMethod,
    flavor,
    weight
}) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    if (!isOpen || !cake) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const phoneRegex = /^(\+?380|0)\d{9}$/;
        if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
            setMessage('Будь ласка, введіть коректний номер телефону (наприклад, +380501234567 або 0501234567).');
            setLoading(false);
            return;
        }

        try {
            await api.post('/orders/quick', {
                customer_name: name,
                customer_phone: phone,
                cake_id: cake.id,
                quantity: 1,
                flavor: flavor || null,
                weight: weight || null,
                delivery_method: deliveryMethod || 'pickup',
                delivery_date: deliveryDate || null
            });
            setMessage('Замовлення прийнято! Ми зв\'яжемося з вами найближчим часом.');
            setTimeout(() => {
                onClose();
                setName('');
                setPhone('');
                setMessage('');
            }, 3000);
        } catch (error) {
            console.error("Error creating quick order:", error);
            const errorMsg = error.response?.data?.detail
                ? (typeof error.response.data.detail === 'string' ? error.response.data.detail : JSON.stringify(error.response.data.detail))
                : 'Сталася помилка. Перевірте з\'єднання та спробуйте ще раз.';
            setMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 relative transform animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-xl h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                    &times;
                </button>
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-[#F6E7D6] rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-[#D39A5E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Швидке замовлення</h2>
                    <p className="text-xs text-gray-500 mt-2">
                        Залиште свої контакти і ми зателефонуємо вам для підтвердження: <br />
                        <span className="font-bold text-gray-700">{cake?.name}</span>
                    </p>
                    {(deliveryDate || flavor || weight) && (
                        <div className="mt-3 flex flex-wrap justify-center gap-1">
                            {deliveryDate && <span className="text-[9px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100">📅 {deliveryDate}</span>}
                            {deliveryMethod === 'uklon' && <span className="text-[9px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">🚕 Доставка</span>}
                            {flavor && <span className="text-[9px] bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100">🍰 {flavor}</span>}
                            {weight && <span className="text-[9px] bg-gray-50 text-gray-700 px-2 py-0.5 rounded border border-gray-200">⚖️ {weight} кг</span>}
                        </div>
                    )}
                </div>

                {message ? (
                    <div className={`text-center p-4 rounded-xl mb-4 text-sm font-medium ${message.includes('помилка') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                        {message}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-[10px] font-bold uppercase tracking-widest mb-1.5" htmlFor="name">
                                Ваше Ім'я
                            </label>
                            <input
                                className="w-full bg-[#f8f9fa] border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D39A5E]/20 focus:border-[#D39A5E] transition-all"
                                id="name"
                                type="text"
                                placeholder="Олександр"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-[10px] font-bold uppercase tracking-widest mb-1.5" htmlFor="phone">
                                Номер телефону
                            </label>
                            <input
                                className="w-full bg-[#f8f9fa] border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D39A5E]/20 focus:border-[#D39A5E] transition-all"
                                id="phone"
                                type="tel"
                                placeholder="+38 (___) ___ __ __"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            className={`w-full bg-[#D39A5E] hover:bg-[#b07d48] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#D39A5E]/20 transition-all active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Оформлення...
                                </>
                            ) : 'Підтвердити замовлення'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default QuickOrderModal;
