import React from 'react';
import { FaInstagram, FaFacebook, FaTelegram, FaViber } from 'react-icons/fa';
import { Link } from 'react-router-dom';


function Footer() {
    return (
        <footer className="bg-[#5a0020] text-white pt-10 md:pt-20 pb-10 border-t border-white/10 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-8 mb-10 md:mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-1 flex flex-col items-center lg:items-start space-y-4 md:space-y-8">
                        <Link to="/" className="group block text-center lg:text-left">
                            <span className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                Antreme
                            </span>
                        </Link>

                        <div className="hidden md:block space-y-4 text-sm font-medium tracking-wide">
                            <div className="flex items-center gap-3 group">
                                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">✨</span>
                                <span className="group-hover:text-white transition-colors text-gray-100">Авторські торти на замовлення</span>
                            </div>
                            <div className="flex items-center gap-3 group">
                                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">📅</span>
                                <span className="group-hover:text-white transition-colors text-gray-100">Замовлення за 3+ дні</span>
                            </div>
                            <div className="pt-2 space-y-3">
                                <Link to="/gallery/photo" className="flex items-center gap-3 group/link hover:text-white transition-colors text-gray-100">
                                    <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/link:bg-white/20 transition-colors text-base">🖼️</span>
                                    <span>Фотогалерея</span>
                                </Link>
                                <Link to="/gallery/video" className="flex items-center gap-3 group/link hover:text-white transition-colors text-gray-100">
                                    <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/link:bg-white/20 transition-colors text-base">🎥</span>
                                    <span>Відеогалерея</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-4 md:mb-8 uppercase tracking-[0.2em] border-b border-white/20 pb-2 px-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Навігація
                        </h3>
                        <ul className="space-y-4 font-medium w-full">
                            <li><Link to="/" className="hover:text-amber-100 transition-all duration-300 flex items-center justify-center lg:justify-start gap-3 group text-gray-100">
                                <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">▶</span>
                                Головна
                            </Link></li>
                            <li><Link to="/cakes" className="hover:text-amber-100 transition-all duration-300 flex items-center justify-center lg:justify-start gap-3 group text-gray-100">
                                <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">▶</span>
                                Всі торти
                            </Link></li>
                            <li><Link to="/fillings" className="hover:text-amber-100 transition-all duration-300 flex items-center justify-center lg:justify-start gap-3 group text-gray-100">
                                <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">▶</span>
                                Начинки
                            </Link></li>
                            <li><Link to="/delivery" className="hover:text-amber-100 transition-all duration-300 flex items-center justify-center lg:justify-start gap-3 group text-gray-100">
                                <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">▶</span>
                                Доставка
                            </Link></li>
                            <li><Link to="/about" className="hover:text-amber-100 transition-all duration-300 flex items-center justify-center lg:justify-start gap-3 group text-gray-100">
                                <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">▶</span>
                                Про нас
                            </Link></li>
                            <li><Link to="/reviews" className="hover:text-amber-100 transition-all duration-300 flex items-center justify-center lg:justify-start gap-3 group text-gray-100">
                                <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">▶</span>
                                Відгуки
                            </Link></li>
                            <li><Link to="/blog" className="hover:text-amber-100 transition-all duration-300 flex items-center justify-center lg:justify-start gap-3 group text-gray-100">
                                <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">▶</span>
                                Блог
                            </Link></li>
                        </ul>
                    </div>

                    {/* Contacts & Map Section */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <h3 className="text-lg md:text-xl font-bold text-white mb-6 md:mb-8 uppercase tracking-[0.2em] border-b border-white/20 pb-2 w-full max-w-[200px] md:max-w-none px-4 md:px-0" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                Контакти
                            </h3>
                            <div className="space-y-6 flex flex-col items-center md:items-start">
                                <div className="group text-center md:text-left">
                                    <p className="font-bold text-amber-100 text-[10px] md:text-xs uppercase tracking-widest mb-2">Самовивіз:</p>
                                    <div className="flex flex-col items-center md:items-start gap-1">
                                        <span className="text-lg">📍</span>
                                        <p className="text-sm leading-relaxed text-gray-100 group-hover:text-white transition-colors">
                                            Харківське шосе, 180/21<br />
                                            <span className="text-[10px] text-gray-200 uppercase font-bold tracking-tighter">(Київ, м. Вирлиця)</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="group text-center md:text-left">
                                    <p className="font-bold text-amber-100 text-[10px] md:text-xs uppercase tracking-widest mb-2">Зворотний зв'язок:</p>
                                    <div className="space-y-3 flex flex-col items-center md:items-start">
                                        <a href="tel:0979081504" className="flex items-center gap-2 text-xl md:text-2xl font-bold text-white hover:text-amber-100 transition-colors justify-center md:justify-start">
                                            <span>📞</span>
                                            097 908 15 04
                                        </a>
                                        <a href="mailto:deludmila@ukr.net" className="flex items-center gap-2 hover:text-white transition-colors text-gray-100 justify-center md:justify-start">
                                            <span className="w-5 h-5 flex items-center justify-center text-xs bg-white text-[#5a0020] rounded-md shadow-sm">@</span>
                                            deludmila@ukr.net
                                        </a>
                                    </div>
                                </div>

                                <div className="flex justify-center md:justify-start space-x-4 pt-4 w-full">
                                    <a href="https://www.instagram.com/liudmilaprikhodko" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] transition-all transform hover:-translate-y-1 shadow-lg shadow-black/10 border border-white/10">
                                        <FaInstagram className="text-2xl" />
                                    </a>
                                    <a href="https://www.facebook.com/sveetdesert/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-[#1877F2] transition-all transform hover:-translate-y-1 shadow-lg shadow-black/10 border border-white/10">
                                        <FaFacebook className="text-2xl" />
                                    </a>
                                    <a href="https://t.me/antreeeme" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-[#0088cc] transition-all transform hover:-translate-y-1 shadow-lg shadow-black/10 border border-white/10">
                                        <FaTelegram className="text-2xl" />
                                    </a>
                                    <a href="viber://chat?number=%2B380979081504" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-[#7360f2] transition-all transform hover:-translate-y-1 shadow-lg shadow-black/10 border border-white/10">
                                        <FaViber className="text-2xl" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="block h-full min-h-[220px] md:min-h-[260px] lg:mt-6">
                            <div className="rounded-3xl overflow-hidden border-2 border-white/10 h-full relative group shadow-2xl shadow-black/20">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#5a0020]/30 to-transparent pointer-events-none z-10"></div>
                                <iframe
                                    title="Map location"
                                    src="https://maps.google.com/maps?q=Харківське+шосе,180/21,Київ&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1) brightness(0.9)' }}
                                    allowFullScreen=""
                                    className="group-hover:filter-none transition-all duration-700"
                                    loading="lazy">
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-[9px] md:text-[10px] uppercase tracking-widest text-white/40 font-bold">
                    <p>© 2026 Antreme. Всі права захищені.</p>
                    <div className="mt-2 md:mt-0 opacity-40 italic">
                        Зроблено з ❤️
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
