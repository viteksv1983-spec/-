import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Home() {
    const [featuredCakes, setFeaturedCakes] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Fetch featured cakes (first 6)
        api.get('/cakes/')
            .then(response => {
                setFeaturedCakes(response.data.slice(0, 6));
            })
            .catch(error => {
                console.error("Error fetching featured cakes", error);
            });

        // Trigger fade-in animation
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Animation */}
            <div className="relative bg-gradient-to-br from-[#f5efe6] via-[#fff8e7] to-[#f5efe6] min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
                {/* Animated decorative elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-9xl text-vatsak-gold animate-float">🎂</div>
                    <div className="absolute bottom-20 right-20 text-9xl text-vatsak-gold animate-float-delayed">🍰</div>
                    <div className="absolute top-1/3 right-1/4 text-7xl text-vatsak-gold animate-float-slow">🧁</div>
                </div>

                {/* Animated gradient overlay */}
                <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-amber-100/20 to-transparent animate-shimmer"></div>

                <div className={`container mx-auto px-6 py-20 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="max-w-3xl">
                        <div className="text-base md:text-lg text-amber-700 mb-4 font-light italic animate-fade-in" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            Для тебе
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight uppercase animate-slide-up" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Світ Солодощів<br />
                            <span className="text-vatsak-red">
                                Кондитерський Дім
                            </span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 mb-4 max-w-2xl animate-fade-in-delayed">
                            У мене можна замовити більше 15 різновидностей тортів та багато смачненького
                        </p>
                        <p className="text-sm md:text-base text-gray-500 mb-8 italic animate-fade-in-delayed">
                            Приготовані з любов'ю та душею. Кожен торт - унікальна робота авторського кондитера.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-delayed">
                            <Link to="/cakes" className="group inline-block bg-vatsak-red text-white px-12 py-5 font-bold uppercase text-xs tracking-[0.2em] transition-all shadow-xl hover:shadow-vatsak-red/40 transform hover:-translate-y-1 hover:scale-105 duration-300">
                                <span>Каталог товарів</span>
                            </Link>
                            <Link to="/promotions" className="inline-block bg-white text-vatsak-red px-12 py-5 font-bold uppercase text-xs tracking-[0.2em] border-2 border-vatsak-red/10 hover:border-vatsak-red transition-all transform hover:-translate-y-1 duration-300">
                                Акції
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative cake image with parallax effect */}
                <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 animate-float-slow">
                        <div className="text-[#d2691e] text-[600px] font-bold opacity-40 drop-shadow-[0_10px_30px_rgba(210,105,30,0.4)]" style={{
                            filter: 'contrast(1.2) saturate(1.3)'
                        }}>🍰</div>
                    </div>
                </div>
            </div>

            {/* Product Category Cards with Staggered Animation */}
            <div className="container mx-auto px-6 py-20" id="categories">
                <div className="text-center mb-12 animate-fade-in">
                    <div className="text-sm text-amber-700 mb-2 uppercase tracking-widest">Категорії</div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        ЩО МИ ПРОПОНУЄМО
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Card 1 - Бенто */}
                    <div className="group bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in">
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-pink-100 to-amber-50 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                            <div className="text-9xl opacity-90 group-hover:scale-125 transition-transform duration-700 relative z-10">🍱</div>
                            <div className="absolute top-4 right-4 bg-vatsak-red text-white px-3 py-1 text-xs font-bold uppercase rounded-full">
                                Тренд
                            </div>
                        </div>
                        <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2 uppercase group-hover:text-vatsak-red transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                Бенто Тортики
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Маленькі тортики для важливих моментів
                            </p>
                            <Link to="/cakes?category=bento" className="inline-block bg-vatsak-red text-white px-8 py-3 font-bold uppercase text-[10px] tracking-[0.2em] shadow-lg hover:bg-[#8b0032] transition-colors rounded-xl transform hover:scale-105 duration-300">
                                Переглянути
                            </Link>
                        </div>
                    </div>

                    {/* Card 2 - Бісквітні */}
                    <div className="group bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in-delayed">
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                            <div className="text-9xl opacity-90 group-hover:scale-125 transition-transform duration-700 relative z-10">🎂</div>
                        </div>
                        <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2 uppercase group-hover:text-vatsak-red transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                Бісквітні Торти
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Класичні смаки, знайомі з дитинства
                            </p>
                            <Link to="/cakes?category=biscuit" className="inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-6 py-2 font-bold uppercase text-xs tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-300 rounded-lg">
                                Замовити
                            </Link>
                        </div>
                    </div>

                    {/* Card 3 - Весільні */}
                    <div className="group bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in-more-delayed">
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-50 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                            <div className="text-9xl opacity-90 group-hover:scale-125 transition-transform duration-700 relative z-10">💍</div>
                        </div>
                        <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2 uppercase group-hover:text-vatsak-red transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                Весільні Торти
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Вишукані торти для вашого особливого дня
                            </p>
                            <Link to="/cakes?category=wedding" className="inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-6 py-2 font-bold uppercase text-xs tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-300 rounded-lg">
                                Замовити
                            </Link>
                        </div>
                    </div>

                    {/* Card 4 - Мусові */}
                    <div className="group bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in">
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-red-100 to-pink-50 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                            <div className="text-9xl opacity-90 group-hover:scale-125 transition-transform duration-700 relative z-10">🍮</div>
                        </div>
                        <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2 uppercase group-hover:text-vatsak-red transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                Мусові Торти
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Сучасні десерти з дзеркальною глазур'ю
                            </p>
                            <Link to="/cakes?category=mousse" className="inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-6 py-2 font-bold uppercase text-xs tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-300 rounded-lg">
                                Замовити
                            </Link>
                        </div>
                    </div>

                    {/* Card 5 - Капкейки */}
                    <div className="group bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in-delayed">
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-100 to-indigo-50 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                            <div className="text-9xl opacity-90 group-hover:scale-125 transition-transform duration-700 relative z-10">🧁</div>
                        </div>
                        <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2 uppercase group-hover:text-vatsak-red transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                Капкейки
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Порційні десерти для будь-якої події
                            </p>
                            <Link to="/cakes?category=cupcakes" className="inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-6 py-2 font-bold uppercase text-xs tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-300 rounded-lg">
                                Замовити
                            </Link>
                        </div>
                    </div>

                    {/* Card 6 - Пряники */}
                    <div className="group bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in-more-delayed">
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                            <div className="text-9xl opacity-90 group-hover:scale-125 transition-transform duration-700 relative z-10">🍪</div>
                        </div>
                        <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2 uppercase group-hover:text-vatsak-red transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                Імбирні Пряники
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Ароматні подарунки з ручним розписом
                            </p>
                            <Link to="/cakes?category=gingerbread" className="inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-6 py-2 font-bold uppercase text-xs tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-300 rounded-lg">
                                Замовити
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Impact Section - Vatsak Style */}
            <div className="relative bg-white py-24 overflow-hidden">
                {/* Decorative product images with floating emojis */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Top Left - Cake slice */}
                    <div className="absolute top-12 left-8 md:left-20 transform -rotate-12 animate-float">
                        <div className="text-9xl md:text-[180px] opacity-70 drop-shadow-[0_8px_20px_rgba(0,0,0,0.2)]" style={{ filter: 'contrast(1.3) saturate(1.4) brightness(1.1)' }}>🍰</div>
                    </div>

                    {/* Top Right - Orange slices */}
                    <div className="absolute top-16 right-8 md:right-24 transform rotate-12 animate-float-delayed">
                        <div className="text-7xl md:text-[120px] opacity-75 drop-shadow-[0_8px_20px_rgba(0,0,0,0.2)]" style={{ filter: 'contrast(1.3) saturate(1.5) brightness(1.1)' }}>🍊</div>
                    </div>

                    {/* Bottom Right - Chocolate truffles */}
                    <div className="absolute bottom-20 right-12 md:right-32 transform rotate-6 animate-float-slow">
                        <div className="text-8xl md:text-[150px] opacity-70 drop-shadow-[0_8px_20px_rgba(0,0,0,0.25)]" style={{ filter: 'contrast(1.3) saturate(1.4) brightness(1.05)' }}>🍫</div>
                    </div>

                    {/* Bottom Left - Berries */}
                    <div className="absolute bottom-24 left-12 md:left-28 transform -rotate-6 animate-float">
                        <div className="text-7xl md:text-[100px] opacity-75 drop-shadow-[0_8px_20px_rgba(0,0,0,0.2)]" style={{ filter: 'contrast(1.3) saturate(1.6) brightness(1.1)' }}>🍓</div>
                    </div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            <span className="text-[#ffd700] drop-shadow-[0_4px_12px_rgba(255,215,0,0.5)] animate-pulse-slow">
                                Смак
                            </span>
                            <span className="text-gray-800">, </span>
                            <span className="text-[#ffd700] drop-shadow-[0_4px_12px_rgba(255,215,0,0.5)] animate-pulse-slow" style={{ animationDelay: '0.2s' }}>
                                Якість
                            </span>
                            <br className="hidden md:block" />
                            <span className="text-gray-800"> і </span>
                            <span className="text-[#ffd700] drop-shadow-[0_4px_12px_rgba(255,215,0,0.5)] animate-pulse-slow" style={{ animationDelay: '0.4s' }}>
                                Ціна
                            </span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-700 italic" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            це наші головні цінності
                        </p>
                    </div>
                </div>
            </div>

            {/* About Section with Parallax */}
            <div className="relative bg-gradient-to-br from-[#f5efe6] via-[#fff8e7] to-[#f5efe6] py-20 overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-20 text-6xl">🌿</div>
                    <div className="absolute bottom-20 right-20 text-6xl">✨</div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-xl md:text-2xl text-gray-800 font-bold mb-8 leading-relaxed animate-fade-in" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Я створюю торти з любов'ю та увагою до кожної деталі. Кожен торт виготовляється індивідуально з натуральних інгредієнтів найвищої якості.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div className="group flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105">
                                <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">✨</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Ручна робота</h4>
                                    <p className="text-gray-600 text-sm">Кожен торт виготовляється вручну з особливою увагою до деталей</p>
                                </div>
                            </div>
                            <div className="group flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105">
                                <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">🌿</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Натуральні інгредієнти</h4>
                                    <p className="text-gray-600 text-sm">Використовую тільки якісні та свіжі продукти</p>
                                </div>
                            </div>
                            <div className="group flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105">
                                <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">💝</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Індивідуальний підхід</h4>
                                    <p className="text-gray-600 text-sm">Враховую всі ваші побажання та особливі запити</p>
                                </div>
                            </div>
                            <div className="group flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105">
                                <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">⏰</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Свіжість щодня</h4>
                                    <p className="text-gray-600 text-sm">Готую торти безпосередньо перед доставкою</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            {featuredCakes.length > 0 && (
                <div className="container mx-auto px-6 py-20">
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="text-sm text-amber-700 mb-2 uppercase tracking-widest">Популярні</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Обирають найчастіше
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                        {featuredCakes.map((cake, index) => (
                            <div
                                key={cake.id}
                                className="group relative bg-white flex flex-col rounded-[2rem] shadow-[0_5px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(123,0,44,0.08)] transition-all duration-500 border border-gray-50 overflow-hidden h-full animate-fade-in-stagger"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Image Container - Unified */}
                                <Link to={`/cakes/${cake.id}`} className="relative block overflow-hidden">
                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
                                        {index === 0 && (
                                            <div className="bg-vatsak-red text-white text-[8px] font-bold px-2 py-1 uppercase rounded-full shadow-md tracking-widest">
                                                Хіт
                                            </div>
                                        )}
                                    </div>

                                    <div className="aspect-square w-full p-6 flex items-center justify-center">
                                        {cake.image_url && (
                                            <img
                                                src={cake.image_url.startsWith('http') ? cake.image_url : `http://localhost:8000${cake.image_url}`}
                                                alt={cake.name}
                                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                        )}
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent z-[5]"></div>
                                </Link>

                                {/* Content */}
                                <div className="flex flex-col flex-grow p-5 pt-0 text-center relative z-10">
                                    <Link to={`/cakes/${cake.id}`} className="mb-2 block group-hover:translate-y-[-1px] transition-transform duration-300">
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight leading-tight line-clamp-2 min-h-[2.5rem] hover:text-vatsak-red transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                            {cake.name}
                                        </h3>
                                    </Link>

                                    {/* Weight Info */}
                                    {cake.weight && (
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-3">
                                            Вага: {Math.round(cake.weight)}г
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-xl font-black text-vatsak-red flex items-baseline gap-0.5">
                                            {cake.price} <span className="text-[10px] font-medium text-gray-400 uppercase">грн</span>
                                        </div>

                                        <button
                                            className="w-8 h-8 bg-vatsak-red text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#8b0032] transition-all transform active:scale-90"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                alert(`${cake.name} додано в кошик!`);
                                            }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="mt-auto">
                                        <button
                                            className="w-full py-2 bg-[#ffd700] text-gray-900 font-bold uppercase text-[9px] tracking-[0.1em] rounded-xl hover:bg-[#ffed4e] transition-all duration-300"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                alert('Функція швидкого замовлення в розробці');
                                            }}
                                        >
                                            В 1 клік
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12 animate-fade-in-delayed">
                        <Link to="/cakes" className="group inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-12 py-5 font-bold uppercase text-sm tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 duration-300">
                            <span className="flex items-center justify-center gap-2">
                                Всі пропозиції
                                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Call to Action Banner */}
            <div className="relative bg-gradient-to-r from-vatsak-red via-red-700 to-vatsak-red text-white py-16 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 text-6xl animate-float">🎉</div>
                    <div className="absolute bottom-10 right-10 text-6xl animate-float-delayed">🎊</div>
                </div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        ГОТОВІ ЗАМОВИТИ ТОРТ МРІЇ?
                    </h3>
                    <p className="text-lg mb-8 opacity-90 animate-fade-in-delayed">
                        Зв'яжіться з нами або оберіть торт з каталогу
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delayed">
                        <a href="tel:0979081504" className="inline-block bg-white text-vatsak-red px-10 py-4 font-bold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all shadow-lg transform hover:scale-105">
                            📞 Телефонувати
                        </a>
                        <Link to="/cakes" className="inline-block bg-[#ffd700] text-gray-900 px-10 py-4 font-bold uppercase text-sm tracking-wider hover:bg-[#ffed4e] transition-all shadow-lg transform hover:scale-105">
                            Обрати Торт
                        </Link>
                    </div>
                </div>
            </div>

            {/* Add custom CSS for animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-30px); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(5deg); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fade-in-delayed {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }

                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
                .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
                .animate-shimmer { animation: shimmer 3s infinite; background-size: 200% 100%; }
                .animate-fade-in { animation: fade-in 1s ease-out; }
                .animate-fade-in-delayed { animation: fade-in-delayed 1s ease-out 0.3s both; }
                .animate-slide-up { animation: slide-up 0.8s ease-out; }
                .animate-scale-in { animation: scale-in 0.6s ease-out; }
                .animate-scale-in-delayed { animation: scale-in 0.6s ease-out 0.2s both; }
                .animate-scale-in-more-delayed { animation: scale-in 0.6s ease-out 0.4s both; }
                .animate-fade-in-stagger { animation: fade-in 0.6s ease-out both; }
                .animate-gradient { 
                    background-size: 200% auto;
                    animation: gradient 3s ease infinite;
                }
                .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
            `}</style>
        </div>
    );
}

export default Home;
