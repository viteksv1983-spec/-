import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import SEOHead from './SEOHead';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await api.post('/users/', { email, password });
            setIsRegistered(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError('Реєстрація не вдалася. Можливо, email вже зайнятий або виникла технічна помилка.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isRegistered) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
                <SEOHead
                    title="Успішна реєстрація | Antreme"
                    description="Дякуємо за реєстрацію в кондитерській Antreme! Тепер ви можете замовляти торти ще швидше."
                />
                <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-xl border-t-4 border-green-500 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-gray-900">Реєстрація успішна!</h2>
                    <p className="mt-4 text-gray-600">Ваш акаунт створено. Ви будете автоматично перенаправлені на сторінку входу через кілька секунд...</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-6 text-antreme-red font-bold hover:underline"
                    >
                        Перейти до входу зараз
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
            <SEOHead
                title="Реєстрація | Створити акаунт Antreme"
                description="Зареєструйтесь у нашій кондитерській, щоб отримувати ексклюзивні знижки на торти, відстежувати замовлення та прискорити оформлення покупок."
            />
            <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-2xl border-t-4 border-antreme-red relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-antreme-gold opacity-10 rounded-full blur-2xl"></div>
                <div>
                    <h2 className="mt-6 text-center text-4xl font-serif font-bold text-gray-900 tracking-tight">
                        Реєстрація
                    </h2>
                    <p className="mt-3 text-center text-sm text-gray-500 font-medium uppercase tracking-widest">
                        Магазин Вацак
                    </p>
                </div>
                {error && (
                    <div className="bg-red-50 border-l-4 border-antreme-red p-4 mb-4 animate-pulse" role="alert">
                        <p className="text-sm text-red-700 font-bold">{error}</p>
                    </div>
                )}
                <form className="mt-8 space-y-7" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div className="relative group">
                            <label htmlFor="email-address" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 transition-colors group-focus-within:text-antreme-gold">Електронна пошта</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-antreme-gold transition-all sm:text-sm"
                                placeholder="example@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative group">
                            <label htmlFor="password" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 transition-colors group-focus-within:text-antreme-gold">Пароль</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none block w-full px-4 py-3 border-b-2 border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:border-antreme-gold transition-all sm:text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black uppercase tracking-widest text-white bg-antreme-red hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-antreme-red transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Створити акаунт'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
