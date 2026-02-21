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
        <div className="min-h-screen bg-[#F8F3EE] text-gray-800 font-sans">
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

            {/* Breadcrumb Section - Luxury Style */}
            <div className="bg-white/80 py-4 border-b border-gray-50 sticky top-0 z-40 backdrop-blur-xl">
                <div className="container mx-auto px-4 md:px-8">
                    <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-[0.2em] font-black">
                        <Link to="/" className="hover:text-[#7A0019] transition-colors">ГОЛОВНА</Link> <span className="mx-2 text-gray-200">/</span>
                        <Link to="/cakes" className="hover:text-[#7A0019] transition-colors">КАТАЛОГ</Link> <span className="mx-2 text-gray-200">/</span>
                        <span className="text-gray-900">{cake.name}</span>
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-8 md:py-16 min-h-screen">
                {/* Product Title for Mobile - Luxury Focus */}
                <div className="lg:hidden mb-6">
                    <div className="text-[#7A0019] text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-center">PREMIUM QUALITY</div>
                    <h1 className="text-3xl font-black text-gray-900 leading-none uppercase tracking-tighter text-center" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        {cake.name}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                    {/* Left Column (Image + Tabs) */}
                    <div className="lg:col-span-6 flex flex-col">
                        <div className="bg-gradient-to-b from-[#FDFBF7] to-white rounded-[3rem] md:rounded-[4rem] relative group overflow-hidden mb-8 md:mb-16 shadow-[0_30px_70px_rgba(0,0,0,0.05)] border border-gray-50 aspect-square flex items-center justify-center p-4">
                            {/* Brand Accent */}
                            <div className="absolute top-8 left-8 z-20">
                                <div className="text-[#7A0019] font-black italic text-sm md:text-base tracking-tighter leading-none opacity-40">
                                    ANTREME
                                </div>
                            </div>

                            {/* Main Image */}
                            <div className="w-full h-full p-2 md:p-10">
                                {cake.image_url && (
                                    <img
                                        src={cake.image_url.startsWith('http') ? cake.image_url : `${api.defaults.baseURL}${cake.image_url}`}
                                        alt={cake.name}
                                        className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-1000 drop-shadow-2xl"
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

                        {/* Tabs Section - Luxury Underline Style */}
                        <div className="pt-4">
                            <div className="flex gap-10 mb-8 border-b border-gray-100 overflow-x-auto pb-1 no-scrollbar justify-center md:justify-start">
                                {['description', 'ingredients', 'delivery', 'reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-[11px] md:text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all relative ${activeTab === tab
                                            ? 'text-gray-900'
                                            : 'text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {tab === 'description' ? 'Опис' : tab === 'ingredients' ? 'Склад' : tab === 'delivery' ? 'Доставка' : 'Відгуки'}
                                        {activeTab === tab && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7A0019] animate-width-expand"></div>
                                        )}
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

                    {/* Right Column (Info Section) - High Impact Layout */}
                    <div className="lg:col-span-6 flex flex-col">
                        <div className="mb-8 hidden lg:block">
                            <div className="text-[#7A0019] text-xs font-black uppercase tracking-[0.3em] mb-4">CONFECTIONERY MASTERPIECE</div>
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-none uppercase tracking-tighter" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                {cake.name}
                            </h1>
                        </div>

                        <div className="flex items-center justify-between lg:justify-start lg:gap-10 mb-10 pb-6 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="flex text-[#FFD700]">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    ))}
                                </div>
                                <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase mt-0.5">7 ВІДГУКІВ</span>
                            </div>
                            <button className="w-12 h-12 rounded-2xl border border-gray-100 flex items-center justify-center text-[#7A0019] hover:bg-[#7A0019] hover:text-white transition-all shadow-sm">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </button>
                        </div>

                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="text-5xl md:text-7xl font-black text-gray-900 flex items-baseline leading-none">
                                    {displayPrice} <span className="text-xl md:text-3xl font-bold text-gray-400 ml-3">₴</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-100 mb-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] text-green-700 font-black uppercase tracking-widest">В НАЯВНОСТІ</span>
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Код: {cake.id + 1000}</div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                {/* Weight Selection - Chips Style */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">ОБЕРІТЬ ВАГУ (КГ)</h3>
                                    </div>
                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                        {[1, 1.5, 2, 3, 5].map((w) => (
                                            <button
                                                key={w}
                                                onClick={() => setSelectedWeight(w)}
                                                className={`h-14 rounded-2xl font-black text-sm transition-all border-2 flex items-center justify-center ${selectedWeight === w
                                                    ? 'bg-[#7A0019] border-[#7A0019] text-white shadow-lg shadow-red-900/20'
                                                    : 'bg-white border-gray-100 text-gray-900 hover:border-gray-200'
                                                    }`}
                                            >
                                                {w}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Flavor Selection - Premium Grid */}
                                {['bento', 'biscuit', 'wedding', 'mousse', 'Торти', 'cake'].includes(cake.category) && (
                                    <div>
                                        <h3 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">ОБЕРІТЬ НАЧИНКУ</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {FILLINGS.map((filling) => (
                                                <button
                                                    key={filling.id}
                                                    onClick={() => setSelectedFlavor(filling.name)}
                                                    className={`p-4 rounded-[1.5rem] border-2 text-left transition-all ${selectedFlavor === filling.name
                                                        ? 'bg-[#FDFBF7] border-[#7A0019] shadow-md'
                                                        : 'bg-white border-gray-50 hover:border-gray-200'
                                                        }`}
                                                >
                                                    <div className={`text-[11px] font-black uppercase tracking-wider mb-1 ${selectedFlavor === filling.name ? 'text-[#7A0019]' : 'text-gray-900'}`}>{filling.name}</div>
                                                    <div className="text-[10px] text-gray-400 leading-tight">Неймовірний смак</div>
                                                </button>
                                            ))}
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


                                {/* Actions - High Intensity Buttons */}
                                <div className="mt-10 pb-20">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-16">
                                        <div className="col-span-full md:col-span-2 flex items-center bg-gray-50 rounded-2xl h-16 md:h-full p-2">
                                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex-1 h-full flex items-center justify-center text-gray-400 transition-colors active:scale-95"><span className="text-2xl font-light">–</span></button>
                                            <div className="flex-1 text-center text-gray-900 font-black text-lg">{quantity}</div>
                                            <button onClick={() => setQuantity(quantity + 1)} className="flex-1 h-full flex items-center justify-center text-gray-400 transition-colors active:scale-95"><span className="text-2xl font-light">+</span></button>
                                        </div>

                                        <button
                                            onClick={handleAddToCart}
                                            className="col-span-full md:col-span-6 bg-[#7A0019] text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-[#9C142B] transition-all rounded-[1.5rem] h-16 md:h-full flex items-center justify-center gap-3 shadow-xl shadow-red-900/10 active:scale-95"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                            ДОДАТИ В КОШИК
                                        </button>

                                        <button
                                            onClick={() => setIsQuickOrderOpen(true)}
                                            className="col-span-full md:col-span-4 bg-[#FFD700] text-[#7A0019] font-black uppercase tracking-[0.1em] text-xs hover:bg-[#FFC800] transition-all rounded-[1.5rem] h-16 md:h-full flex items-center justify-center shadow-xl active:scale-95"
                                        >
                                            ШВИДКЕ ЗАМОВЛЕННЯ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Section - Masterpiece Style */}
            <div className="bg-white pb-32">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                        <div>
                            <div className="text-[#7A0019] text-xs font-black uppercase tracking-[0.3em] mb-3">MORE MASTERPIECES</div>
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                ВАМ ТАКОЖ СПОДОБАЄТЬСЯ
                            </h2>
                        </div>
                        <Link to="/cakes" className="text-xs font-black border-b-2 border-[#7A0019] text-[#7A0019] pb-1 hover:text-[#9C142B] hover:border-[#9C142B] transition-all uppercase tracking-[0.2em] whitespace-nowrap">
                            ВЕСЬ КАТАЛОГ
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
                    <Link to={`/cakes/${cake.id}`} className="relative block overflow-hidden mx-4 rounded-[2rem] bg-gradient-to-b from-[#FDFBF7] to-white aspect-square flex items-center justify-center p-4">
                        <div className="absolute top-4 left-4 z-20">
                            <div className="bg-[#7A0019] text-white text-[9px] font-black uppercase w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 tracking-tighter">
                                HIT
                            </div>
                        </div>

                        <div className="w-full h-full flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                            <img
                                src={cake.image_url && cake.image_url.startsWith('http') ? cake.image_url : `${api.defaults.baseURL}${cake.image_url}`}
                                alt={cake.name}
                                className="w-full h-full object-contain drop-shadow-2xl"
                                loading="lazy"
                            />
                        </div>
                    </Link>

                    {/* 3. Info Area (Bottom) */}
                    <div className="p-6 pt-4 mt-auto text-center">
                        <Link to={`/cakes/${cake.id}`}>
                            <h3 className="text-sm md:text-base font-black text-gray-900 uppercase tracking-tight leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-[#7A0019] transition-colors duration-300 mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                {cake.name}
                            </h3>
                        </Link>

                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="text-xl md:text-2xl font-black text-gray-900 leading-none">
                                {cake.price} <span className="text-xs text-gray-400 ml-1">₴</span>
                            </div>

                            <div className="flex items-center gap-2 w-full">
                                <button
                                    onClick={() => {
                                        const date = new Date();
                                        date.setDate(date.getDate() + 3);
                                        const defaultDate = date.toISOString().split('T')[0];
                                        addToCart(cake, 1, null, null, defaultDate, 'pickup');
                                        alert(`${cake.name} додано в кошик!`);
                                    }}
                                    className="flex-1 h-12 bg-[#7A0019] text-white rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-[#9C142B] transition-all shadow-md active:scale-95"
                                >
                                    ЗАМОВИТИ
                                </button>
                                <button className="w-12 h-12 bg-[#FFD700] text-[#7A0019] rounded-xl flex items-center justify-center hover:bg-[#FFC800] transition-all shadow-md active:scale-95">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
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
