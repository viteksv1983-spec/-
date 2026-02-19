import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import logo from '../assets/logo.png';
import { CartContext } from '../context/CartContext';
import QuickOrderModal from './QuickOrderModal';
import bannerImg from '../assets/hero-banner.jpg.png';

function Home() {
    const { addToCart } = useContext(CartContext);
    const [featuredCakes, setFeaturedCakes] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
    const [selectedCakeForQuickOrder, setSelectedCakeForQuickOrder] = useState(null);

    // Filter functions for buttons (mapped to categories)
    const handleQuickOrderDefault = () => {
        // Find first cake for quick order if none selected
        if (featuredCakes.length > 0) {
            handleQuickOrder(featuredCakes[0]);
        } else {
            // Fallback: search for a generic cake or open modal with placeholder
            setIsQuickOrderOpen(true);
        }
    };

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

    useEffect(() => {
        // Fetch featured cakes (first 4)
        api.get('/cakes/')
            .then(response => {
                setFeaturedCakes(response.data.slice(0, 4));
            })
            .catch(error => {
                console.error("Error fetching featured cakes", error);
            });

        // Trigger fade-in animation
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFCF9]">
            {/* Premium Hero Section - Refined 2026 */}
            <div className="w-full pt-6 md:pt-10 mb-10 px-4 md:px-8">
                <div className="mx-auto max-w-[1400px] relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] shadow-[0_40px_80px_rgba(0,0,0,0.3)] bg-gradient-to-br from-[#380202] via-[#5a0020] to-[#380202]">
                    {/* Soft Light Highlight on the right */}
                    <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none blur-3xl"></div>

                    <div className="container mx-auto px-8 md:px-20 py-14 md:py-24 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
                            {/* Left Text Block */}
                            <div className="lg:w-1/2 text-center lg:text-left animate-fade-in">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-5 tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                    Торти на замовлення <br />
                                    в Києві —
                                </h1>
                                <div className="text-[#F2B705] text-2xl md:text-3xl font-bold mb-8 tracking-wider uppercase italic drop-shadow-sm" style={{ fontFamily: "'Dancing Script', cursive" }}>
                                    Кондитерська майстерня Antreme
                                </div>
                                <p className="text-pink-50 text-base md:text-lg mb-12 leading-relaxed max-w-lg mx-auto lg:mx-0 opacity-80 font-light">
                                    Авторські торти ручної роботи з натуральних інгредієнтів. <br />
                                    Створюємо індивідуальний дизайн для вашого свята. <br />
                                    Доставка по Києву в день замовлення.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                                    <button
                                        onClick={handleQuickOrderDefault}
                                        className="px-12 py-5 bg-[#F2B705] hover:bg-[#ffcc00] text-gray-950 font-black uppercase tracking-widest text-sm rounded-[50px] transition-all shadow-[0_10px_30px_rgba(242,183,5,0.3)] hover:shadow-[0_15px_40px_rgba(242,183,5,0.5)] transform hover:-translate-y-1 active:scale-95"
                                    >
                                        Замовити торт
                                    </button>
                                    <Link
                                        to="/cakes"
                                        className="px-12 py-5 bg-[#7b002c] hover:bg-[#8b0033] text-white font-bold uppercase tracking-widest text-sm rounded-[50px] transition-all shadow-[0_10px_30px_rgba(123,0,44,0.3)] hover:shadow-[0_15px_40px_rgba(123,0,44,0.5)] transform hover:-translate-y-1 active:scale-95 border border-white/5"
                                    >
                                        Переглянути каталог
                                    </Link>
                                </div>
                            </div>

                            {/* Right Image Block */}
                            <div className="lg:w-1/2 relative animate-fade-in-delayed flex justify-center">
                                <div className="relative group max-w-[650px] w-full">
                                    {/* Light Glow behind the cake */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-[#F2B705]/15 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#F2B705]/25 transition duration-1000"></div>

                                    <img
                                        src={new URL('../assets/cake-optimized-1600.webp', import.meta.url).href}
                                        alt="Преміальний торт Antreme"
                                        className="w-full h-auto drop-shadow-[0_35px_50px_rgba(0,0,0,0.6)] transform transition-all duration-700 hover:scale-110 relative z-10"
                                        style={{ filter: 'contrast(1.03) saturate(1.05)' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = bannerImg;
                                            e.target.className = "w-full h-full object-cover rounded-3xl opacity-40 grayscale";
                                        }}
                                    />

                                    {/* Soft bottom shadow for the cake */}
                                    <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-3/4 h-[40px] bg-black/40 rounded-[100%] blur-2xl pointer-events-none"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Category Cards with Staggered Animation */}
            <div className="container mx-auto px-6 py-10 bg-white" id="categories">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Card 1 - Бенто */}
                    <div className="group bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in">
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-pink-100 to-amber-50 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                            <div className="text-9xl opacity-90 group-hover:scale-125 transition-transform duration-700 relative z-10">🍥</div>
                            <div className="absolute top-4 right-4 bg-vatsak-red text-white px-3 py-1 text-xs font-bold uppercase rounded-full">
                                Тренд
                            </div>
                        </div>
                        <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2 uppercase group-hover:text-vatsak-red transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                БЕНТО ТОРТИ
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Маленькі бенто торти для важливих моментів
                            </p>
                            <Link to="/cakes?category=bento" className="inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-8 py-3 font-bold uppercase text-xs tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-300 rounded-lg">
                                Замовити
                            </Link>
                        </div>
                    </div>

                    {/* Card 2 - Бісквітні */}
                    <div className="group bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in-delayed">
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                            <div className="text-9xl opacity-90 group-hover:scale-125 transition-transform duration-700 relative z-10">🍰</div>
                        </div>
                        <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2 uppercase group-hover:text-vatsak-red transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                Бісквітні Торти
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Класичні смаки, знайомі з дитинства
                            </p>
                            <Link to="/cakes?category=biscuit" className="inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-8 py-3 font-bold uppercase text-xs tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-300 rounded-lg">
                                Замовити
                            </Link>
                        </div>
                    </div>

                    {/* Card 3 - Весільні */}
                    <div className="group bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in-more-delayed">
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-50 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                            <div className="text-9xl opacity-90 group-hover:scale-125 transition-transform duration-700 relative z-10">🎂</div>
                        </div>
                        <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2 uppercase group-hover:text-vatsak-red transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                Весільні Торти
                            </h3>
                            <p className="text-gray-600 mb-6 text-sm">
                                Вишукані торти для вашого особливого дня
                            </p>
                            <Link to="/cakes?category=wedding" className="inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-8 py-3 font-bold uppercase text-xs tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-300 rounded-lg">
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
                            <Link to="/cakes?category=mousse" className="inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-8 py-3 font-bold uppercase text-xs tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-300 rounded-lg">
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
                            <Link to="/cakes?category=cupcakes" className="inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-8 py-3 font-bold uppercase text-xs tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-300 rounded-lg">
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
                            <Link to="/cakes?category=gingerbread" className="inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-8 py-3 font-bold uppercase text-xs tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-300 rounded-lg">
                                Замовити
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Impact Section - Vatsak Style - Boxed and Shrunk */}
            <div className="container mx-auto px-4 md:px-6 mb-16 bg-white">
                <div className="relative bg-[#fCf9f5] py-12 overflow-hidden rounded-[2.5rem] shadow-sm border border-orange-50/50">
                    {/* Decorative product images with floating emojis - Scaled down */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                        {/* Top Left - Cake slice */}
                        <div className="absolute top-4 left-10 md:left-40 transform -rotate-12 animate-float">
                            <div className="text-6xl md:text-8xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)]" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>🍰</div>
                        </div>

                        {/* Top Right - Orange slices */}
                        <div className="absolute top-4 right-10 md:right-48 transform rotate-12 animate-float-delayed">
                            <div className="text-5xl md:text-6xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)]" style={{ filter: 'contrast(1.2) saturate(1.4)' }}>🍊</div>
                        </div>

                        {/* Bottom Right - Chocolate truffles */}
                        <div className="absolute bottom-6 right-8 md:right-52 transform rotate-6 animate-float-slow">
                            <div className="text-6xl md:text-7xl drop-shadow-[0_6px_15px_rgba(0,0,0,0.15)]" style={{ filter: 'contrast(1.2) saturate(1.3)' }}>🍫</div>
                        </div>

                        {/* Bottom Left - Berries */}
                        <div className="absolute bottom-8 left-8 md:left-56 transform -rotate-6 animate-float">
                            <div className="text-5xl md:text-6xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)]" style={{ filter: 'contrast(1.2) saturate(1.5)' }}>🍓</div>
                        </div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                <span className="text-vatsak-gold drop-shadow-[0_2px_8px_rgba(255,215,0,0.3)] animate-pulse-slow">
                                    Смак
                                </span>
                                <span className="text-gray-800">, </span>
                                <span className="text-vatsak-gold drop-shadow-[0_2px_8px_rgba(255,215,0,0.3)] animate-pulse-slow" style={{ animationDelay: '0.2s' }}>
                                    Якість
                                </span>
                                <br className="hidden md:block" />
                                <span className="text-gray-800"> і </span>
                                <span className="text-vatsak-gold drop-shadow-[0_2px_8px_rgba(255,215,0,0.3)] animate-pulse-slow" style={{ animationDelay: '0.4s' }}>
                                    Ціна
                                </span>
                            </h2>
                            <p className="text-lg md:text-xl text-gray-500 italic" style={{ fontFamily: "'Dancing Script', cursive" }}>
                                це наші головні цінності
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section - Confectioner Spotlight */}
            <div className="relative bg-gradient-to-br from-[#f8f9fa] via-[#fff] to-[#f8f9fa] py-24 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 bg-white shadow-sm py-16">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Image Column */}
                        <div className="w-full lg:w-1/2 animate-fade-in-delayed">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-vatsak-gold to-vatsak-red rounded-[2rem] opacity-20 group-hover:opacity-40 blur-xl transition duration-500"></div>
                                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl transform transition duration-500 group-hover:scale-[1.02]">
                                    <img
                                        src="/images/confectioner.jpg"
                                        alt="Наш кондитер"
                                        className="w-full h-auto object-cover"
                                        onError={(e) => {
                                            if (!e.target.dataset.retried) {
                                                e.target.dataset.retried = "true";
                                                e.target.src = "/images/confectioner.jpg.jpg";
                                            } else {
                                                e.target.onerror = null;
                                                e.target.src = "https://placehold.co/600x800?text=Фото+Кондитера";
                                            }
                                        }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                                        <h3 className="text-white text-2xl font-bold" style={{ fontFamily: "'Oswald', sans-serif" }}>Людмила Приходько</h3>
                                        <p className="text-vatsak-gold font-medium">Шеф-кондитер</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="w-full lg:w-1/2 relative flex flex-col items-center text-center">
                            {/* Decorative Logo Background */}
                            <div className="absolute -top-10 -right-10 opacity-[0.03] select-none pointer-events-none hidden lg:block">
                                <img src={logo} alt="" className="w-80 h-auto" />
                            </div>

                            <div className="mb-2 animate-fade-in">
                                <img src={logo} alt="ANTREME Logo" className="w-[450px] h-auto object-contain" />
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                ТОРТИ З <span className="text-vatsak-red">ДУШЕЮ</span> ТА <span className="text-vatsak-gold">ЛЮБОВ'Ю</span>
                            </h2>

                            <p className="text-lg text-gray-600 mb-10 leading-relaxed font-light animate-fade-in-delayed max-w-xl mx-auto">
                                "Я створюю торти з любов'ю та увагою до кожної деталі. Кожен десерт — це маленька історія, виготовлена індивідуально з натуральних інгредієнтів найвищої якості. Моя мета — зробити ваше свято незабутнім."
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group">
                                    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform text-vatsak-red">✨</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Ручна робота</h4>
                                        <p className="text-sm text-gray-500">Унікальний дизайн для кожного</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group">
                                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform text-vatsak-gold">🌿</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Натуральність</h4>
                                        <p className="text-sm text-gray-500">Тільки свіжі інгредієнти</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group">
                                    <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform text-pink-500">💝</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">З любов'ю</h4>
                                        <p className="text-sm text-gray-500">Вкладаю душу в кожен торт</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 group">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform text-blue-500">💎</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">Якість</h4>
                                        <p className="text-sm text-gray-500">Бездоганний смак та вигляд</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Holiday Cakes Promo Section */}
            <section className="py-12 md:py-20 bg-white shadow-sm overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <Link to="/holiday" className="group block relative overflow-hidden rounded-[32px] md:rounded-[48px] bg-amber-50 border border-amber-100 shadow-xl shadow-amber-900/5">
                        <div className="flex flex-col md:flex-row items-center">
                            {/* Text Content */}
                            <div className="w-full md:w-1/2 p-8 md:p-20 text-center md:text-left z-10 flex flex-col justify-center">
                                <div className="mb-4">
                                    <span className="inline-block px-4 py-1.5 bg-[#7b002c] text-white text-[10px] md:text-xs font-black uppercase tracking-[0.2em] rounded-full">
                                        Нова Колекція
                                    </span>
                                </div>
                                <h2 className="text-3xl md:text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-6" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                    Торти для вашого <br />
                                    <span className="text-[#a0742d] drop-shadow-sm">особливого свята</span>
                                </h2>
                                <p className="text-gray-600 text-sm md:text-lg mb-8 md:mb-12 max-w-md font-medium leading-relaxed">
                                    Від бенто-тортів до величних весільних шедеврів. Оберіть ідеальну категорію для вашої незабутньої події.
                                </p>
                                <div className="inline-flex items-center justify-center md:justify-start gap-3 bg-[#7b002c] text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest text-xs md:text-sm hover:bg-black transition-all shadow-lg hover:shadow-[#7b002c]/20 active:scale-95 group/btn w-fit mx-auto md:mx-0">
                                    Відкрити каталог
                                    <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                    </svg>
                                </div>
                            </div>

                            {/* Image Grid / Visual */}
                            <div className="w-full md:w-1/2 h-[300px] md:h-[650px] relative overflow-hidden order-first md:order-last">
                                <div className="absolute inset-0 bg-gradient-to-r from-amber-50 via-transparent to-transparent z-10 hidden md:block"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=1000"
                                    alt="Holiday Cakes"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out shadow-inner"
                                />
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500"></div>
                            </div>
                        </div>
                    </Link>
                </div>
            </section>

            {/* Featured Products */}
            {featuredCakes.length > 0 && (
                <div className="container mx-auto px-6 pt-10 md:pt-20 pb-16 md:pb-20 bg-white shadow-sm">
                    <div className="text-center mb-6 md:mb-12 animate-fade-in">
                        <div className="text-sm text-amber-700 mb-1 uppercase tracking-widest">Популярні</div>
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-2 md:mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Обирають найчастіше
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                        {featuredCakes.map((cake, index) => (
                            <div
                                key={cake.id}
                                className="group relative bg-white flex flex-col rounded-[2rem] md:rounded-[2.5rem] shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden h-full animate-fade-in-stagger"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Title & Badge - Top position for Mobile Optimization */}
                                <div className="p-2 md:p-6 pb-1 md:pb-2 text-center relative z-10">
                                    <Link to={`/cakes/${cake.id}`} className="block">
                                        <h3 className="text-[10px] md:text-lg font-bold text-gray-800 uppercase tracking-tight leading-tight line-clamp-2 min-h-[1.5rem] md:min-h-[3rem] group-hover:text-vatsak-red transition-colors duration-300" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                            {cake.name}
                                        </h3>
                                    </Link>
                                </div>

                                {/* Image Container - Unified */}
                                <Link to={`/cakes/${cake.id}`} className="relative block overflow-hidden mx-2 md:mx-6 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-50 aspect-square mt-0.5">
                                    {/* Badges - Circular maroon style */}
                                    <div className="absolute top-2 left-2 flex flex-col gap-2 z-10 pointer-events-none">
                                        {index === 0 && (
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
                                                    addToCart(cake);
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

            {/* Call to Action Banner - Sophisticated muted gold/sand style */}
            <div className="relative bg-[#D8CCA3] text-gray-900 py-20 overflow-hidden border-y border-amber-900/10 shadow-sm">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-6xl animate-float">🎂</div>
                    <div className="absolute bottom-10 right-10 text-6xl animate-float-delayed">🧁</div>
                </div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <h3 className="text-3xl md:text-5xl font-black mb-4 animate-fade-in tracking-tight text-white drop-shadow-sm" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        ГОТОВІ ЗАМОВИТИ ТОРТ МРІЇ?
                    </h3>
                    <p className="text-xl mb-10 text-white opacity-90 italic max-w-2xl mx-auto animate-fade-in-delayed" style={{ fontFamily: "'Dancing Script', cursive" }}>
                        Дозвольте собі шматочок справжнього щастя. Оберіть свій ідеальний смак прямо зараз.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-delayed">
                        <a href="tel:0979081504" className="inline-block bg-white text-gray-800 px-12 py-4 font-bold uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl hover:shadow-gray-200 transform hover:-translate-y-1 hover:scale-105 border border-gray-100">
                            📞 Телефонувати
                        </a>
                        <Link to="/cakes" className="inline-block bg-[#ffcc00] text-gray-900 px-12 py-4 font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-[#ffdb4d] transition-all shadow-xl hover:shadow-[#ffcc00]/30 transform hover:-translate-y-1 hover:scale-105">
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

            <QuickOrderModal
                isOpen={isQuickOrderOpen}
                onClose={() => setIsQuickOrderOpen(false)}
                cake={selectedCakeForQuickOrder}
                deliveryDate={selectedCakeForQuickOrder?.deliveryDate}
                deliveryMethod={selectedCakeForQuickOrder?.deliveryMethod}
            />
        </div>
    );
}

export default Home;
