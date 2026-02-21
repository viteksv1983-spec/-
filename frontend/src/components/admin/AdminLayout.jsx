import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    FiShoppingBag, FiPackage, FiLayers, FiLogOut, FiHome,
    FiMenu, FiX, FiChevronDown, FiChevronRight, FiGrid, FiImage, FiMessageCircle
} from 'react-icons/fi';
import { CATEGORIES } from '../../constants/categories';

export default function AdminLayout() {
    const { logout } = useAuth();
    const location = useLocation();
    const [isHolidayOpen, setIsHolidayOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const searchParams = new URLSearchParams(location.search);
    const activeCategory = searchParams.get('category') || 'all';
    const activeStatus = searchParams.get('status') || 'all';

    const ORDER_STATUSES = [
        { id: 'all', name: 'Усі', icon: <FiGrid className="w-3.5 h-3.5" /> },
        { id: 'pending', name: 'Очікують', color: 'bg-amber-400' },
        { id: 'processing', name: 'В роботі', color: 'bg-blue-400' },
        { id: 'completed', name: 'Виконано', color: 'bg-green-400' },
        { id: 'cancelled', name: 'Скасовано', color: 'bg-gray-400' }
    ];

    const mainSlugs = ['bento', 'biscuit', 'mousse', 'wedding', 'cupcakes', 'gingerbread'];
    const MAIN_CATS = CATEGORIES.filter(c => mainSlugs.includes(c.slug));
    const HOLIDAY_CATS = CATEGORIES.filter(c => !mainSlugs.includes(c.slug));

    const getEmoji = (slug) => {
        const emojis = {
            'bento': '🍱', 'biscuit': '🍰', 'mousse': '🍮', 'wedding': '💍', 'cupcakes': '🧁', 'gingerbread': '🍪',
            'birthday': '🎂', 'anniversary': '🎊', 'kids': '🧸', 'boy': '🚙', 'girl': '👸', 'for-women': '💃',
            'for-men': '👔', 'patriotic': '🇺🇦', 'professional': '🛠️', 'gender-reveal': '👶', 'hobby': '🎨',
            'corporate': '🏢', 'christening': '👼', 'seasonal': '🍂', 'photo-cakes': '📸'
        };
        return emojis[slug] || '✨';
    };

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-vatsak-red rounded-lg flex items-center justify-center text-white font-bold">A</div>
                    <span className="font-bold text-gray-800 tracking-tight">Antreme Admin</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                </button>
            </header>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-50 transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-gray-100 hidden lg:flex items-center gap-3">
                    <div className="w-8 h-8 bg-vatsak-red rounded-lg flex items-center justify-center text-white font-bold">A</div>
                    <span className="font-bold text-gray-800 text-lg tracking-tight">Antreme Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-16 lg:mt-0">
                    <Link
                        to="/admin/orders"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/orders')
                            ? 'bg-vatsak-red text-white shadow-md shadow-red-100 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <FiShoppingBag className="w-5 h-5" />
                        <span>Замовлення</span>
                    </Link>

                    {/* Order Status Sub-nav */}
                    {isActive('/admin/orders') && (
                        <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 animate-fade-in">
                            {ORDER_STATUSES.map((status) => (
                                <Link
                                    key={status.id}
                                    to={`/admin/orders${status.id !== 'all' ? `?status=${status.id}` : ''}`}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeStatus === status.id
                                        ? 'text-vatsak-red'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {status.icon ? status.icon : <span className={`w-2 h-2 rounded-full ${status.color}`}></span>}
                                    <span>{status.name}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    <Link
                        to="/admin/products"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/products') || location.pathname.startsWith('/admin/products/edit')
                            ? 'bg-vatsak-red text-white shadow-md shadow-red-100 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <FiPackage className="w-5 h-5" />
                        <span>Товари</span>
                    </Link>

                    {/* Main Categories Section */}
                    {(isActive('/admin/products') || location.pathname.startsWith('/admin/products/edit')) && (
                        <div className="ml-9 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 animate-fade-in">
                            {!isHolidayOpen && (
                                <>
                                    <Link
                                        to="/admin/products"
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeCategory === 'all'
                                            ? 'text-vatsak-red'
                                            : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        <FiGrid className="w-3.5 h-3.5" />
                                        <span>Усі товари</span>
                                    </Link>

                                    {MAIN_CATS.map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            to={`/admin/products?category=${cat.slug}`}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={`flex items-center gap-2 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${activeCategory === cat.slug
                                                ? 'text-vatsak-red'
                                                : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            <span>{getEmoji(cat.slug)}</span>
                                            <span>{cat.name}</span>
                                        </Link>
                                    ))}
                                </>
                            )}

                            {/* Holiday Cakes Group */}
                            <button
                                onClick={() => setIsHolidayOpen(!isHolidayOpen)}
                                className={`flex items-center justify-between w-full py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${HOLIDAY_CATS.some(c => c.slug === activeCategory) || isHolidayOpen ? 'text-vatsak-red' : 'text-gray-400 hover:text-gray-600'} ${isHolidayOpen ? 'bg-red-50/50 -ml-4 pl-4 rounded-l-xl border-l-2 border-vatsak-red' : ''}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span>{isHolidayOpen ? '⬅️' : '✨'}</span>
                                    <span>{isHolidayOpen ? 'Назад' : 'Торти для свята'}</span>
                                </div>
                                {isHolidayOpen ? <FiX className="text-[10px]" /> : <FiChevronRight />}
                            </button>

                            {isHolidayOpen && (
                                <div className="mt-2 space-y-1.5 animate-fade-in-up">
                                    <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-3 ml-1">Підкатегорії</div>
                                    {HOLIDAY_CATS.map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            to={`/admin/products?category=${cat.slug}`}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-bold transition-all ${activeCategory === cat.slug
                                                ? 'bg-vatsak-red text-white shadow-sm shadow-red-100 scale-[1.02]'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                                                }`}
                                        >
                                            <span className="text-lg grayscale-0 group-hover:scale-110 transition-transform">{getEmoji(cat.slug)}</span>
                                            <span className="leading-tight">{cat.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <Link
                        to="/admin/categories"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/categories')
                            ? 'bg-vatsak-red text-white shadow-md shadow-red-100 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <FiImage className="w-5 h-5" />
                        <span>Категорії</span>
                    </Link>

                    <Link
                        to="/admin/seo"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/seo')
                            ? 'bg-vatsak-red text-white shadow-md shadow-red-100 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <FiLayers className="w-5 h-5" />
                        <span>Редактор сторінок</span>
                    </Link>

                    <Link
                        to="/admin/telegram"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive('/admin/telegram')
                            ? 'bg-vatsak-red text-white shadow-md shadow-red-100 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                    >
                        <FiMessageCircle className="w-5 h-5" />
                        <span>Telegram Сповіщення</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-vatsak-red mb-2 transition-colors">
                        <FiHome className="w-4 h-4" />
                        <span>На головну сайту</span>
                    </Link>
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                        <FiLogOut className="w-5 h-5" />
                        <span>Вийти</span>
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 overflow-x-hidden">
                <Outlet />
            </main>
        </div>
    );
}
