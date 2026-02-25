import React from 'react';
import { FaInstagram, FaFacebook, FaTelegram, FaViber } from 'react-icons/fa';
import { Link } from 'react-router-dom';


function Footer() {
    return (
        <footer className="bg-gradient-to-b from-[#5E0C1B] to-[#430612] text-[#F8E9D8] pt-8 md:pt-20 pb-0 border-t border-white/5 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 mb-4 md:mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-1 flex flex-col items-center lg:items-start space-y-2 md:space-y-8">
                        <Link to="/" className="group block text-center lg:text-left">
                            <span className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] group-hover:text-[#F5C24D] transition-all duration-500 block" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                ANTREME
                            </span>
                        </Link>

                        <div className="hidden md:block space-y-6 pt-4 text-sm font-bold tracking-wider">
                            <div className="flex items-center gap-4 group">
                                <span className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-lg shadow-black/20">✨</span>
                                <span className="group-hover:text-white transition-colors text-[#F8E9D8]/90">Авторські торти на замовлення</span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <span className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors shadow-lg shadow-black/20">📅</span>
                                <span className="group-hover:text-white transition-colors text-[#F8E9D8]/90">Замовлення за 3+ дні</span>
                            </div>
                            <div className="pt-2 space-y-4">
                                <Link to="/foto/" className="flex items-center gap-4 group/link hover:text-white transition-colors text-[#F8E9D8]/90">
                                    <span className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/link:bg-white/10 transition-colors shadow-lg shadow-black/20 text-base">🖼️</span>
                                    <span>Фотогалерея</span>
                                </Link>
                                <Link to="/video/" className="flex items-center gap-4 group/link hover:text-white transition-colors text-[#F8E9D8]/90">
                                    <span className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/link:bg-white/10 transition-colors shadow-lg shadow-black/20 text-base">🎥</span>
                                    <span>Відеогалерея</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left mt-4 md:mt-0">
                        <h3 className="text-base md:text-xl font-bold text-[#F5C24D] mb-3 md:mb-8 uppercase tracking-[0.2em] border-b border-[#F5C24D]/20 pb-1 md:pb-2 px-4" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Навігація
                        </h3>
                        <ul className="grid grid-cols-2 lg:grid-cols-1 gap-y-2 gap-x-4 md:gap-4 font-medium w-full text-[13px] md:text-base px-2">
                            <li><Link to="/" className="hover:text-amber-100 transition-all duration-300 flex items-center justify-center lg:justify-start gap-2 group text-gray-100">
                                <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">▶</span>
                                Головна
                            </Link></li>
                            <li><Link to="/torty-na-zamovlennya/" className="hover:text-amber-100 transition-all duration-300 flex items-center justify-center lg:justify-start gap-2 group text-gray-100">
                                <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">▶</span>
                                Всі торти
                            </Link></li>
                            <li><Link to="/nachynky/" className="hover:text-amber-100 transition-all duration-300 flex items-center justify-center lg:justify-start gap-2 group text-gray-100">
                                <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">▶</span>
                                Начинки
                            </Link></li>
                            <li><Link to="/dostavka/" className="hover:text-amber-100 transition-all duration-300 flex items-center justify-center lg:justify-start gap-2 group text-gray-100">
                                <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">▶</span>
                                Доставка
                            </Link></li>
                            <li><Link to="/pro-nas/" className="hover:text-amber-100 transition-all duration-300 flex items-center justify-center lg:justify-start gap-2 group text-gray-100">
                                <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">▶</span>
                                Про нас
                            </Link></li>
                            <li><Link to="/vidguky/" className="hover:text-amber-100 transition-all duration-300 flex items-center justify-center lg:justify-start gap-2 group text-gray-100">
                                <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">▶</span>
                                Відгуки
                            </Link></li>
                            <li className="col-span-2 lg:col-span-1"><Link to="/blog/" className="hover:text-amber-100 transition-all duration-300 flex items-center justify-center lg:justify-start gap-2 group text-gray-100">
                                <span className="hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">▶</span>
                                Блог
                            </Link></li>
                        </ul>
                    </div>

                    {/* Contacts & Map Section */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-4 md:mt-0">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <h3 className="text-base md:text-xl font-bold text-[#F5C24D] mb-3 md:mb-8 uppercase tracking-[0.2em] border-b border-[#F5C24D]/20 pb-1 w-full max-w-[150px] md:max-w-none px-4 md:px-0" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                                Контакти
                            </h3>
                            <div className="space-y-4 md:space-y-6 flex flex-col items-center md:items-start w-full">
                                <div className="group text-center md:text-left">
                                    <p className="font-bold text-amber-100 text-[9px] md:text-xs uppercase tracking-widest mb-1 md:mb-2">Самовивіз:</p>
                                    <p className="text-[13px] md:text-sm leading-relaxed text-gray-100 group-hover:text-white transition-colors flex items-center justify-center md:justify-start gap-1">
                                        <span>📍</span> Харківське шосе, 180/21
                                    </p>
                                </div>

                                <div className="group text-center md:text-left mt-2">
                                    <p className="font-bold text-[#F5C24D] text-[9px] md:text-sm uppercase tracking-widest mb-2 md:mb-4">Зв'язок:</p>
                                    <div className="space-y-2 md:space-y-4 flex flex-col items-center md:items-start">
                                        <a href="tel:0979081504" className="flex items-center gap-2 text-xl md:text-3xl font-black text-white hover:text-[#F5C24D] transition-colors justify-center md:justify-start drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                                            <span>📞</span>
                                            097 908 15 04
                                        </a>
                                        <a href="mailto:deludmila@ukr.net" className="flex items-center gap-2 hover:text-white transition-colors text-[#F8E9D8]/80 justify-center md:justify-start font-bold">
                                            <span className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-[10px] md:text-xs bg-white text-[#5E0C1B] rounded-md shadow-lg">@</span>
                                            <span className="text-sm md:text-base">deludmila@ukr.net</span>
                                        </a>
                                    </div>
                                </div>

                                <div className="flex justify-center md:justify-start space-x-3 pt-2 md:pt-6 w-full">
                                    <a href="https://www.instagram.com/liudmilaprikhodko" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] transition-all transform hover:-translate-y-1 border border-white/10 shadow-lg shadow-black/20">
                                        <FaInstagram className="text-lg" />
                                    </a>
                                    <a href="https://www.facebook.com/sveetdesert/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-[#1877F2] transition-all transform hover:-translate-y-1 border border-white/10 shadow-lg shadow-black/20">
                                        <FaFacebook className="text-lg" />
                                    </a>
                                    <a href="https://t.me/antreeeme" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-[#0088cc] transition-all transform hover:-translate-y-1 border border-white/10 shadow-lg shadow-black/20">
                                        <FaTelegram className="text-lg" />
                                    </a>
                                    <a href="viber://chat?number=%2B380979081504" target="_blank" rel="noopener noreferrer" aria-label="Viber" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-[#7360f2] transition-all transform hover:-translate-y-1 border border-white/10 shadow-lg shadow-black/20">
                                        <FaViber className="text-lg" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="block h-[150px] md:h-full md:min-h-[260px] lg:mt-6 mt-4">
                            <div className="rounded-2xl md:rounded-3xl overflow-hidden border-2 border-white/10 h-full relative group shadow-2xl shadow-black/20">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#5a0020]/30 to-transparent pointer-events-none z-10"></div>
                                <iframe
                                    title="Map location"
                                    src="https://maps.google.com/maps?q=Харківське+шосе,180/21,Київ&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: 'grayscale(0.3) contrast(1.1) brightness(0.8)' }}
                                    allowFullScreen=""
                                    className="group-hover:filter-none transition-all duration-700"
                                    loading="lazy">
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#3A0410] w-full py-5 md:py-6 mt-6 md:mt-16 border-t border-white/5">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[9px] md:text-[10px] uppercase tracking-widest gap-2 md:gap-0">
                    <p className="text-white font-bold opacity-90 drop-shadow-sm">© 2026 Antreme. Всі права захищені.</p>
                    <div className="text-[#F5C24D] font-bold italic text-[9px] md:text-[11px] drop-shadow-sm flex items-center justify-center gap-1.5 opacity-100">
                        Зроблено з <span className="text-sm md:text-base drop-shadow-md brightness-110">❤️</span> у майстерні Antreme
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
