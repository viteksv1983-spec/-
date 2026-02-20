import React, { useEffect, useState, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import QuickOrderModal from './QuickOrderModal';

function CakeList() {
    const [cakes, setCakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
    const [selectedCakeForQuickOrder, setSelectedCakeForQuickOrder] = useState(null);
    const { addToCart } = useContext(CartContext);
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const searchQuery = searchParams.get('search');



    useEffect(() => {
        setLoading(true);
        api.get('/cakes/', { params: { category } })
            .then(response => {
                setCakes(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error details fetching the cakes!", error);
                setLoading(false);
            });
    }, [category]);

    const handleAddToCart = (cake) => {
        addToCart(cake);
        // Optional: Show toast notification
        alert(`${cake.name} додано в кошик!`);
    };

    // Category labels
    const categoryLabels = {
        'bento': 'Торти бенто',
        'biscuit': 'Бісквітні торти',
        'wedding': 'Весільні торти',
        'mousse': 'Мусові торти',
        'cupcakes': 'Капкейки',
        'gingerbread': 'Імбирні пряники'
    };

    const getCategorySubtitle = () => {
        if (searchQuery) return `Результати пошуку для: "${searchQuery}"`;
        if (!category) return 'Оберіть категорію, щоб знайти ідеальний десерт';
        if (category === 'bento') return 'Маленькі бенто торти для великих емоцій';
        if (category === 'biscuit') return 'Класичні бісквітні торти з ніжними начинками';
        if (category === 'wedding') return 'Розкішні торти для вашого особливого дня';
        if (category === 'mousse') return 'Сучасні мусові десерти з вишуканим декором';
        if (category === 'cupcakes') return 'Порційні десерти, які зручно взяти з собою';
        if (category === 'gingerbread') return 'Ароматні пряники ручної роботи';
        return 'Найкраща продукція з натуральних інгредієнтів';
    };

    const getCategoryTitle = () => {
        if (searchQuery) return 'ПОШУК ТОРТІВ';
        if (!category) return 'ВСЯ КОЛЕКЦІЯ';
        return categoryLabels[category]?.toUpperCase() || 'ПРОДУКЦІЯ';
    };

    const getFilteredCakes = () => {
        if (!searchQuery) return cakes;

        const query = searchQuery.toLowerCase().trim();
        return cakes.filter(cake =>
            cake.name.toLowerCase().includes(query) ||
            (cake.description && cake.description.toLowerCase().includes(query)) ||
            (cake.category && cake.category.toLowerCase().includes(query))
        );
    };

    const filteredCakes = getFilteredCakes();

    const handleQuickOrder = (cake) => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        const defaultDate = date.toISOString().split('T')[0];

        setSelectedCakeForQuickOrder({
            ...cake,
            deliveryDate: defaultDate,
            deliveryMethod: 'pickup'
        });
        setIsQuickOrderOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#F9F4EE]">

            <div id="cakes" className="container mx-auto px-4 md:px-6 pt-6 md:pt-16 pb-16 bg-white shadow-sm">


                <div className="text-center mb-6 md:mb-12 animate-fade-in">
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 md:mb-4 uppercase tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        {getCategoryTitle()}
                    </h2>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="text-gray-400">Завантаження тортів...</div>
                        </div>
                    </div>
                ) : filteredCakes.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">На даний момент продуктів не знайдено в цій категорії.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                        {filteredCakes.map((cake) => (
                            <div key={cake.id} className="group relative bg-white flex flex-col rounded-[2rem] md:rounded-[2.5rem] shadow-md hover:shadow-2xl hover:shadow-amber-900/15 transition-all duration-500 border border-gray-100 overflow-hidden h-full">
                                {/* Title & Badge - Top position for Mobile Optimization */}
                                <div className="p-2 md:p-6 pb-1 md:pb-2 text-center relative z-10">
                                    <Link to={`/cakes/${cake.id}`} className="block">
                                        <h3 className="text-[10px] md:text-lg font-bold text-gray-800 uppercase tracking-tight leading-tight line-clamp-2 min-h-[1.5rem] md:min-h-[3rem] group-hover:text-vatsak-red transition-colors duration-300" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                            {cake.name}
                                        </h3>
                                    </Link>
                                </div>

                                {/* Image Container - Unified bg */}
                                <Link to={`/cakes/${cake.id}`} className="relative block overflow-hidden mx-2 md:mx-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-50 aspect-square mt-0.5">
                                    {/* Badges - Circular maroon style */}
                                    <div className="absolute top-2 left-2 flex flex-col gap-2 z-10 pointer-events-none">
                                        {cake.id % 3 === 0 && (
                                            <div className="bg-[#7b002c] text-white text-[7px] md:text-[10px] font-black uppercase w-7 h-7 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white tracking-tighter">
                                                Хіт
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        className="absolute top-1 right-1 z-10 p-1.5 text-[#ffcc00] hover:text-[#ffdb4d] transition-all duration-300 group/wishlist"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // TODO: Wishlist logic
                                        }}
                                    >
                                        <svg className="w-4 h-4 md:w-6 md:h-6 transition-transform group-hover/wishlist:scale-110" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>

                                    <div className="w-full h-full flex items-center justify-center p-0 group-hover:p-0 transition-all duration-500 ease-in-out">
                                        {cake.image_url && (
                                            <img
                                                src={cake.image_url.startsWith('http') ? cake.image_url : `${api.defaults.baseURL}${cake.image_url}`}
                                                alt={cake.name}
                                                className="w-full h-full object-contain group-hover:scale-125 transition-transform duration-700 ease-out"
                                            />
                                        )}
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/20 to-transparent z-[5] pointer-events-none"></div>
                                </Link>

                                {/* Bottom Content - Ratings, Weight, Price */}
                                <div className="flex flex-col flex-grow p-2.5 md:p-6 pt-2 md:pt-4 text-center relative z-10">

                                    {/* Ratings & Reviews */}
                                    <div className="flex items-center justify-center gap-1 mb-1.5 md:mb-3">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-2.5 h-2.5 md:w-4 md:h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="text-[8px] md:text-xs font-semibold text-gray-400">{(cake.id * 17) % 50 + 8}</span>
                                    </div>

                                    {/* Weight Info */}
                                    <div className="mb-2 md:mb-4">
                                        <div className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-tight mb-0.5">
                                            {Math.round(cake.weight || 450)}г
                                        </div>
                                        <div className="flex items-center justify-center gap-1 md:gap-1.5 opacity-80">
                                            <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                            <span className="text-[7px] md:text-[8px] font-bold text-green-600 uppercase tracking-widest whitespace-nowrap">Можливе замовлення</span>
                                        </div>
                                    </div>

                                    {/* Price & Buttons */}
                                    <div className="mt-auto flex items-center justify-between gap-1 md:gap-3">
                                        <div className="text-[14px] md:text-2xl font-bold text-gray-900 flex items-baseline">
                                            {cake.price} <span className="text-[8px] md:text-sm font-normal text-gray-500 ml-0.5">₴</span>
                                        </div>

                                        <div className="flex items-center gap-1 md:gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleQuickOrder(cake);
                                                }}
                                                className="px-2 md:px-4 py-1.5 md:py-2 text-[7px] md:text-xs font-black uppercase tracking-widest text-[#495057] bg-[#f8f9fa] border border-[#dee2e6] rounded-lg md:rounded-xl hover:bg-[#e9ecef] transition-all active:scale-95 whitespace-nowrap"
                                            >
                                                1 Клік
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleAddToCart(cake);
                                                }}
                                                className="w-7 h-7 md:w-11 md:h-11 bg-[#ffcc00] text-gray-900 rounded-lg md:rounded-xl flex items-center justify-center hover:bg-[#ffdb4d] transition-all shadow-md active:scale-95 group/cart"
                                            >
                                                <svg className="w-4 h-4 md:w-6 md:h-6 transition-transform group-hover/cart:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <QuickOrderModal
                    isOpen={isQuickOrderOpen}
                    onClose={() => setIsQuickOrderOpen(false)}
                    cake={selectedCakeForQuickOrder}
                    deliveryDate={selectedCakeForQuickOrder?.deliveryDate}
                    deliveryMethod={selectedCakeForQuickOrder?.deliveryMethod}
                />
            </div>
        </div>
    );
}

export default CakeList;
