import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="inline-block">
                            <h2 className="text-3xl font-bold text-white tracking-tighter" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                ІННА <span className="text-vatsak-red">ТОРТИКИ</span>
                            </h2>
                        </Link>
                        <p className="text-sm leading-relaxed opacity-80">
                            Ми створюємо кондитерські шедеври з любов'ю. Наша місія — дарувати солодкі моменти щастя кожному клієнту, використовуючи лише найкращі натуральні інгредієнти.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-vatsak-red hover:text-white transition-all transform hover:scale-110">
                                <span className="text-xl">📸</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110">
                                <span className="text-xl">👤</span>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all transform hover:scale-110">
                                <span className="text-xl">✈️</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Розділи сайту
                        </h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/cakes" className="hover:text-vatsak-red transition-colors">Всі продукти</Link></li>
                            <li><Link to="/cakes?category=cakes" className="hover:text-vatsak-red transition-colors">Торти</Link></li>
                            <li><Link to="/cakes?category=cookies" className="hover:text-vatsak-red transition-colors">Печиво</Link></li>
                            <li><Link to="/cakes?category=sweets" className="hover:text-vatsak-red transition-colors">Солодощі</Link></li>
                            <li><Link to="/promotions" className="hover:text-vatsak-red transition-colors">Акції та знижки</Link></li>
                            <li><Link to="/delivery" className="hover:text-vatsak-red transition-colors">Доставка та оплата</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Контакти
                        </h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start space-x-3">
                                <span className="text-vatsak-red">📍</span>
                                <span>вул. Хрещатик, 1,<br />м. Київ, 01001</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <span className="text-vatsak-red">📞</span>
                                <a href="tel:0800123456" className="hover:text-white transition-colors">0 800 123 456</a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <span className="text-vatsak-red">✉️</span>
                                <a href="mailto:info@vatsak.ua" className="hover:text-white transition-colors">info@vatsak.ua</a>
                            </li>
                        </ul>
                    </div>

                    {/* Working Hours & Newsletter */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Графік роботи
                        </h3>
                        <div className="space-y-4 text-sm mb-8">
                            <div className="flex justify-between border-b border-gray-800 pb-2">
                                <span>Пн - Пт:</span>
                                <span className="text-white">09:00 - 20:00</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-200/10 pb-2">
                                <span>Сб - Нд:</span>
                                <span className="text-white">10:00 - 18:00</span>
                            </div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <p className="text-xs mb-3 text-gray-400">Отримуйте новини про акції:</p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Ваш Email"
                                    className="bg-gray-700 text-white px-3 py-2 text-xs rounded-l focus:outline-none focus:ring-1 focus:ring-vatsak-red w-full"
                                />
                                <button className="bg-vatsak-red hover:bg-red-700 text-white px-4 py-2 text-xs font-bold rounded-r transition-colors">
                                    ОК
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-60">
                    <p>© 2026 Кондитерська Інни. Всі права захищені.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Політика конфіденційності</a>
                        <a href="#" className="hover:text-white transition-colors">Угода користувача</a>
                        <a href="#" className="hover:text-white transition-colors">Карта сайту</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
