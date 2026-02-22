import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';

function Promotions() {
    return (
        <div className="min-h-screen bg-white">
            <SEOHead
                title="Акції та знижки на торти | Antreme Київ"
                description="Спеціальні пропозиції, знижки до дня народження, акції на перше замовлення та безкоштовна доставка тортів від кондитерської Antreme."
            />

            {/* Current Promotions */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {/* Promotion 1 */}
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <div className="p-8">
                            <div className="inline-block bg-vatsak-red text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                                -20%
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Знижка на день народження</h3>
                            <p className="text-gray-600 mb-6">
                                Святкуєте день народження? Отримайте знижку 20% на будь-який торт при замовленні за 3 дні до свята.
                            </p>
                            <div className="border-t border-gray-200 pt-4">
                                <p className="text-sm text-gray-500">Діє до: 31.03.2026</p>
                            </div>
                        </div>
                    </div>

                    {/* Promotion 2 */}
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <div className="p-8">
                            <div className="inline-block bg-[#ffd700] text-gray-900 px-4 py-2 rounded-full text-sm font-bold mb-4">
                                2+1
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Печенье за акцією</h3>
                            <p className="text-gray-600 mb-6">
                                Купуйте 2 упаковки печенья та отримуйте третю в подарунок! Акція діє на весь асортимент печенья.
                            </p>
                            <div className="border-t border-gray-200 pt-4">
                                <p className="text-sm text-gray-500">Діє до: 28.02.2026</p>
                            </div>
                        </div>
                    </div>

                    {/* Promotion 3 */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <div className="p-8">
                            <div className="inline-block bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                                -15%
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Перше замовлення</h3>
                            <p className="text-gray-600 mb-6">
                                Новим клієнтам знижка 15% на перше замовлення! Зареєструйтеся на сайті та отримайте промокод на email.
                            </p>
                            <div className="border-t border-gray-200 pt-4">
                                <p className="text-sm text-gray-500">Постійна акція</p>
                            </div>
                        </div>
                    </div>

                    {/* Promotion 4 */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <div className="p-8">
                            <div className="inline-block bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                                Безкоштовно
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Доставка у подарунок</h3>
                            <p className="text-gray-600 mb-6">
                                При замовленні від 500 грн - безкоштовна доставка по місту! Смакуйте наші солодощі без додаткових витрат.
                            </p>
                            <div className="border-t border-gray-200 pt-4">
                                <p className="text-sm text-gray-500">Постійна акція</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="max-w-4xl mx-auto mt-16 text-center bg-gradient-to-r from-vatsak-red to-red-700 text-white p-12 rounded-lg">
                    <h2 className="text-3xl font-bold mb-4">Хочете дізнатися про нові акції?</h2>
                    <p className="text-lg mb-6 opacity-90">
                        Підпишіться на нашу розсилку та першими дізнавайтеся про спеціальні пропозиції та знижки!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Ваш email"
                            className="px-6 py-3 rounded-full text-gray-800 flex-1 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button className="px-8 py-3 bg-[#ffd700] text-gray-900 font-bold rounded-full hover:bg-[#ffed4e] transition-all">
                            Підписатися
                        </button>
                    </div>
                </div>

                {/* Browse Products CTA */}
                <div className="text-center mt-12">
                    <Link
                        to="/cakes"
                        className="inline-block bg-gray-800 text-white px-8 py-4 font-bold uppercase text-sm tracking-wider hover:bg-gray-900 transition-all"
                    >
                        Переглянути всі продукти
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Promotions;
