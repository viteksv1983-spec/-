import React, { useEffect, useState, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';

function CakeList() {
    const [cakes, setCakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');

    useEffect(() => {
        api.get('/cakes/')
            .then(response => {
                setCakes(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("There was an error details fetching the cakes!", error);
                setLoading(false);
            });
    }, []);

    const handleAddToCart = (cake) => {
        addToCart(cake);
        // Optional: Show toast notification
        alert(`${cake.name} додано в кошик!`);
    };

    // Category labels
    const categoryLabels = {
        'bento': 'Бенто тортики',
        'biscuit': 'Бісквітні торти',
        'wedding': 'Весільні торти',
        'mousse': 'Мусові торти',
        'cupcakes': 'Капкейки',
        'gingerbread': 'Імбирні пряники'
    };

    const getCategoryTitle = () => {
        if (!category) return 'ВСЯ КОЛЕКЦІЯ';
        return categoryLabels[category]?.toUpperCase() || 'ПРОДУКЦІЯ';
    };

    const getCategorySubtitle = () => {
        if (!category) return 'Оберіть категорію, щоб знайти ідеальний десерт';
        if (category === 'bento') return 'Маленькі тортики для великих емоцій';
        if (category === 'biscuit') return 'Класичні бісквітні торти з ніжними начинками';
        if (category === 'wedding') return 'Розкішні торти для вашого особливого дня';
        if (category === 'mousse') return 'Сучасні мусові десерти з вишуканим декором';
        if (category === 'cupcakes') return 'Порційні десерти, які зручно взяти з собою';
        if (category === 'gingerbread') return 'Ароматні пряники ручної роботи';
        return 'Найкраща продукція з натуральних інгредієнтів';
    };

    // Filter cakes by category
    const filteredCakes = category
        ? cakes.filter(cake => cake.category === category)
        : cakes;

    return (
        <div className="min-h-screen bg-white">

            <div id="cakes" className="container mx-auto px-4 md:px-6 py-16 bg-white">
                {/* Category Tabs */}
                <div className="flex justify-center mb-8 gap-2 flex-wrap">
                    <Link
                        to="/cakes"
                        className={`px-4 py-2 md:px-6 md:py-3 font-bold uppercase text-xs md:text-sm tracking-wider transition-all rounded-full mb-2 ${!category ? 'bg-vatsak-red text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Всі
                    </Link>
                    <Link
                        to="/cakes?category=bento"
                        className={`px-4 py-2 md:px-6 md:py-3 font-bold uppercase text-xs md:text-sm tracking-wider transition-all rounded-full mb-2 ${category === 'bento' ? 'bg-vatsak-red text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Бенто
                    </Link>
                    <Link
                        to="/cakes?category=biscuit"
                        className={`px-4 py-2 md:px-6 md:py-3 font-bold uppercase text-xs md:text-sm tracking-wider transition-all rounded-full mb-2 ${category === 'biscuit' ? 'bg-vatsak-red text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Бісквітні
                    </Link>
                    <Link
                        to="/cakes?category=wedding"
                        className={`px-4 py-2 md:px-6 md:py-3 font-bold uppercase text-xs md:text-sm tracking-wider transition-all rounded-full mb-2 ${category === 'wedding' ? 'bg-vatsak-red text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Весільні
                    </Link>
                    <Link
                        to="/cakes?category=mousse"
                        className={`px-4 py-2 md:px-6 md:py-3 font-bold uppercase text-xs md:text-sm tracking-wider transition-all rounded-full mb-2 ${category === 'mousse' ? 'bg-vatsak-red text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Мусові
                    </Link>
                    <Link
                        to="/cakes?category=cupcakes"
                        className={`px-4 py-2 md:px-6 md:py-3 font-bold uppercase text-xs md:text-sm tracking-wider transition-all rounded-full mb-2 ${category === 'cupcakes' ? 'bg-vatsak-red text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Капкейки
                    </Link>
                    <Link
                        to="/cakes?category=gingerbread"
                        className={`px-4 py-2 md:px-6 md:py-3 font-bold uppercase text-xs md:text-sm tracking-wider transition-all rounded-full mb-2 ${category === 'gingerbread' ? 'bg-vatsak-red text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Пряники
                    </Link>
                </div>

                <div className="text-center mb-12 animate-fade-in">
                    <div className="text-sm font-bold text-vatsak-gold mb-2 uppercase tracking-[0.3em]">Асортимент</div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        {getCategoryTitle()}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {getCategorySubtitle()}
                    </p>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredCakes.map((cake) => (
                            <div key={cake.id} className="group relative bg-white flex flex-col rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(123,0,44,0.1)] transition-all duration-500 border border-gray-50 overflow-hidden h-full">
                                {/* Image Container - Unified bg */}
                                <Link to={`/cakes/${cake.id}`} className="relative block overflow-hidden">
                                    {/* Badges */}
                                    <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                                        {cake.id % 3 === 0 && (
                                            <div className="bg-vatsak-red text-white text-[10px] font-bold px-3 py-1.5 uppercase rounded-full shadow-lg tracking-widest">
                                                Хіт
                                            </div>
                                        )}
                                    </div>

                                    <div className="aspect-square w-full flex items-center justify-center p-6">
                                        {cake.image_url && (
                                            <img
                                                src={cake.image_url.startsWith('http') ? cake.image_url : `http://localhost:8000${cake.image_url}`}
                                                alt={cake.name}
                                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                        )}
                                    </div>
                                    {/* Subtle Gradient Shadow instead of box */}
                                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent z-[5] pointer-events-none"></div>
                                </Link>

                                {/* Content - Integrated with Image */}
                                <div className="flex flex-col flex-grow p-8 pt-0 text-center relative z-10">
                                    <Link to={`/cakes/${cake.id}`} className="mb-2 block group-hover:translate-y-[-2px] transition-transform duration-300">
                                        <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight leading-tight line-clamp-2 min-h-[3.5rem] hover:text-vatsak-red transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                            {cake.name}
                                        </h3>
                                    </Link>

                                    {/* Weight Info - Integrated below title */}
                                    {cake.weight && (
                                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                                            Вага: {Math.round(cake.weight)} г
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="text-3xl font-black text-vatsak-red flex items-baseline gap-1">
                                            {cake.price} <span className="text-sm font-medium text-gray-400 uppercase">грн</span>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(cake)}
                                            className="w-12 h-12 bg-vatsak-red text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#8b0032] transition-all transform active:scale-90 hover:shadow-vatsak-red/30"
                                            title="Додати у кошик"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="mt-auto">
                                        <button
                                            onClick={() => alert('Функція швидкого замовлення в розробці')}
                                            className="w-full py-4 bg-[#ffd700] text-gray-900 font-bold uppercase text-[11px] tracking-[0.2em] rounded-2xl hover:bg-[#ffed4e] transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 transform active:scale-[0.98]"
                                        >
                                            Замовити в 1 клік
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CakeList;
