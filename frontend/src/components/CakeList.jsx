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
        'cakes': 'Торти',
        'cookies': 'Печенье',
        'sweets': 'Солодощі'
    };

    const getCategoryTitle = () => {
        if (!category) return 'МОЇ ТОРТИ';
        return categoryLabels[category]?.toUpperCase() || 'ПРОДУКЦІЯ';
    };

    const getCategorySubtitle = () => {
        if (!category) return 'Кожен торт виготовляється індивідуально з натуральних інгредієнтів найвищої якості';
        if (category === 'cakes') return 'Авторські торти ручної роботи з натуральних інгредієнтів';
        if (category === 'cookies') return 'Свіже хрустке печиво приготоване з любов\'ю';
        if (category === 'sweets') return 'Вишукані солодощі для справжніх гурманів';
        return 'Найкраща продукція з натуральних інгредієнтів';
    };

    // Filter cakes by category
    const filteredCakes = category
        ? cakes.filter(cake => cake.category === category)
        : cakes;

    return (
        <div className="min-h-screen bg-white">
            {/* Hero / Banner Section - Inspired by Vatsak */}
            <div className="relative bg-[#f5efe6] min-h-[400px] md:min-h-[500px] flex items-center overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-10 left-10 text-9xl text-gray-400">🎂</div>
                    <div className="absolute bottom-20 right-20 text-9xl text-gray-400">🍰</div>
                    <div className="absolute top-1/3 right-1/4 text-7xl text-gray-400">🧁</div>
                </div>

                <div className="container mx-auto px-6 py-16 relative z-10">
                    <div className="max-w-2xl">
                        <div className="text-sm md:text-base text-amber-700 mb-4 font-light italic" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            Для тебе
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Найсмачніші<br />
                            Торти<br />
                            <span className="text-amber-600">Ручної Роботи</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
                            Приготовані з любов'ю та душею. Кожен торт - унікальна робота авторського кондитера.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="#cakes" className="inline-block bg-[#ffd700] text-gray-900 px-8 py-4 font-bold uppercase text-sm tracking-wider hover:bg-[#ffed4e] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-center">
                                Переглянути Торти
                            </a>
                        </div>
                    </div>
                </div>

                {/* Decorative cake image overlay - optional */}
                <div className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 w-1/2 h-full opacity-20">
                    <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
                        <div className="text-[#8b4513] text-[400px] font-bold opacity-10">🍰</div>
                    </div>
                </div>
            </div>

            <div id="cakes" className="container mx-auto px-4 md:px-6 py-16 bg-white">
                {/* Category Tabs */}
                <div className="flex justify-center mb-8 gap-2 flex-wrap">
                    <Link
                        to="/cakes"
                        className={`px-6 py-3 font-bold uppercase text-sm tracking-wider transition-all ${!category ? 'bg-vatsak-red text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Всі продукти
                    </Link>
                    <Link
                        to="/cakes?category=cakes"
                        className={`px-6 py-3 font-bold uppercase text-sm tracking-wider transition-all ${category === 'cakes' ? 'bg-vatsak-red text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Торти
                    </Link>
                    <Link
                        to="/cakes?category=cookies"
                        className={`px-6 py-3 font-bold uppercase text-sm tracking-wider transition-all ${category === 'cookies' ? 'bg-vatsak-red text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Печенье
                    </Link>
                    <Link
                        to="/cakes?category=sweets"
                        className={`px-6 py-3 font-bold uppercase text-sm tracking-wider transition-all ${category === 'sweets' ? 'bg-vatsak-red text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                        Солодощі
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <div className="text-sm text-amber-700 mb-2 uppercase tracking-widest">Асортимент</div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
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
                            <div key={cake.id} className="group relative bg-white flex flex-col items-center text-center">
                                {/* Image - Clickable */}
                                <Link to={`/cakes/${cake.id}`} className="relative w-full overflow-hidden mb-4 block">
                                    {/* Discount Badge Example */}
                                    {cake.id % 3 === 0 && (
                                        <div className="absolute top-2 left-2 bg-vatsak-red text-white text-[10px] font-bold px-2 py-1 uppercase z-10">
                                            Хіт Продажу
                                        </div>
                                    )}

                                    <div className="aspect-[4/5] w-full bg-gray-50">
                                        {cake.image_url && (
                                            <img
                                                src={cake.image_url.startsWith('http') ? cake.image_url : `http://localhost:8000${cake.image_url}`}
                                                alt={cake.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                            />
                                        )}
                                    </div>

                                    {/* Quick View Overlay (Optional) */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                </Link>

                                {/* Content */}
                                <div className="w-full px-2">
                                    <Link to={`/cakes/${cake.id}`} className="block">
                                        <h3 className="text-base font-semibold text-gray-900 mb-2 uppercase tracking-wide min-h-[48px] flex items-center justify-center hover:text-vatsak-red transition-colors cursor-pointer">
                                            {cake.name}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-400 text-xs mb-3 line-clamp-2 h-8">{cake.description}</p>

                                    <div className="flex flex-col items-center gap-3 w-full">
                                        <div className="text-2xl font-bold text-vatsak-red">
                                            {cake.price} <span className="text-sm font-normal text-gray-400">грн</span>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(cake)}
                                            className="w-full py-3 bg-[#ffd700] text-gray-900 font-bold uppercase text-xs tracking-widest hover:bg-[#ffed4e] transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-lg"
                                        >
                                            Замовити
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
