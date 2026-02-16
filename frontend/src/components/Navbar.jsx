import React, { useContext, useState } from 'react';
import { FaInstagram, FaFacebook, FaTelegram, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import logo from '../assets/logo.png';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white border-b-2 border-vatsak-gold sticky top-0 z-50">
            {/* Top Bar removed at user request */}

            {/* Main Header */}
            <div className="container mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                    {/* Logo Area */}
                    <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
                        <img src={logo} alt="ANTREME" className="h-16 md:h-20 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                        <div className="flex flex-col">
                            <span className="text-gray-600 text-[10px] md:text-xs uppercase tracking-widest font-medium">Кондитерская мастерская</span>
                            <span className="text-2xl md:text-3xl font-serif font-bold text-[#5a0020] leading-none tracking-wide group-hover:text-vatsak-gold transition-colors duration-300">Antreme</span>
                        </div>
                    </Link>

                    {/* Search Bar */}
                    <div className="flex-grow flex justify-center px-4 md:px-10">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Поиск"
                                className="w-full py-2 pl-10 pr-4 bg-gray-100 border-none rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-vatsak-gold placeholder-gray-500 font-medium"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg" />
                        </div>
                    </div>

                    {/* Actions (Phone, Cart) */}
                    <div className="flex items-center space-x-6 flex-shrink-0">
                        <div className="hidden lg:flex flex-col items-center text-sm text-gray-700">
                            <div className="flex items-center space-x-4 mb-1">
                                <a href="https://www.instagram.com/liudmilaprikhodko" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-vatsak-red transition-colors">
                                    <FaInstagram className="text-3xl" />
                                </a>
                                <a href="https://www.facebook.com/sveetdesert/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                                    <FaFacebook className="text-3xl" />
                                </a>
                                <a href="https://t.me/antreeeme" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-500 transition-colors">
                                    <FaTelegram className="text-3xl" />
                                </a>
                            </div>
                            <a href="tel:0979081504" className="font-bold text-vatsak-red text-xl hover:text-red-700 transition-colors">097 908 15 04</a>
                        </div>

                        <Link to="/cart" className="relative group flex items-center gap-2 text-gray-700 hover:text-vatsak-red transition-colors">
                            <div className="relative">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-vatsak-red text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="hidden sm:block font-medium">Кошик</span>
                        </Link>

                        {/* Mobile Menu Button */}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700 focus:outline-none">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Secondary Navigation (Categories) */}
                <div className="hidden md:flex justify-center mt-4 space-x-6 lg:space-x-8 border-t border-gray-100 pt-6 font-bold text-[11px] lg:text-xs uppercase tracking-[0.15em] text-gray-800 flex-wrap">
                    <Link to="/" className="hover:text-vatsak-red transition-all hover:-translate-y-0.5 whitespace-nowrap">Головна</Link>
                    <Link to="/cakes?category=bento" className="hover:text-vatsak-red transition-all hover:-translate-y-0.5 whitespace-nowrap">Бенто тортики</Link>
                    <Link to="/cakes?category=biscuit" className="hover:text-vatsak-red transition-all hover:-translate-y-0.5 whitespace-nowrap">Бісквітні торти</Link>
                    <Link to="/cakes?category=wedding" className="hover:text-vatsak-red transition-all hover:-translate-y-0.5 whitespace-nowrap">Весільні торти</Link>
                    <Link to="/cakes?category=mousse" className="hover:text-vatsak-red transition-all hover:-translate-y-0.5 whitespace-nowrap">Мусові торти</Link>
                    <Link to="/cakes?category=cupcakes" className="hover:text-vatsak-red transition-all hover:-translate-y-0.5 whitespace-nowrap">Капкейки</Link>
                    <Link to="/cakes?category=gingerbread" className="hover:text-vatsak-red transition-all hover:-translate-y-0.5 whitespace-nowrap">Імбирні пряники</Link>
                    <Link to="/fillings" className="hover:text-vatsak-red transition-all hover:-translate-y-0.5 whitespace-nowrap">Начинки</Link>
                    <Link to="/delivery" className="hover:text-vatsak-red transition-all hover:-translate-y-0.5 whitespace-nowrap border-l border-gray-200 pl-6">Доставка</Link>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="px-6 py-4 flex flex-col space-y-4 font-medium">
                        <Link to="/" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Головна</Link>
                        <Link to="/cakes?category=bento" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Бенто тортики</Link>
                        <Link to="/cakes?category=biscuit" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Бісквітні торти</Link>
                        <Link to="/cakes?category=wedding" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Весільні торти</Link>
                        <Link to="/cakes?category=mousse" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Мусові торти</Link>
                        <Link to="/cakes?category=cupcakes" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Капкейки</Link>
                        <Link to="/cakes?category=gingerbread" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Імбирні пряники</Link>
                        <Link to="/fillings" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Начинки</Link>
                        <Link to="/delivery" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Доставка</Link>
                        <Link to="/cart" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Кошик ({cartCount})</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
