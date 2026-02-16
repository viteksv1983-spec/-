import React, { useState } from 'react';
import api from '../api';

const QuickOrderModal = ({ cake, isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await api.post('/orders/quick', {
                customer_name: name,
                customer_phone: phone,
                cake_id: cake.id,
                quantity: 1, // Default to 1 for quick order
                flavor: null, // Could be extended to pass selected flavor if available
                weight: null
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
            setMessage('Сталася помилка. Спробуйте ще раз.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-xl"
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Замовлення в 1 клік</h2>
                <p className="text-sm text-gray-600 mb-4 text-center">
                    Залиште свої контакти і ми зателефонуємо вам для уточнення деталей замовлення: <span className="font-semibold">{cake.name}</span>
                </p>

                {message ? (
                    <div className={`text-center p-3 rounded mb-4 ${message.includes('помилка') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Ім'я
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                type="text"
                                placeholder="Ваше ім'я"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                                Телефон
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="phone"
                                type="tel"
                                placeholder="+380..."
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Відправка...' : 'Замовити'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default QuickOrderModal;
