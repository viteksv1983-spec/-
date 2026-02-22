import React, { useContext, useState } from 'react';
import { FaInstagram, FaFacebook, FaTelegram, FaSearch, FaViber } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import logo from '../assets/logo.png';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we are on a product detail page to hide secondary nav on mobile
    const isProductDetailPage = location.pathname.startsWith('/cakes/') && location.pathname.split('/').length === 3;

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/cakes?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className="sticky top-0 z-50 shadow-md/50 transition-all duration-300">
            {/* Main Header - Refined Cream Background matched to user request */}
            <div className="bg-[#F3E2CF] w-full border-b border-[#C89B63]">
                <div className="container mx-auto px-6 py-4">
                    <div className="container mx-auto px-4 md:px-6">
                        {/* Desktop Header Layout */}
                        <div className="hidden md:flex justify-between items-center py-4 gap-6">
                            {/* Logo Area */}
                            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
                                <img src={logo} alt="ANTREME" className="h-16 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                                <div className="flex flex-col">
                                    <span className="text-[#5a0020]/80 text-[10px] md:text-xs uppercase tracking-widest font-medium">Кондитерська майстерня</span>
                                    <span className="text-2xl md:text-3xl font-serif font-bold text-[#5a0020] leading-none tracking-wide group-hover:text-black transition-colors duration-300">Antreme</span>
                                </div>
                            </Link>

                            {/* Search Bar Area */}
                            <form onSubmit={handleSearch} className="flex items-center w-full max-w-[200px] lg:max-w-[240px] flex-shrink-0">
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        placeholder="Пошук..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-[36px] py-0 pl-4 pr-10 bg-white border border-gray-200 rounded-md text-[13px] text-gray-900 focus:outline-none placeholder-gray-400 font-medium"
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-0 top-0 w-10 h-full bg-[#6A1A24] text-white flex items-center justify-center rounded-r-md transition-colors hover:bg-[#80202c]"
                                    >
                                        <FaSearch className="text-sm" />
                                    </button>
                                </div>
                            </form>

                            {/* Desktop Links - Subtle & Dark */}
                            <div className="hidden xl:flex items-center space-x-5 font-bold text-[11px] uppercase tracking-tight text-gray-800 flex-shrink-0">
                                <Link to="/about" className="hover:text-[#D39A5E] transition-colors">Про нас</Link>
                                <Link to="/delivery" className="hover:text-[#D39A5E] transition-colors">Доставка та оплата</Link>
                                <Link to="/gallery/photo" className="hover:text-[#D39A5E] transition-colors">Фото</Link>
                                <Link to="/gallery/video" className="hover:text-[#D39A5E] transition-colors">Відео</Link>
                                <Link to="/reviews" className="hover:text-[#D39A5E] transition-colors">Відгуки</Link>
                                <Link to="/blog" className="hover:text-[#D39A5E] transition-colors">Блог</Link>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-4 lg:space-x-6 flex-shrink-0">
                                <div className="hidden lg:flex flex-col items-center">
                                    <div className="flex items-center space-x-3 mb-1">
                                        <a href="https://www.instagram.com/liudmilaprikhodko" target="_blank" rel="noopener noreferrer" className="text-[#6A1A24] hover:text-[#5a0020] transition-colors">
                                            <FaInstagram className="text-xl" />
                                        </a>
                                        <a href="https://www.facebook.com/sveetdesert/" target="_blank" rel="noopener noreferrer" className="text-[#6A1A24] hover:text-[#5a0020] transition-colors">
                                            <FaFacebook className="text-xl" />
                                        </a>
                                        <a href="https://t.me/antreeeme" target="_blank" rel="noopener noreferrer" className="text-[#6A1A24] hover:text-[#5a0020] transition-colors">
                                            <FaTelegram className="text-xl" />
                                        </a>
                                        <a href="viber://chat?number=%2B380979081504" target="_blank" rel="noopener noreferrer" className="text-[#6A1A24] hover:text-[#5a0020] transition-colors">
                                            <FaViber className="text-xl" />
                                        </a>
                                    </div>
                                    <a href="tel:0979081504" className="font-extrabold text-[#5a0020] text-[18px] hover:text-black transition-colors whitespace-nowrap">097 908 15 04</a>
                                </div>

                                <div className="hidden xl:flex items-center">
                                    <Link to={user ? "/account" : "/login"} className="text-[#6A1A24] hover:text-[#5a0020] transition-colors p-2 rounded-full hover:bg-black/5" title={user ? "Особистий кабінет" : "Вхід"}>
                                        <FiUser className="w-8 h-8" />
                                    </Link>
                                </div>

                                <Link to="/cart" className="relative group text-[#6A1A24] hover:text-[#5a0020] transition-colors p-2 rounded-full hover:bg-black/5">
                                    <div className="relative">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                        </svg>
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-[#6A1A24] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Мобильная шапка: Логотип + Бренд + Телефон/Соцсети */}
                        <div className="md:hidden flex items-center justify-between py-2">
                            {/* Логотип + Бренд */}
                            <Link to="/" className="flex items-center gap-2">
                                <img src={logo} alt="Antreme" className="h-9 w-auto" />
                                <div className="flex flex-col leading-none">
                                    <span className="text-[8px] text-[#5a0020]/70 uppercase tracking-wider font-medium">Кондитерська майстерня</span>
                                    <span className="text-[17px] font-serif font-bold text-[#6A1A24] tracking-tighter">Antreme</span>
                                </div>
                            </Link>
                            {/* Правая часть: соцсети + телефон */}
                            <div className="flex flex-col items-end gap-0.5">
                                <div className="flex items-center gap-2">
                                    <a href="https://www.instagram.com/liudmilaprikhodko" target="_blank" rel="noopener noreferrer" className="text-[#6A1A24]">
                                        <FaInstagram className="text-[15px]" />
                                    </a>
                                    <a href="https://www.facebook.com/sveetdesert/" target="_blank" rel="noopener noreferrer" className="text-[#6A1A24]">
                                        <FaFacebook className="text-[15px]" />
                                    </a>
                                    <a href="https://t.me/antreeeme" target="_blank" rel="noopener noreferrer" className="text-[#6A1A24]">
                                        <FaTelegram className="text-[15px]" />
                                    </a>
                                </div>
                                <a href="tel:0979081504" className="font-extrabold text-[#5a0020] text-[13px] tracking-tight">097 908 15 04</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Navigation (Categories) — десктоп: полная полоса, мобильный: активная категория + иконки */}

            {/* Десктоп версия */}
            <div className="bg-white border-t border-gray-100 py-4 overflow-x-auto scrollbar-hide hidden md:block">
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-center space-x-8 md:space-x-12 font-bold text-[12px] uppercase tracking-widest flex-nowrap">
                    <Link to="/holiday" className={`transition-all whitespace-nowrap font-black border-b-2 pb-0.5 ${location.pathname === '/holiday' ? 'text-[#D8A055] border-[#D8A055]' : 'text-gray-900 border-transparent hover:text-[#D8A055] hover:border-[#D8A055]'}`}>Торти на замовлення</Link>
                    <Link to="/bento-torty" className={`transition-all whitespace-nowrap border-b-2 pb-0.5 ${location.pathname === '/bento-torty' ? 'text-[#D8A055] font-black border-[#D8A055]' : 'text-gray-900 border-transparent hover:text-[#D8A055]'}`}>Бенто тортики</Link>
                    <Link to="/biskvitni-torty" className={`transition-all whitespace-nowrap border-b-2 pb-0.5 ${location.pathname === '/biskvitni-torty' ? 'text-[#D8A055] font-black border-[#D8A055]' : 'text-gray-900 border-transparent hover:text-[#D8A055]'}`}>Бісквітні торти</Link>
                    <Link to="/musovi-torty" className={`transition-all whitespace-nowrap border-b-2 pb-0.5 ${location.pathname === '/musovi-torty' ? 'text-[#D8A055] font-black border-[#D8A055]' : 'text-gray-900 border-transparent hover:text-[#D8A055]'}`}>Мусові торти</Link>
                    <Link to="/kapkeyki" className={`transition-all whitespace-nowrap border-b-2 pb-0.5 ${location.pathname === '/kapkeyki' ? 'text-[#D8A055] font-black border-[#D8A055]' : 'text-gray-900 border-transparent hover:text-[#D8A055]'}`}>Капкейки</Link>
                    <Link to="/imbirni-pryaniki" className={`transition-all whitespace-nowrap border-b-2 pb-0.5 ${location.pathname === '/imbirni-pryaniki' ? 'text-[#D8A055] font-black border-[#D8A055]' : 'text-gray-900 border-transparent hover:text-[#D8A055]'}`}>Імбирні пряники</Link>
                    <Link to="/fillings" className={`transition-all whitespace-nowrap border-b-2 pb-0.5 ${location.pathname === '/fillings' ? 'text-[#D8A055] font-black border-[#D8A055]' : 'text-gray-900 border-transparent hover:text-[#D8A055]'}`}>Начинки</Link>
                </div>
            </div>

            {/* Мобильная вторичная навигация — активная категория + иконки */}
            <div className="md:hidden bg-white border-t border-gray-100">
                <div className="flex items-center justify-between px-3 py-2">
                    {/* Активная категория — прокручиваемая */}
                    <div className="flex-1 overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-4 font-bold text-[11px] uppercase tracking-widest min-w-max pr-3">
                            <Link
                                to="/holiday"
                                className={`whitespace-nowrap border-b-2 pb-0.5 transition-colors ${location.pathname === '/holiday' || location.pathname === '/' ? 'text-[#D8A055] border-[#D8A055] font-black' : 'text-gray-700 border-transparent'}`}
                            >
                                Торти на замовлення
                            </Link>
                            <Link to="/bento-torty" className={`whitespace-nowrap border-b-2 pb-0.5 ${location.pathname === '/bento-torty' ? 'text-[#D8A055] border-[#D8A055] font-black' : 'text-gray-500 border-transparent'}`}>Бенто</Link>
                            <Link to="/biskvitni-torty" className={`whitespace-nowrap border-b-2 pb-0.5 ${location.pathname === '/biskvitni-torty' ? 'text-[#D8A055] border-[#D8A055] font-black' : 'text-gray-500 border-transparent'}`}>Бісквітні</Link>
                            <Link to="/musovi-torty" className={`whitespace-nowrap border-b-2 pb-0.5 ${location.pathname === '/musovi-torty' ? 'text-[#D8A055] border-[#D8A055] font-black' : 'text-gray-500 border-transparent'}`}>Мусові</Link>
                            <Link to="/kapkeyki" className={`whitespace-nowrap border-b-2 pb-0.5 ${location.pathname === '/kapkeyki' ? 'text-[#D8A055] border-[#D8A055] font-black' : 'text-gray-500 border-transparent'}`}>Капкейки</Link>
                            <Link to="/fillings" className={`whitespace-nowrap border-b-2 pb-0.5 ${location.pathname === '/fillings' ? 'text-[#D8A055] border-[#D8A055] font-black' : 'text-gray-500 border-transparent'}`}>Начинки</Link>
                        </div>
                    </div>
                    {/* Иконки справа */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2 border-l border-gray-100 pl-2">
                        {/* Поиск */}
                        <button onClick={() => { setIsMenuOpen(false); navigate('/cakes'); }} className="text-[#6A1A24] p-1.5">
                            <FaSearch className="text-[14px]" />
                        </button>
                        {/* Корзина */}
                        <Link to="/cart" className="relative text-[#6A1A24] p-1.5">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 bg-[#6A1A24] text-white text-[7px] font-bold rounded-full h-3 w-3 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        {/* Бургер */}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#6A1A24] p-1.5">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay & Drawer */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Drawer */}
                    <div className="fixed top-0 left-0 h-full bg-white z-50 shadow-2xl w-fit max-w-[85vw] transform transition-transform duration-300 md:hidden overflow-y-auto flex flex-col border-r-4 border-[#F6E7D6]">
                        <div className="p-6 flex items-center justify-between border-b border-gray-100 bg-[#F6E7D6] sticky top-0 z-10">
                            <div className="flex items-center gap-2">
                                <img src={logo} alt="L" className="h-8 w-auto" />
                                <span className="text-xl font-serif font-bold text-[#5a0020]">Antreme</span>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className="text-[#5a0020] p-1 ml-4 hover:rotate-90 transition-transform">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="px-6 py-6 flex flex-col flex-1">
                            {/* === Категорії товарів === */}
                            <div className="mb-5">
                                <div className="text-[10px] uppercase tracking-[0.2em] text-[#a0742d]/60 font-black mb-3 px-2">Каталог</div>
                                <div className="rounded-xl py-2 px-1">
                                    <Link to="/holiday" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-black uppercase tracking-wider text-[#5a0020] hover:bg-[#F3E2CF]/60 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        🎂 Торти на замовлення
                                    </Link>
                                    <Link to="/bento-torty" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-bold uppercase tracking-wider text-[#a0742d] hover:bg-[#F3E2CF]/60 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        🍰 Бенто тортики
                                    </Link>
                                    <Link to="/biskvitni-torty" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-bold uppercase tracking-wider text-[#a0742d] hover:bg-[#F3E2CF]/60 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        🧁 Бісквітні торти
                                    </Link>
                                    <Link to="/musovi-torty" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-bold uppercase tracking-wider text-[#a0742d] hover:bg-[#F3E2CF]/60 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        🍮 Мусові торти
                                    </Link>
                                    <Link to="/cakes?category=wedding" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-bold uppercase tracking-wider text-[#a0742d] hover:bg-[#F3E2CF]/60 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        💍 Весільні торти
                                    </Link>
                                    <Link to="/cakes?category=kids" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-bold uppercase tracking-wider text-[#a0742d] hover:bg-[#F3E2CF]/60 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        🧸 Дитячі торти
                                    </Link>
                                    <Link to="/cakes?category=birthday" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-bold uppercase tracking-wider text-[#a0742d] hover:bg-[#F3E2CF]/60 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        🎉 На День народження
                                    </Link>
                                    <Link to="/cakes?category=anniversary" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-bold uppercase tracking-wider text-[#a0742d] hover:bg-[#F3E2CF]/60 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        🥂 На ювілей
                                    </Link>
                                    <Link to="/kapkeyki" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-bold uppercase tracking-wider text-[#a0742d] hover:bg-[#F3E2CF]/60 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        🧁 Капкейки
                                    </Link>
                                    <Link to="/imbirni-pryaniki" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-bold uppercase tracking-wider text-[#a0742d] hover:bg-[#F3E2CF]/60 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        🍪 Імбирні пряники
                                    </Link>
                                    <Link to="/fillings" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-bold uppercase tracking-wider text-[#a0742d] hover:bg-[#F3E2CF]/60 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        🫐 Начинки
                                    </Link>
                                </div>
                            </div>

                            {/* === Розділова лінія === */}
                            <div className="border-t border-gray-200/80 my-1"></div>

                            {/* === Інформація === */}
                            <div className="mt-4">
                                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black mb-3 px-2">Інформація</div>
                                <div className="flex flex-col gap-1 px-1">
                                    <Link to="/delivery" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        🚚 Доставка та оплата
                                    </Link>
                                    <Link to="/gallery/photo" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        📸 Фото
                                    </Link>
                                    <Link to="/gallery/video" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        🎬 Відео
                                    </Link>
                                    <Link to="/reviews" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        ⭐ Відгуки
                                    </Link>
                                    <Link to="/blog" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        📝 Блог
                                    </Link>
                                    <Link to="/about" className="flex items-center gap-2 px-3 py-2.5 text-[13px] font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>
                                        💛 Про нас
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto p-8 border-t border-gray-100 flex flex-col gap-6 bg-gray-50/50">
                            <a href="tel:0979081504" className="text-lg font-black text-[#D39A5E] hover:text-black transition-colors">097 908 15 04</a>
                            <div className="flex gap-6 items-center">
                                <a href="https://www.instagram.com/liudmilaprikhodko" target="_blank" rel="noopener noreferrer" className="text-2xl text-[#D39A5E] hover:scale-110 transition-transform">
                                    <FaInstagram />
                                </a>
                                <a href="https://t.me/antreeeme" target="_blank" rel="noopener noreferrer" className="text-2xl text-[#D39A5E] hover:scale-110 transition-transform">
                                    <FaTelegram />
                                </a>
                                <a href="viber://chat?number=%2B380979081504" target="_blank" rel="noopener noreferrer" className="text-2xl text-[#D39A5E] hover:scale-110 transition-transform">
                                    <FaViber />
                                </a>
                                <a href="https://www.facebook.com/sveetdesert/" target="_blank" rel="noopener noreferrer" className="text-2xl text-[#D39A5E] hover:scale-110 transition-transform">
                                    <FaFacebook />
                                </a>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}

export default Navbar;
