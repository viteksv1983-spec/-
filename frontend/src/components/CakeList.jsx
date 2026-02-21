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
        <div className="min-h-screen bg-white">
            {/* Subtle Top Gradient for Luxury Feel */}
            <div className="h-40 bg-gradient-to-b from-[#FDFBF7] to-white pointer-events-none absolute inset-x-0 top-0"></div>

            <div id="cakes" className="container mx-auto px-4 md:px-8 pt-10 md:pt-20 pb-20 relative z-10">
                <div className="text-center mb-10 md:mb-16 animate-fade-in">
                    <div className="text-[#7A0019] text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-3">CONFECTIONERY MASTERPIECE</div>
                    <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 uppercase tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        {getCategoryTitle()}
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-[1px] w-8 md:w-12 bg-gray-200"></div>
                        <p className="text-gray-500 text-sm md:text-lg font-medium italic" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            {getCategorySubtitle()}
                        </p>
                        <div className="h-[1px] w-8 md:w-12 bg-gray-200"></div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-16 h-16 border-4 border-[#7A0019]/10 border-t-[#7A0019] rounded-full animate-spin mb-6"></div>
                        <div className="text-[#7A0019] font-bold uppercase tracking-widest text-xs">Вишукуємо для вас найкраще...</div>
                    </div>
                ) : filteredCakes.length === 0 ? (
                    <div className="text-center py-32 bg-[#FDFBF7] rounded-[3rem] border border-gray-50">
                        <div className="text-6xl mb-6 opacity-30">🧁</div>
                        <p className="text-gray-400 text-lg font-medium">На даний момент у цій категорії немає шедеврів.</p>
                        <Link to="/cakes" className="inline-block mt-8 text-[#7A0019] font-bold uppercase tracking-widest text-xs border-b-2 border-[#7A0019] pb-1 hover:text-[#9C142B] hover:border-[#9C142B] transition-all">
                            Переглянути весь каталог
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
                        {filteredCakes.map((cake) => (
                            <div key={cake.id} className="group flex flex-col bg-white rounded-[2rem] shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all duration-500 border border-gray-100 p-5 md:p-6 pb-6 md:pb-8 h-full">

                                {/* Image Container */}
                                <Link to={`/cakes/${cake.id}`} className="relative w-full aspect-square mb-4 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[#f8f5f2] rounded-full scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="w-full h-full flex items-center justify-center relative z-10 p-2">
                                        {cake.image_url && (
                                            <img
                                                src={cake.image_url.startsWith('http') ? cake.image_url : `${api.defaults.baseURL}${cake.image_url}`}
                                                alt={cake.name}
                                                className="w-full h-full object-contain drop-shadow-xl transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )}
                                    </div>
                                </Link>

                                {/* Content Section */}
                                <div className="flex flex-col flex-grow text-center items-center justify-between">
                                    <div className="w-full">
                                        <Link to={`/cakes/${cake.id}`}>
                                            <h3 className="text-[14px] md:text-[16px] font-black text-[#2e1a22] uppercase tracking-wide leading-snug line-clamp-2 min-h-[2.5rem] group-hover:text-[#7b2c3d] transition-colors duration-300">
                                                {cake.name}
                                            </h3>
                                        </Link>
                                    </div>

                                    {/* Price & Action Section */}
                                    <div className="w-full flex-col flex items-center mt-3">
                                        <div className="text-[22px] md:text-[26px] font-black text-[#4a1c28] flex items-baseline justify-center mb-4 leading-none">
                                            {cake.price} <span className="text-[12px] md:text-[14px] font-bold text-gray-500 ml-1.5 uppercase">грн</span>
                                        </div>

                                        <div className="flex items-center gap-2 w-full justify-center">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleQuickOrder(cake);
                                                }}
                                                className="flex-1 h-10 md:h-12 bg-[#6A1A24] hover:bg-[#8B2332] text-white font-bold uppercase tracking-wider text-[9px] md:text-[11px] rounded-[10px] md:rounded-xl transition-all duration-300 active:scale-95"
                                            >
                                                Швидке замовлення
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleAddToCart(cake);
                                                }}
                                                className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-[#E8C064] hover:bg-[#F2D078] text-[#4a1c28] rounded-[10px] md:rounded-xl flex items-center justify-center transition-all active:scale-95 group/cart"
                                            >
                                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal remains the same connection-wise */}
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
