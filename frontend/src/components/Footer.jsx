import React from 'react';
import { FaInstagram, FaFacebook, FaTelegram } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Footer() {
    return (
        <footer className="bg-[#2e0b12] text-gray-300 pt-16 pb-8 border-t-4 border-vatsak-gold">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-sm">

                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link to="/" className="inline-block group">
                            <img src={logo} alt="ANTREME" className="h-32 w-auto object-contain mb-4 opacity-90 group-hover:opacity-100 transition-opacity" />
                        </Link>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <span className="text-xl">🍰</span>
                                <span>Авторські торти на замовлення</span>
                            </div>

                            <div className="flex items-center space-x-3">
                                <span className="text-xl">🗓️</span>
                                <span>Замовлення за 3+ дні</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="md:pl-10">
                        <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider border-b border-vatsak-gold/30 pb-2 inline-block">
                            Навігація
                        </h3>
                        <ul className="space-y-3 font-medium">
                            <li><Link to="/" className="hover:text-vatsak-gold transition-colors flex items-center gap-2"><span>🏠</span> Головна</Link></li>
                            <li><Link to="/cakes" className="hover:text-vatsak-gold transition-colors flex items-center gap-2"><span>🎂</span> Всі торти</Link></li>
                            <li><Link to="/fillings" className="hover:text-vatsak-gold transition-colors flex items-center gap-2"><span>🍰</span> Начинки</Link></li>
                            <li><Link to="/promotions" className="hover:text-vatsak-gold transition-colors flex items-center gap-2"><span>🏷️</span> Акції</Link></li>
                            <li><Link to="/delivery" className="hover:text-vatsak-gold transition-colors flex items-center gap-2"><span>🚚</span> Доставка</Link></li>
                        </ul>
                    </div>

                    {/* Contacts & Social */}
                    <div>
                        <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider border-b border-vatsak-gold/30 pb-2 inline-block">
                            Контакти
                        </h3>
                        <div className="space-y-4 mb-6">
                            <div className="flex items-start space-x-3">
                                <span className="text-xl mt-1">📍</span>
                                <div>
                                    <p className="font-bold text-white text-base mb-1">Самовивіз:</p>
                                    <p>Харківське шосе, 180/21</p>
                                    <p className="text-gray-400 text-xs mt-1">(Київ, м. Вирлиця)</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-xl text-green-500">📞</span>
                                <a href="tel:0979081504" className="text-xl font-bold text-white hover:text-vatsak-gold transition-colors">
                                    097 908 15 04
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-vatsak-red">✉️</span>
                                <a href="mailto:deludmila@ukr.net" className="hover:text-white transition-colors">deludmila@ukr.net</a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-xl">📅</span>
                                <span>Пн - Нд: <span className="text-white">9:00 - 20:00</span></span>
                            </div>
                        </div>

                        <div className="flex space-x-4">
                            <a href="https://www.instagram.com/liudmilaprikhodko" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white hover:text-vatsak-gold transition-all">
                                <FaInstagram className="text-xl" />
                            </a>
                            <a href="https://www.facebook.com/sveetdesert/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white hover:text-blue-500 transition-all">
                                <FaFacebook className="text-xl" />
                            </a>
                            <a href="https://t.me/antreeeme" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white hover:text-sky-500 transition-all">
                                <FaTelegram className="text-xl" />
                            </a>
                        </div>

                        {/* Map moved here */}
                        <div className="mt-6 rounded-lg overflow-hidden border border-white/20 h-40 w-full">
                            <iframe
                                title="Map location"
                                src="https://maps.google.com/maps?q=Харківське+шосе,180/21,Київ&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy">
                            </iframe>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>© 2026 Antreme. Всі права захищені.</p>
                    <p className="mt-2 md:mt-0 opacity-70">Зроблено з ❤️ до солодощів</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
