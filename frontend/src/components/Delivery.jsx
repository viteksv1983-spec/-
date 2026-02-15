import React from 'react';
import { Link } from 'react-router-dom';

function Delivery() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-[#f5efe6] to-[#fff8e7] py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="text-sm text-amber-700 mb-4 uppercase tracking-widest">Швидко та надійно</div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            ДОСТАВКА
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Доставимо ваше замовлення у вказаний час. Свіжі торти та солодощі прямо до ваших дверей!
                        </p>
                    </div>
                </div>
            </div>

            {/* Delivery Options */}
            <div className="container mx-auto px-6 py-16">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Способи доставки</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {/* Option 1 */}
                        <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                            <div className="text-5xl mb-4">🚗</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Кур'єр по місту</h3>
                            <p className="text-gray-600 mb-4">Доставка у зручний для вас час</p>
                            <div className="text-2xl font-bold text-vatsak-red">100 грн</div>
                            <p className="text-sm text-gray-500 mt-2">Безкоштовно від 500 грн</p>
                        </div>

                        {/* Option 2 */}
                        <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                            <div className="text-5xl mb-4">🏪</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Самовивіз</h3>
                            <p className="text-gray-600 mb-4">Забрати з нашої кондитерської</p>
                            <div className="text-2xl font-bold text-green-600">Безкоштовно</div>
                            <p className="text-sm text-gray-500 mt-2">вул. Хрещатик, 1</p>
                        </div>

                        {/* Option 3 */}
                        <div className="text-center p-8 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                            <div className="text-5xl mb-4">📦</div>
                            <h3 className="text-xl font-bold mb-3 text-gray-800">Нова Пошта</h3>
                            <p className="text-gray-600 mb-4">Доставка по Україні</p>
                            <div className="text-2xl font-bold text-vatsak-red">За тарифами НП</div>
                            <p className="text-sm text-gray-500 mt-2">1-3 дні</p>
                        </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="bg-[#f5efe6] rounded-lg p-8 md:p-12 mb-12">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Важлива інформація</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex gap-4">
                                <div className="text-2xl">⏰</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">Час доставки</h4>
                                    <p className="text-gray-600">Щодня з 9:00 до 21:00. Можливість обрати конкретний час при оформленні замовлення.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="text-2xl">📅</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">Термін виготовлення</h4>
                                    <p className="text-gray-600">Стандартні торти - 24 години. Авторські торти - 2-3 дні. Печенье та солодощі - в наявності.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="text-2xl">❄️</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">Температурний режим</h4>
                                    <p className="text-gray-600">Доставка в спеціальних термопакетах з холодоакумуляторами для збереження свіжості.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="text-2xl">💳</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2">Оплата</h4>
                                    <p className="text-gray-600">Готівкою кур'єру, карткою онлайн або при самовивозі. Безготівковий розрахунок для юр.осіб.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Zones */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Зони доставки по місту</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white border border-gray-200 rounded-lg">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-bold text-gray-800">Район</th>
                                        <th className="px-6 py-4 text-left font-bold text-gray-800">Вартість</th>
                                        <th className="px-6 py-4 text-left font-bold text-gray-800">Час доставки</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-800">Центр міста</td>
                                        <td className="px-6 py-4 text-vatsak-red font-bold">50 грн</td>
                                        <td className="px-6 py-4 text-gray-600">30-60 хв</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-800">Спальні райони</td>
                                        <td className="px-6 py-4 text-vatsak-red font-bold">100 грн</td>
                                        <td className="px-6 py-4 text-gray-600">1-2 години</td>
                                    </tr>
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-800">Передмістя</td>
                                        <td className="px-6 py-4 text-vatsak-red font-bold">150 грн</td>
                                        <td className="px-6 py-4 text-gray-600">2-3 години</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            * При замовленні від 500 грн - доставка безкоштовна у всі райони міста
                        </p>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-gradient-to-r from-vatsak-red to-red-700 text-white p-8 md:p-12 rounded-lg text-center">
                        <h2 className="text-3xl font-bold mb-4">Є питання щодо доставки?</h2>
                        <p className="text-lg mb-6 opacity-90">
                            Наші менеджери з радістю допоможуть вам оформити замовлення
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a href="tel:0800123456" className="flex items-center gap-2 text-xl font-bold">
                                📞 0 800 123 456
                            </a>
                            <span className="hidden sm:block">або</span>
                            <Link
                                to="/cakes"
                                className="inline-block bg-[#ffd700] text-gray-900 px-8 py-3 font-bold rounded-full hover:bg-[#ffed4e] transition-all"
                            >
                                Оформити замовлення
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Delivery;
