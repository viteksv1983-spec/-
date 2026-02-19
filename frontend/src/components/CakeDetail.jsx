import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { FILLINGS } from '../constants/fillings';
import QuickOrderModal from './QuickOrderModal';
import SEOHead from './SEOHead';
import { Helmet } from 'react-helmet-async';


function CakeDetail() {
    const { id } = useParams();
    const [cake, setCake] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [selectedWeight, setSelectedWeight] = useState(1);
    const [selectedFlavor, setSelectedFlavor] = useState(FILLINGS.length > 0 ? FILLINGS[0].name : '');
    const [activeTab, setActiveTab] = useState('description');
    const { addToCart } = useContext(CartContext);
    const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState('pickup');

    // Default date to today + 3 days for the input value

    useEffect(() => {
        api.get(`/cakes/${id}`)
            .then(response => {
                setCake(response.data);
                if (response.data.fillings && response.data.fillings.length > 0) {
                    setSelectedFlavor(response.data.fillings[0].name);
                }
            })
            .catch(error => {
                console.error("Error fetching cake details", error);
            });
    }, [id]);

    const handleAddToCart = () => {
        const CAKE_CATEGORIES = ['bento', 'biscuit', 'wedding', 'mousse', 'Торти', 'cake'];
        const flavor = CAKE_CATEGORIES.includes(cake.category) ? selectedFlavor : null;

        const baseWeightKg = cake.weight ? (cake.weight < 10 ? cake.weight : cake.weight / 1000) : 1;
        const pricePerKg = cake.price / baseWeightKg;
        const finalPrice = Math.round(pricePerKg * selectedWeight);

        const itemToAdd = {
            ...cake,
            price: finalPrice
        };

        const date = new Date();
        date.setDate(date.getDate() + 3);
        const defaultDate = date.toISOString().split('T')[0];

        addToCart(itemToAdd, quantity, flavor, selectedWeight, defaultDate, deliveryMethod);
        alert(`${quantity} x ${cake.name} (${selectedWeight} кг) ${flavor ? `(${flavor}) ` : ''}додано в кошик!`);
    };

    if (!cake) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-vatsak-red"></div>
            </div>
        );
    }

    const baseWeightKg = cake.weight ? (cake.weight < 10 ? cake.weight : cake.weight / 1000) : 1;
    const pricePerKg = cake.price / baseWeightKg;
    const displayPrice = Math.round(pricePerKg * selectedWeight);

    const schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": cake.name,
        "image": cake.image_url,
        "description": cake.description,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "UAH",
            "price": cake.price,
            "availability": "https://schema.org/InStock"
        }
    };

    const selectedFilling = FILLINGS.find(f => f.name === selectedFlavor);

    return (
        <div className="min-h-screen bg-[#F9F8F1] text-gray-800 font-sans">
            <SEOHead
                title={cake.meta_title || `${cake.name} - Купити в Києві | Antreme`}
                description={cake.meta_description || `Замовити торт ${cake.name}. ${cake.description?.slice(0, 100)}...`}
                keywords={cake.meta_keywords}
                h1={cake.h1_heading || cake.name}
                canonical={cake.canonical_url}
                ogImage={cake.image_url}
                type="product"
            />
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(schemaData)}
                </script>
            </Helmet>

            {/* Breadcrumb Section */}
            <div className="bg-white py-4 border-b border-gray-100 sticky top-0 z-40 backdrop-blur-md bg-white/80">
                <div className="container mx-auto px-4 md:px-6 bg-white">
                    <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">
                        <Link to="/" className="hover:text-gray-900 transition-colors">Головна</Link> <span className="mx-2 text-gray-300">/</span>
                        <Link to="/cakes" className="hover:text-gray-900 transition-colors">Торти</Link> <span className="mx-2 text-gray-300">/</span>
                        <span className="text-gray-800">{cake.name}</span>
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-4 md:py-12 bg-white shadow-sm min-h-screen">
                {/* Product Title for Mobile - Compact */}
                <div className="lg:hidden mb-3">
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight uppercase tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        {cake.name}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

                    {/* Left Column (Image + Tabs) - 50/50 Split */}
                    <div className="lg:col-span-6 flex flex-col">
                        <div className="border border-gray-100 bg-white rounded-3xl relative group overflow-hidden mb-4 md:mb-12">
                            {/* Badges top-left (Rozetka Style) */}
                            <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 pointer-events-none">
                                <div className="bg-[#ffa500] text-white text-[8px] font-bold px-1.5 py-0.5 uppercase rounded shadow-sm tracking-tighter">
                                    Топ Продажів
                                </div>
                                <div className="text-gray-900 font-black italic text-xs tracking-tighter leading-none">
                                    ANTREME
                                </div>
                            </div>

                            {/* Main Image Container */}
                            <div className="aspect-square relative flex items-center justify-center">
                                {cake.image_url && (
                                    <img
                                        src={cake.image_url.startsWith('http') ? cake.image_url : `${api.defaults.baseURL}${cake.image_url}`}
                                        alt={cake.name}
                                        className="w-full h-full object-cover transition-transform duration-700"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Top Info Block for Mobile (Weight, Term) */}
                        <div className="lg:hidden mb-4 grid grid-cols-2 gap-2">
                            <div className="bg-[#f8f9fa]/50 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Вага</span>
                                <span className="text-xs font-bold text-gray-900">{Math.round(cake.weight || 450)} г</span>
                                <div className="flex items-center gap-1 mt-0.5 opacity-80">
                                    <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-[7px] font-bold text-green-600 uppercase tracking-widest whitespace-nowrap">Можливе замовлення</span>
                                </div>
                            </div>
                            <div className="bg-[#f8f9fa]/50 p-3 rounded-xl flex flex-col items-center justify-center text-center">
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">Термін</span>
                                <span className="text-xs font-bold text-gray-900">{cake.shelf_life || '48 годин'}</span>
                            </div>
                        </div>

                        {/* Tabs Section - Positioned beneath image in the same column */}
                        <div className="border-t border-gray-100 pt-8">
                            <div className="flex gap-8 mb-6 border-b border-gray-100 overflow-x-auto pb-1 no-scrollbar">
                                {['description', 'ingredients', 'delivery', 'reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-3 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${activeTab === tab
                                            ? 'text-gray-900 border-gray-900'
                                            : 'text-gray-400 border-transparent hover:text-gray-600'
                                            }`}
                                    >
                                        {tab === 'description' ? 'Опис' : tab === 'ingredients' ? 'Склад' : tab === 'delivery' ? 'Умови' : 'Відгуки'}
                                    </button>
                                ))}
                            </div>

                            <div className="text-gray-600 leading-relaxed text-sm animate-fade-in">
                                {activeTab === 'description' && (
                                    <div className="space-y-4">
                                        <p>{cake.description}</p>
                                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                            {cake.weight && (<div><span className="text-gray-400 block text-xs uppercase tracking-wider mb-1">Вага</span><span className="font-semibold text-gray-900">{Math.round(cake.weight)} г</span></div>)}
                                            {cake.shelf_life && (<div><span className="text-gray-400 block text-xs uppercase tracking-wider mb-1">Термін</span><span className="font-semibold text-gray-900">{cake.shelf_life}</span></div>)}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'ingredients' && (
                                    <div className="space-y-4">
                                        <div className="bg-yellow-50/50 p-5 rounded-2xl border border-yellow-100/50">
                                            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                                Натуральний склад
                                            </h4>
                                            <p className="text-gray-700 italic">Ми використовуємо тільки свіжі та якісні інгредієнти: справжнє вершкове масло, натуральні вершки та добірні фрукти.</p>
                                        </div>
                                        <p className="pl-2 border-l-2 border-gray-100">{cake.ingredients || 'Інформація про склад уточнюється.'}</p>
                                    </div>
                                )}

                                {activeTab === 'delivery' && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-4 border border-gray-100 rounded-2xl hover:border-vatsak-red/30 transition-colors bg-white shadow-sm">
                                                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-3">
                                                    <svg className="w-6 h-6 text-vatsak-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                </div>
                                                <h4 className="font-bold text-gray-900 mb-1">Самовивіз</h4>
                                                <p className="text-xs text-gray-500">Безкоштовно з кондитерської</p>
                                            </div>
                                            <div className="p-4 border border-gray-100 rounded-2xl hover:border-vatsak-red/30 transition-colors bg-white shadow-sm">
                                                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-3">
                                                    <svg className="w-6 h-6 text-vatsak-red" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                </div>
                                                <h4 className="font-bold text-gray-900 mb-1">Доставка Taxi</h4>
                                                <p className="text-xs text-gray-500">За тарифами перевізника</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg border-l-4 border-gray-200">Зверніть увагу: ми рекомендуємо замовляти торти за 2-3 дні до вашої події для гарантії наявності всіх інгредієнтів.</p>
                                    </div>
                                )}

                                {activeTab === 'reviews' && (
                                    <div className="space-y-6 animate-fade-in">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-gray-900">Відгуки клієнтів</h4>
                                            <button className="text-xs font-bold text-vatsak-red hover:underline uppercase tracking-wide">Додати відгук</button>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-2xl flex flex-col items-center justify-center text-center py-12 border border-gray-100 italic text-gray-400">
                                            <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                                            Поки що немає відгуків. Будьте першим, хто поділиться враженнями!
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Info Section) - 50/50 Split */}
                    <div className="lg:col-span-6 flex flex-col">
                        <h1 className="hidden lg:block text-2xl md:text-3xl font-medium text-gray-900 mb-2 leading-tight">
                            {cake.name}
                        </h1>

                        <div className="flex items-center justify-between lg:justify-start lg:gap-8 mb-3 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-1.5">
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <svg key={i} className="w-3 h-3 md:w-4 md:h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                                <span className="text-xs md:text-sm text-gray-400">7 відгуків</span>
                                <span className="text-xs md:text-sm text-gray-300 mx-1 md:mx-2 font-light">|</span>
                                <span className="text-xs md:text-sm text-gray-400">Код: {cake.id + 1000}</span>
                            </div>
                            <button className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-200 flex items-center justify-center text-yellow-500 hover:text-yellow-600 hover:border-yellow-400 transition-all active:scale-90">
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-2xl md:text-5xl font-medium text-gray-900">
                                    {displayPrice} <span className="text-lg md:text-2xl text-gray-400 font-normal">₴</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    <span className="text-[9px] md:text-sm text-green-600 font-bold uppercase tracking-wider">В наявності</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <h3 className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Вага</h3>
                                        <div className="hidden md:flex items-center gap-1.5 opacity-80">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                            <span className="text-[8px] font-bold text-green-600 uppercase tracking-widest whitespace-nowrap">Можливе замовлення</span>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={selectedWeight}
                                            onChange={(e) => setSelectedWeight(parseFloat(e.target.value))}
                                            className="w-full bg-[#f8f9fa] border border-gray-100 rounded-xl px-4 py-3 text-gray-900 font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all cursor-pointer text-xs shadow-sm"
                                        >
                                            <option value={1}>1 кг (4-6 порцій)</option>
                                            <option value={1.5}>1.5 кг (6-8 порцій)</option>
                                            <option value={2}>2 кг (8-10 порцій)</option>
                                            <option value={3}>3 кг (10-15 порцій)</option>
                                            <option value={5}>5 кг (15-20 порцій)</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Flavor Selection */}
                                {['bento', 'biscuit', 'wedding', 'mousse', 'Торти', 'cake'].includes(cake.category) && (
                                    <div>
                                        <h3 className="text-[10px] font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Смак (Начинка)</h3>
                                        <div className="flex flex-col md:flex-row gap-6 items-start">
                                            <div className="flex-1 w-full">
                                                <div className="relative">
                                                    <select
                                                        value={selectedFlavor}
                                                        onChange={(e) => setSelectedFlavor(e.target.value)}
                                                        className="w-full bg-[#f8f9fa] border border-gray-100 rounded-xl px-4 py-3 text-gray-900 font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all cursor-pointer text-xs shadow-sm"
                                                    >
                                                        {FILLINGS.map((filling) => (
                                                            <option key={filling.id} value={filling.name}>
                                                                {filling.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Delivery Method Selector */}
                                <div className="mt-6">
                                    <h3 className="text-[10px] font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Спосіб отримання</h3>
                                    <div className="relative">
                                        <select
                                            value={deliveryMethod}
                                            onChange={(e) => setDeliveryMethod(e.target.value)}
                                            className="w-full bg-[#f8f9fa] border border-gray-100 rounded-xl px-4 py-3 text-gray-900 font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400/10 focus:border-yellow-400 transition-all cursor-pointer text-xs shadow-sm"
                                        >
                                            <option value="pickup">🏪 Самовивіз</option>
                                            <option value="uklon">🚕 Доставка Uklon</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>


                                {/* Actions */}
                                <div className="flex flex-col gap-4 mt-6">
                                    <div className="grid grid-cols-12 gap-2 h-12">
                                        {/* Quantity Selector - Enhanced layout */}
                                        <div className="col-span-4 md:col-span-3 flex items-center bg-[#f8f9fa] rounded-xl border border-gray-100 h-full p-0.5 shadow-sm">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-8 md:w-11 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors border-r border-gray-200/10 active:scale-95"
                                            >
                                                <span className="text-base md:text-lg font-medium">–</span>
                                            </button>
                                            <div className="flex-1 text-center text-gray-900 font-black text-xs md:text-sm flex items-center justify-center h-full">
                                                {quantity}
                                            </div>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-8 md:w-11 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors border-l border-gray-200/10 active:scale-95"
                                            >
                                                <span className="text-base md:text-lg font-medium">+</span>
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleAddToCart}
                                            className="col-span-5 md:col-span-6 bg-[#FFCC00] text-gray-900 font-bold text-[10px] md:text-[13px] uppercase tracking-wider hover:bg-[#e6b800] transition-all rounded-xl h-full flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                                        >
                                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                            </svg>
                                            Купити
                                        </button>

                                        <button
                                            onClick={() => setIsQuickOrderOpen(true)}
                                            className="col-span-3 md:col-span-3 bg-[#FFF5CC] text-[#856404] font-bold text-[8px] md:text-[11px] uppercase tracking-widest border border-[#FFD966] hover:bg-[#FFF0B3] transition-all rounded-xl h-full flex items-center justify-center active:scale-95 whitespace-nowrap shadow-sm px-1"
                                        >
                                            1 Клік
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            <div className="bg-[#F9F8F1] pb-16 md:pb-24">
                <div className="container mx-auto px-4 md:px-6 bg-white py-12 md:py-16 shadow-sm border border-gray-100 rounded-3xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>Вам також може сподобатись</h2>
                            <p className="text-gray-500 mt-1 text-sm font-medium">Спробуйте наші інші легендарні десерти</p>
                        </div>
                        <Link to="/cakes" className="text-sm font-bold text-[#c5a059] hover:text-[#b38e4a] flex items-center gap-2 group transition-all uppercase tracking-widest">
                            Дивитись всі
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </Link>
                    </div>
                    <RelatedProducts currentCakeId={cake.id} category={cake.category} />
                </div>
            </div>

            {/* Quick Order Modal */}
            <QuickOrderModal
                cake={cake}
                isOpen={isQuickOrderOpen}
                onClose={() => setIsQuickOrderOpen(false)}
                deliveryDate={(() => {
                    const date = new Date();
                    date.setDate(date.getDate() + 3);
                    return date.toISOString().split('T')[0];
                })()}
                deliveryMethod={deliveryMethod}
                flavor={selectedFlavor}
                weight={selectedWeight}
            />
        </div >
    );
}

// Sub-component for Related Products
function RelatedProducts({ currentCakeId, category }) {
    const [related, setRelated] = useState([]);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Local state for simplified UI in related section


    useEffect(() => {
        api.get('/cakes/')
            .then(res => {
                const allCakes = res.data;
                const others = allCakes.filter(c => c.id !== currentCakeId);
                const shuffled = others.sort(() => 0.5 - Math.random());
                setRelated(shuffled.slice(0, 4));
            })
            .catch(err => console.error("Failed to load related products", err));
    }, [currentCakeId]);

    if (related.length === 0) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {related.map(cake => (
                <div key={cake.id} className="group relative bg-white flex flex-col rounded-[2.5rem] shadow-md hover:shadow-2xl hover:shadow-amber-900/15 transition-all duration-500 border border-gray-100 overflow-hidden h-full">
                    {/* 1. Title & Badge (Top) */}
                    <div className="p-3 md:p-6 pb-1 md:pb-2 text-center relative z-10">
                        <div className="flex flex-col items-center justify-center gap-1 mb-1 md:mb-2 text-center">
                            <div className="flex items-center justify-center gap-1 md:gap-1.5 opacity-80">
                                <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[7px] md:text-[8px] font-bold text-green-600 uppercase tracking-widest whitespace-nowrap">Можливе замовлення</span>
                            </div>
                        </div>
                        <Link to={`/cakes/${cake.id}`} className="block">
                            <h3 className="text-[13px] md:text-sm font-bold text-gray-800 uppercase tracking-tight leading-tight line-clamp-2 min-h-[2.2rem] md:min-h-[2.5rem] group-hover:text-vatsak-red transition-colors duration-300" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                {cake.name}
                            </h3>
                        </Link>
                    </div>

                    {/* 2. Image Area (Middle) */}
                    <Link to={`/cakes/${cake.id}`} className="relative block overflow-hidden mx-3 md:mx-4 rounded-xl md:rounded-[32px] border border-gray-50 aspect-square">
                        {/* Badges */}
                        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20">
                            <div className="w-6 h-6 md:w-8 md:h-8 bg-[#7b002c] text-white rounded-full flex items-center justify-center text-[7px] md:text-[8px] font-black uppercase shadow-lg border-2 border-white">
                                Hit
                            </div>
                        </div>

                        <button className="absolute top-1 right-1 z-20 p-2 text-yellow-500 hover:text-yellow-600 transition-all duration-300 group/wishlist">
                            <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover/wishlist:scale-110" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>

                        <div className="w-full h-full flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-700">
                            <img
                                src={cake.image_url && cake.image_url.startsWith('http') ? cake.image_url : `${api.defaults.baseURL}${cake.image_url}`}
                                alt={cake.name}
                                className="w-full h-full object-contain drop-shadow-xl"
                                loading="lazy"
                            />
                        </div>
                    </Link>

                    {/* 3. Info Area (Bottom) */}
                    <div className="p-3 md:p-6 pt-0 md:pt-0 mt-auto">
                        {/* Weight Info */}
                        <div className="mb-2 md:mb-4 text-center">
                            <div className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-tight mb-0.5">
                                {Math.round(cake.weight || 450)}г
                            </div>
                            <div className="flex items-center justify-center gap-1 md:gap-1.5 opacity-80">
                                <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[7px] md:text-[8px] font-bold text-green-600 uppercase tracking-widest whitespace-nowrap">Можливе замовлення</span>
                            </div>
                        </div>

                        {/* Price & Buttons */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
                            <div className="flex flex-col items-center md:items-start leading-none">
                                <span className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Ціна</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl md:text-2xl font-black text-gray-900">{cake.price}</span>
                                    <span className="text-xs md:text-sm font-bold text-gray-400">₴</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="px-3 py-2 text-[9px] font-black uppercase tracking-widest text-[#856404] bg-[#FFF5CC] border border-[#FFD966] rounded-xl hover:bg-[#FFF0B3] transition-all active:scale-95 shadow-sm">
                                    1 Клік
                                </button>
                                <button
                                    onClick={() => {
                                        const date = new Date();
                                        date.setDate(date.getDate() + 3);
                                        const defaultDate = date.toISOString().split('T')[0];
                                        addToCart(cake, 1, null, null, defaultDate, 'pickup');
                                        alert(`${cake.name} додано в кошик!`);
                                    }}
                                    className="w-10 h-10 bg-[#ffcc00] text-gray-900 rounded-xl flex items-center justify-center hover:bg-[#ffdb4d] transition-all shadow-md active:scale-95 group/cart"
                                >
                                    <svg className="w-5 h-5 transition-transform group-hover/cart:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CakeDetail;
