import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { cartCount } = useContext(CartContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white border-b-2 border-vatsak-gold sticky top-0 z-50">
            {/* Top Bar (Optional, usually for contacts/login) */}
            <div className="bg-vatsak-red text-white py-1">
                <div className="container mx-auto px-6 flex justify-end text-sm">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 border-r border-red-400 pr-4">
                                <div className="h-6 w-6 bg-vatsak-gold text-vatsak-red rounded-full flex items-center justify-center font-bold text-xs">
                                    {user.email[0].toUpperCase()}
                                </div>
                                <span className="font-medium">Особистий кабінет</span>
                            </div>
                            <button onClick={logout} className="hover:text-vatsak-gold transition-colors font-bold uppercase text-xs tracking-widest">Вийти</button>
                        </div>
                    ) : (
                        <div className="flex space-x-4">
                            <Link to="/login" className="hover:text-vatsak-gold transition-colors">Увійти</Link>
                            <Link to="/register" className="hover:text-vatsak-gold transition-colors">Реєстрація</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Logo Area */}
                    <Link to="/" className="flex items-center flex-shrink-0">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-serif text-gray-800 tracking-wider" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Інна Тортики
                            </div>
                            <div className="text-xs text-gray-500 tracking-widest uppercase mt-1">Авторська кондитерська</div>
                        </div>
                    </Link>

                    {/* Search Bar - Central & Prominent */}
                    <div className="w-full md:max-w-xl mx-4 flex relative">
                        <input
                            type="text"
                            placeholder="Знайдіть свій улюблений торт..."
                            className="w-full border-2 border-gray-200 rounded-full py-2 px-5 focus:outline-none focus:border-vatsak-red transition-colors"
                        />
                        <button className="absolute right-1 top-1 bottom-1 bg-vatsak-red text-white p-2 rounded-full px-4 hover:bg-red-800 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                    </div>

                    {/* Actions (Phone, Cart) */}
                    <div className="flex items-center space-x-6 flex-shrink-0">
                        <div className="hidden lg:flex flex-col items-end text-sm text-gray-700">
                            <span className="font-bold text-vatsak-red text-lg">0 800 123 456</span>
                            <span className="text-xs text-gray-500">Безкоштовна підтримка</span>
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
                <div className="hidden md:flex justify-center mt-4 space-x-8 border-t border-gray-100 pt-4 font-medium text-sm uppercase tracking-wide text-gray-600">
                    <Link to="/" className="hover:text-vatsak-red transition-colors">Головна</Link>
                    <Link to="/cakes" className="hover:text-vatsak-red transition-colors">Всі продукти</Link>
                    <Link to="/cakes?category=cakes" className="hover:text-vatsak-red transition-colors">Торти</Link>
                    <Link to="/cakes?category=cookies" className="hover:text-vatsak-red transition-colors">Печенье</Link>
                    <Link to="/cakes?category=sweets" className="hover:text-vatsak-red transition-colors">Солодощі</Link>
                    <Link to="/promotions" className="hover:text-vatsak-red transition-colors">Акції</Link>
                    <Link to="/delivery" className="hover:text-vatsak-red transition-colors">Доставка</Link>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="px-6 py-4 flex flex-col space-y-4 font-medium">
                        <Link to="/" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Головна</Link>
                        <Link to="/cakes" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Всі продукти</Link>
                        <Link to="/cakes?category=cakes" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Торти</Link>
                        <Link to="/cakes?category=cookies" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Печенье</Link>
                        <Link to="/cakes?category=sweets" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Солодощі</Link>
                        <Link to="/cart" className="text-gray-800 hover:text-vatsak-red uppercase text-sm">Кошик ({cartCount})</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
