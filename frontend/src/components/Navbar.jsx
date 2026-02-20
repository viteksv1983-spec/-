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
        <nav className="sticky top-0 z-50 shadow-lg">
            {/* Main Header - Bright Amber Background */}
            <div className="bg-amber-400 w-full">
                <div className="container mx-auto px-6 py-4">
                    <div className="container mx-auto px-4 md:px-6">
                        {/* Desktop Header Layout */}
                        <div className="hidden md:flex justify-between items-center py-4 gap-6">
                            {/* Logo Area */}
                            <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
                                <img src={logo} alt="ANTREME" className="h-16 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                                <div className="flex flex-col">
                                    <span className="text-[#5a0020]/80 text-[10px] md:text-xs uppercase tracking-widest font-medium">Кондитерська мастерня</span>
                                    <span className="text-2xl md:text-3xl font-serif font-bold text-[#5a0020] leading-none tracking-wide group-hover:text-black transition-colors duration-300">Antreme</span>
                                </div>
                            </Link>

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="flex items-center w-full max-w-[220px] lg:max-w-[280px] flex-shrink-0">
                                <div className="flex-grow">
                                    <input
                                        type="text"
                                        placeholder="Пошук..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-[34px] py-0 pl-3 pr-2 bg-white border-2 border-white rounded-l-lg text-[12px] text-gray-900 focus:outline-none placeholder-gray-400 font-medium transition-all"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-10 h-[34px] bg-[#5a0020] hover:bg-black text-white flex items-center justify-center rounded-r-lg shadow-md active:scale-95 border-2 border-[#5a0020] hover:border-black transition-all flex-shrink-0"
                                >
                                    <FaSearch className="text-sm" />
                                </button>
                            </form>

                            {/* Desktop Links */}
                            <div className="hidden xl:flex items-center space-x-4 font-bold text-[10px] lg:text-[11px] uppercase tracking-wider text-[#5a0020] flex-shrink-0">
                                <Link to="/about" className="hover:text-black transition-colors whitespace-nowrap">Про нас</Link>
                                <Link to="/delivery" className="hover:text-black transition-colors whitespace-nowrap">Доставка та оплата</Link>
                                <Link to="/gallery/photo" className="hover:text-black transition-colors whitespace-nowrap">Фото</Link>
                                <Link to="/gallery/video" className="hover:text-black transition-colors whitespace-nowrap">Відео</Link>
                                <Link to="/reviews" className="hover:text-black transition-colors whitespace-nowrap">Відгуки</Link>
                                <Link to="/blog" className="hover:text-black transition-colors whitespace-nowrap">Блог</Link>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-4 lg:space-x-6 flex-shrink-0">
                                <div className="hidden lg:flex flex-col items-center">
                                    <div className="flex items-center space-x-3 mb-1">
                                        <a href="https://www.instagram.com/liudmilaprikhodko" target="_blank" rel="noopener noreferrer" className="text-[#5a0020] hover:text-black transition-colors">
                                            <FaInstagram className="text-xl" />
                                        </a>
                                        <a href="https://www.facebook.com/sveetdesert/" target="_blank" rel="noopener noreferrer" className="text-[#5a0020] hover:text-black transition-colors">
                                            <FaFacebook className="text-xl" />
                                        </a>
                                        <a href="https://t.me/antreeeme" target="_blank" rel="noopener noreferrer" className="text-[#5a0020] hover:text-black transition-colors">
                                            <FaTelegram className="text-xl" />
                                        </a>
                                        <a href="viber://chat?number=%2B380979081504" target="_blank" rel="noopener noreferrer" className="text-[#5a0020] hover:text-black transition-colors">
                                            <FaViber className="text-xl" />
                                        </a>
                                    </div>
                                    <a href="tel:0979081504" className="font-bold text-[#5a0020] text-base lg:text-lg hover:text-black transition-colors whitespace-nowrap">097 908 15 04</a>
                                </div>

                                <div className="hidden xl:flex items-center">
                                    <Link to={user ? "/account" : "/login"} className="text-[#5a0020] hover:text-black transition-colors p-2 rounded-full hover:bg-black/5" title={user ? "Особистий кабінет" : "Вхід"}>
                                        <FiUser className="w-8 h-8" />
                                    </Link>
                                </div>

                                <Link to="/cart" className="relative group text-[#5a0020] hover:text-black transition-colors p-2 rounded-full hover:bg-black/5">
                                    <div className="relative">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                        </svg>
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-white text-[#5a0020] text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-[#5a0020]">
                                                {cartCount}
                                            </span>
                                        )}
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* Ultra-Compact Mobile Header Layout (Rozetka Style) */}
                        <div className="md:hidden flex items-center justify-between py-1.5">
                            <div className="flex items-center gap-2">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#5a0020] p-1 ml-1">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                    </svg>
                                </button>
                                <Link to="/" className="flex items-center gap-1.5">
                                    <img src={logo} alt="L" className="h-8 w-auto" />
                                    <span className="text-lg font-serif font-bold text-[#5a0020] tracking-tighter">Antreme</span>
                                </Link>
                            </div>
                            <div className="flex items-center gap-2 mr-2">
                                <a href="tel:0979081504" className="text-[#5a0020] p-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                </a>
                                <Link to={user ? "/account" : "/login"} className="text-[#5a0020] p-1" title={user ? "Особистий кабінет" : "Вхід"}>
                                    <FiUser className="w-5 h-5" />
                                </Link>
                                <Link to="/cart" className="relative p-1 text-[#5a0020]">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                    </svg>
                                    {cartCount > 0 && (
                                        <span className="absolute top-0 right-0 bg-white text-[#5a0020] text-[8px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center border border-[#5a0020]">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Navigation (Categories) - Scrollable on Mobile - Hidden on Mobile altogether by user request */}
            <div className={`bg-white border-t border-gray-100 py-2.5 md:py-4 overflow-x-auto scrollbar-hide hidden md:block`}>
                <div className="container mx-auto px-4 md:px-6 flex items-center justify-start md:justify-center space-x-5 md:space-x-8 font-bold text-[10px] md:text-xs uppercase tracking-widest text-gray-800 flex-nowrap md:flex-wrap min-w-max">
                    <Link to="/holiday" className="text-[#a0742d] hover:text-[#5a0020] transition-all hover:-translate-y-0.5 whitespace-nowrap font-black border-r border-gray-100 pr-5 md:pr-8">Торти на замовлення</Link>
                    <Link to="/cakes?category=bento" className="hover:text-[#5a0020] transition-all hover:-translate-y-0.5 whitespace-nowrap">Бенто тортики</Link>
                    <Link to="/cakes?category=biscuit" className="hover:text-[#5a0020] transition-all hover:-translate-y-0.5 whitespace-nowrap">Бісквітні торти</Link>
                    <Link to="/cakes?category=mousse" className="hover:text-[#5a0020] transition-all hover:-translate-y-0.5 whitespace-nowrap">Мусові торти</Link>
                    <Link to="/cakes?category=cupcakes" className="hover:text-[#5a0020] transition-all hover:-translate-y-0.5 whitespace-nowrap">Капкейки</Link>
                    <Link to="/cakes?category=gingerbread" className="hover:text-[#5a0020] transition-all hover:-translate-y-0.5 whitespace-nowrap">Імбирні пряники</Link>
                    <Link to="/fillings" className="hover:text-[#5a0020] transition-all hover:-translate-y-0.5 whitespace-nowrap">Начинки</Link>
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
                    <div className="fixed top-0 left-0 h-full bg-white z-50 shadow-2xl w-fit max-w-[85vw] transform transition-transform duration-300 md:hidden overflow-y-auto flex flex-col border-r-4 border-amber-400">
                        <div className="p-6 flex items-center justify-between border-b border-gray-100 bg-amber-400 sticky top-0 z-10">
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

                        <div className="px-8 py-8 flex flex-col space-y-6 font-bold uppercase tracking-widest text-[#5a0020]">
                            <Link to="/holiday" className="text-[#a0742d] hover:translate-x-2 transition-transform inline-block font-black" onClick={() => setIsMenuOpen(false)}>Торти на замовлення</Link>
                            <Link to="/cakes?category=bento" className="hover:translate-x-2 transition-transform inline-block" onClick={() => setIsMenuOpen(false)}>Бенто тортики</Link>
                            <Link to="/cakes?category=biscuit" className="hover:translate-x-2 transition-transform inline-block" onClick={() => setIsMenuOpen(false)}>Бісквітні торти</Link>
                            <Link to="/cakes?category=mousse" className="hover:translate-x-2 transition-transform inline-block" onClick={() => setIsMenuOpen(false)}>Мусові торти</Link>
                            <Link to="/cakes?category=cupcakes" className="hover:translate-x-2 transition-transform inline-block" onClick={() => setIsMenuOpen(false)}>Капкейки</Link>
                            <Link to="/cakes?category=gingerbread" className="hover:translate-x-2 transition-transform inline-block" onClick={() => setIsMenuOpen(false)}>Імбирні пряники</Link>
                            <Link to="/fillings" className="hover:translate-x-2 transition-transform inline-block" onClick={() => setIsMenuOpen(false)}>Начинки</Link>
                            <Link to="/delivery" className="hover:translate-x-2 transition-transform inline-block" onClick={() => setIsMenuOpen(false)}>Доставка</Link>
                            <Link to="/gallery/photo" className="hover:translate-x-2 transition-transform inline-block" onClick={() => setIsMenuOpen(false)}>Фото</Link>
                            <Link to="/gallery/video" className="hover:translate-x-2 transition-transform inline-block" onClick={() => setIsMenuOpen(false)}>Відео</Link>
                            <Link to="/reviews" className="hover:translate-x-2 transition-transform inline-block" onClick={() => setIsMenuOpen(false)}>Відгуки</Link>
                            <Link to="/blog" className="hover:translate-x-2 transition-transform inline-block" onClick={() => setIsMenuOpen(false)}>Блог</Link>
                            <Link to="/about" className="hover:translate-x-2 transition-transform inline-block" onClick={() => setIsMenuOpen(false)}>Про нас</Link>
                        </div>

                        <div className="mt-auto p-8 border-t border-gray-100 flex flex-col gap-6 bg-gray-50/50">
                            <a href="tel:0979081504" className="text-lg font-black text-[#5a0020] hover:text-black transition-colors">097 908 15 04</a>
                            <div className="flex gap-6 items-center">
                                <a href="https://www.instagram.com/liudmilaprikhodko" target="_blank" rel="noopener noreferrer" className="text-2xl text-[#5a0020] hover:scale-110 transition-transform">
                                    <FaInstagram />
                                </a>
                                <a href="https://t.me/antreeeme" target="_blank" rel="noopener noreferrer" className="text-2xl text-[#5a0020] hover:scale-110 transition-transform">
                                    <FaTelegram />
                                </a>
                                <a href="viber://chat?number=%2B380979081504" target="_blank" rel="noopener noreferrer" className="text-2xl text-[#5a0020] hover:scale-110 transition-transform">
                                    <FaViber />
                                </a>
                                <a href="https://www.facebook.com/sveetdesert/" target="_blank" rel="noopener noreferrer" className="text-2xl text-[#5a0020] hover:scale-110 transition-transform">
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
