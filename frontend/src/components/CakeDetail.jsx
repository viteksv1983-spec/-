import { getCategoryUrl, getProductUrl } from '../utils/urls';
import { dbCategoryToSlug, isGroupA, GROUP_A_CATEGORIES, GROUP_B_CATEGORIES } from '../constants/seoRoutes';
import { GET_CATEGORY_NAME } from '../constants/categories';
import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { FILLINGS } from '../constants/fillings';
import QuickOrderModal from './QuickOrderModal';
import SEOHead from './SEOHead';
import NotFound from './NotFound';
import { Helmet } from 'react-helmet-async';


function CakeDetail({ predefinedId, predefinedSlug, expectedCategory, groupType, categorySlug }) {
    const params = useParams();
    const id = predefinedId || params.id;
    const slug = predefinedSlug || params.productSlug;
    const identifier = slug || id;
    const [cake, setCake] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const [selectedWeight, setSelectedWeight] = useState(1);
    const [selectedFlavor, setSelectedFlavor] = useState(FILLINGS.length > 0 ? FILLINGS[0].name : '');
    const [activeTab, setActiveTab] = useState('description');
    const { addToCart } = useContext(CartContext);
    const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState('pickup');
    const [isWished, setIsWished] = useState(false);
    const [showStickyBar, setShowStickyBar] = useState(false);
    const orderSectionRef = useRef(null);

    // Track recently viewed + get carousel data
    useTrackViewed(cake?.id);
    const { popular, recommended, recentlyViewed } = useCarouselData(cake?.id);

    useEffect(() => {
        // Build API URL with optional category context validation
        let url = `/cakes/${identifier}`;
        if (expectedCategory) {
            url += `?category=${expectedCategory}`;
        }
        api.get(url)
            .then(response => {
                // Strict Category ↔ Product Context Lock:
                // Ensure the cake actually belongs to the category from the URL route.
                if (expectedCategory && response.data.category !== expectedCategory) {
                    setNotFound(true);
                    return;
                }

                setCake(response.data);
                setNotFound(false);
                if (response.data.fillings && response.data.fillings.length > 0) {
                    setSelectedFlavor(response.data.fillings[0].name);
                }
                // Check wishlist
                try {
                    const wl = JSON.parse(localStorage.getItem('wishlist') || '[]');
                    setIsWished(wl.includes(response.data.id));
                } catch { }
            })
            .catch(error => {
                console.error("Error fetching cake details", error);
                if (error.response && error.response.status === 404) {
                    setNotFound(true);
                }
            });
    }, [identifier, expectedCategory]);

    // IntersectionObserver: show sticky bar when order section is NOT visible
    useEffect(() => {
        const el = orderSectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowStickyBar(!entry.isIntersecting);
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [cake]);

    const toggleWishlist = () => {
        try {
            const wl = JSON.parse(localStorage.getItem('wishlist') || '[]');
            let next;
            if (wl.includes(cake.id)) {
                next = wl.filter(i => i !== cake.id);
            } else {
                next = [...wl, cake.id];
            }
            localStorage.setItem('wishlist', JSON.stringify(next));
            setIsWished(!isWished);
        } catch { }
    };

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
    };

    if (notFound) {
        return <NotFound />;
    }

    if (!cake) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-white">
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-[#E8C064]/30 border-t-[#E8C064]"></div>
            </div>
        );
    }

    const baseWeightKg = cake.weight ? (cake.weight < 10 ? cake.weight : cake.weight / 1000) : 1;
    const pricePerKg = cake.price / baseWeightKg;
    const displayPrice = Math.round(pricePerKg * selectedWeight);

    // ─── Determine URLs and category context ───
    const productUrl = getProductUrl(cake);
    if (!productUrl) {
        return <NotFound />;
    }

    const categoryUrlSlug = dbCategoryToSlug(cake.category);
    const isGroupACake = categoryUrlSlug && isGroupA(categoryUrlSlug);
    const categoryLabel = GET_CATEGORY_NAME(cake.category) || cake.category;
    const categoryUrl = getCategoryUrl(cake.category);

    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": cake.name,
        "image": cake.image_url ? (cake.image_url.startsWith('http') ? cake.image_url : `https://antreme.kyiv.ua${cake.image_url}`) : undefined,
        "description": cake.description,
        "brand": {
            "@type": "Brand",
            "name": "Antreme"
        },
        "offers": {
            "@type": "Offer",
            "priceCurrency": "UAH",
            "price": cake.price,
            "availability": cake.is_available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "url": `https://antreme.kyiv.ua${productUrl}`
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "5.0",
            "reviewCount": "7"
        }
    };

    // BreadcrumbList: Group A = Home -> Каталог -> Category -> Product
    //                 Group B = Home -> Category -> Product
    const breadcrumbItems = [{
        "@type": "ListItem",
        "position": 1,
        "name": "Головна",
        "item": "https://antreme.kyiv.ua/"
    }];

    if (isGroupACake) {
        breadcrumbItems.push({
            "@type": "ListItem",
            "position": 2,
            "name": "Торти на замовлення",
            "item": "https://antreme.kyiv.ua/torty-na-zamovlennya/"
        });
        breadcrumbItems.push({
            "@type": "ListItem",
            "position": 3,
            "name": categoryLabel,
            "item": `https://antreme.kyiv.ua${categoryUrl}`
        });
        breadcrumbItems.push({
            "@type": "ListItem",
            "position": 4,
            "name": cake.name
        });
    } else {
        breadcrumbItems.push({
            "@type": "ListItem",
            "position": 2,
            "name": categoryLabel,
            "item": `https://antreme.kyiv.ua${categoryUrl}`
        });
        breadcrumbItems.push({
            "@type": "ListItem",
            "position": 3,
            "name": cake.name
        });
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbItems
    };

    const schemaData = [productSchema, breadcrumbSchema];

    const weightOptions = [
        { value: 0.5, label: '0.5 кг (2-3 порції)' },
        { value: 1, label: '1 кг (4-6 порцій)' },
        { value: 1.5, label: '1.5 кг (6-8 порцій)' },
        { value: 2, label: '2 кг (8-12 порцій)' },
        { value: 3, label: '3 кг (12-18 порцій)' },
    ];

    const isCakeCategory = ['bento', 'biscuit', 'wedding', 'mousse', 'Торти', 'cake'].includes(cake.category);

    return (
        <div className="min-h-screen bg-white text-gray-900">
            <SEOHead
                title={cake.meta_title || `${cake.name} - Купити в Києві | Antreme`}
                description={cake.meta_description || `Замовити торт ${cake.name}. ${cake.description?.slice(0, 100)}...`}
                keywords={cake.meta_keywords}
                h1={cake.h1_heading || cake.name}
                canonical={productUrl}
                ogImage={cake.image_url}
                type="product"
                schema={schemaData}
            />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-[0.15em] font-bold">
                        <Link to="/" className="hover:text-[#7A0019] transition-colors">Головна</Link>
                        <span className="mx-2 text-gray-200">/</span>
                        {isGroupACake && (
                            <>
                                <Link to="/torty-na-zamovlennya" className="hover:text-[#7A0019] transition-colors">Каталог</Link>
                                <span className="mx-2 text-gray-200">/</span>
                            </>
                        )}
                        <Link to={categoryUrl} className="hover:text-[#7A0019] transition-colors">{categoryLabel}</Link>
                        <span className="mx-2 text-gray-200">/</span>
                        <span className="text-gray-600">{cake.name}</span>
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

                    {/* ===== LEFT: Image ===== */}
                    <div className="relative">
                        {/* Mobile-only title + stars above photo */}
                        <h1 className="lg:hidden text-2xl font-black text-gray-900 uppercase tracking-tight leading-tight mb-2 text-center"
                            style={{ fontFamily: "'Oswald', sans-serif" }}>
                            {cake.name}
                        </h1>
                        <div className="lg:hidden flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-1.5">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <svg key={i} className="w-3.5 h-3.5 text-[#E8C064] fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500 font-medium">7 відгуків</span>
                            </div>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs text-gray-400 font-medium">Код: {cake.id + 1000}</span>
                        </div>
                        <div className="bg-[#faf8f5] rounded-3xl aspect-[3/4] md:aspect-auto md:min-h-[500px] lg:min-h-[600px] flex items-center justify-center p-3 md:p-6 relative overflow-hidden group border border-gray-100">
                            {/* Brand watermark */}
                            <div className="absolute top-6 left-6 text-[#7A0019] font-black italic text-xs tracking-tighter opacity-30">ANTREME</div>

                            {cake.image_url && (
                                <img
                                    src={cake.image_url.startsWith('http') ? cake.image_url : `${api.defaults.baseURL}${cake.image_url}`}
                                    alt={`${cake.name} замовити Київ`}
                                    className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-700"
                                />
                            )}
                        </div>

                        {/* Mobile: Weight + Term quick info */}
                        <div className="lg:hidden mt-3 grid grid-cols-2 gap-2">
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold block mb-0.5">Вага</span>
                                <span className="text-xs font-bold text-gray-900">{Math.round(cake.weight || 450)} г</span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 text-center">
                                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold block mb-0.5">Термін</span>
                                <span className="text-xs font-bold text-gray-900">{cake.shelf_life || '48 годин'}</span>
                            </div>
                        </div>

                        {/* Tabs Section below image */}
                        <div className="mt-6 md:mt-10">
                            <div className="flex gap-6 md:gap-10 mb-6 border-b border-gray-100 overflow-x-auto pb-1 no-scrollbar">
                                {['description', 'ingredients', 'delivery', 'reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-3 text-[10px] md:text-xs font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all relative ${activeTab === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {tab === 'description' ? 'Опис' : tab === 'ingredients' ? 'Склад' : tab === 'delivery' ? 'Доставка' : 'Відгуки'}
                                        {activeTab === tab && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#E8C064]" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="text-gray-600 leading-relaxed text-sm">
                                {activeTab === 'description' && (
                                    <div className="space-y-4">
                                        <p>{cake.description}</p>
                                        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl">
                                            {cake.weight && (<div><span className="text-gray-400 block text-xs uppercase tracking-wider mb-1">Вага</span><span className="font-semibold text-gray-900">{Math.round(cake.weight)} г</span></div>)}
                                            {cake.shelf_life && (<div><span className="text-gray-400 block text-xs uppercase tracking-wider mb-1">Термін</span><span className="font-semibold text-gray-900">{cake.shelf_life}</span></div>)}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'ingredients' && (
                                    <div className="space-y-4">
                                        <div className="bg-yellow-50/60 p-4 rounded-xl border border-yellow-100/50">
                                            <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
                                                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                                Натуральний склад
                                            </h4>
                                            <p className="text-gray-600 text-sm italic">Тільки свіжі та якісні інгредієнти найвищої якості.</p>
                                        </div>
                                        <p className="pl-3 border-l-2 border-gray-100">{cake.ingredients || 'Інформація про склад уточнюється.'}</p>
                                    </div>
                                )}
                                {activeTab === 'delivery' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-4 border border-gray-100 rounded-xl bg-white">
                                                <div className="text-lg mb-2">🏪</div>
                                                <h4 className="font-bold text-gray-900 text-sm mb-1">Самовивіз</h4>
                                                <p className="text-xs text-gray-500">Безкоштовно</p>
                                            </div>
                                            <div className="p-4 border border-gray-100 rounded-xl bg-white">
                                                <div className="text-lg mb-2">🚕</div>
                                                <h4 className="font-bold text-gray-900 text-sm mb-1">Доставка</h4>
                                                <p className="text-xs text-gray-500">За тарифами</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 italic bg-gray-50 p-3 rounded-lg">Рекомендуємо замовляти за 2-3 дні до події.</p>
                                    </div>
                                )}
                                {activeTab === 'reviews' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-gray-900 text-sm">Відгуки клієнтів</h4>
                                            <button className="text-xs font-bold text-[#7A0019] hover:underline uppercase tracking-wide">Додати відгук</button>
                                        </div>
                                        <div className="bg-gray-50 p-8 rounded-xl text-center text-gray-400 italic text-sm border border-gray-100">
                                            <svg className="w-10 h-10 mb-3 mx-auto opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                            Поки що немає відгуків. Будьте першим!
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ===== RIGHT: Product Info ===== */}
                    <div className="flex flex-col">

                        {/* Product Name (desktop only — mobile version is above the image) */}
                        <h1 className="hidden lg:block text-4xl font-black text-gray-900 uppercase tracking-tight leading-tight mb-4"
                            style={{ fontFamily: "'Oswald', sans-serif" }}>
                            {cake.name}
                        </h1>

                        {/* Stars + Reviews + Code + Heart row */}
                        <div className="flex items-center gap-3 mb-6 flex-wrap">
                            <div className="flex items-center gap-1.5">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <svg key={i} className="w-4 h-4 text-[#E8C064] fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500 font-medium">7 відгуків</span>
                            </div>
                            <span className="text-gray-300">·</span>
                            <span className="text-xs text-gray-400 font-medium">Код: {cake.id + 1000}</span>

                            {/* Heart wishlist button */}
                            <button onClick={toggleWishlist} className="ml-auto w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#E8C064] transition-colors">
                                <svg className="w-5 h-5" viewBox="0 0 24 24"
                                    fill={isWished ? '#E8C064' : 'none'}
                                    stroke={isWished ? '#E8C064' : '#ccc'}
                                    strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </button>
                        </div>

                        {/* ===== PRICE (prominent, top) ===== */}
                        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl md:text-5xl font-black text-gray-900 leading-none"
                                    style={{ fontFamily: "'Oswald', sans-serif" }}>
                                    {displayPrice}
                                </span>
                                <span className="text-lg md:text-xl text-gray-400 font-bold">₴</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[10px] md:text-xs text-green-700 font-bold uppercase tracking-wider">Є в наявності</span>
                            </div>
                        </div>

                        {/* ===== SELECTORS ===== */}
                        <div className="space-y-5">

                            {/* Weight dropdown */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Вага</label>
                                <div className="relative">
                                    <select
                                        value={selectedWeight}
                                        onChange={(e) => setSelectedWeight(Number(e.target.value))}
                                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-bold appearance-none focus:outline-none focus:border-[#E8C064] transition-all cursor-pointer text-sm"
                                    >
                                        {weightOptions.map(w => (
                                            <option key={w.value} value={w.value}>{w.label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Flavor dropdown */}
                            {isCakeCategory && (
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Смак (начинка)</label>
                                    <div className="relative">
                                        <select
                                            value={selectedFlavor}
                                            onChange={(e) => setSelectedFlavor(e.target.value)}
                                            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-bold appearance-none focus:outline-none focus:border-[#E8C064] transition-all cursor-pointer text-sm"
                                        >
                                            {FILLINGS.map(f => (
                                                <option key={f.id} value={f.name}>{f.name}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Delivery Method dropdown */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Спосіб отримання</label>
                                <div className="relative">
                                    <select
                                        value={deliveryMethod}
                                        onChange={(e) => setDeliveryMethod(e.target.value)}
                                        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 font-bold appearance-none focus:outline-none focus:border-[#E8C064] transition-all cursor-pointer text-sm"
                                    >
                                        <option value="pickup">🏪 Самовивіз</option>
                                        <option value="uklon">🚕 Доставка Uklon</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== QUANTITY + ACTION BUTTONS ===== */}
                        <div ref={orderSectionRef} className="mt-8 flex items-center gap-3">
                            {/* Quantity selector */}
                            <div className="flex items-center border-2 border-gray-200 rounded-xl h-12 md:h-14 overflow-hidden shrink-0">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-11 md:w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 transition-all text-xl font-light"
                                >–</button>
                                <div className="w-10 md:w-12 text-center text-gray-900 font-black text-base">{quantity}</div>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-11 md:w-12 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 transition-all text-xl font-light"
                                >+</button>
                            </div>

                            {/* BUY button */}
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 h-12 md:h-14 bg-[#E8C064] hover:bg-[#D4A83C] text-white rounded-xl font-black uppercase tracking-wider text-xs md:text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                                Купити
                            </button>

                            {/* Quick Order button */}
                            <button
                                onClick={() => setIsQuickOrderOpen(true)}
                                className="h-12 md:h-14 px-5 md:px-6 border-2 border-[#E8C064] text-[#7A0019] rounded-xl font-black uppercase tracking-wider text-xs md:text-sm hover:bg-[#FFF8E7] active:scale-95 transition-all whitespace-nowrap shrink-0"
                            >
                                1 клік
                            </button>
                        </div>

                        {/* Desktop weight/term info */}
                        <div className="hidden lg:grid grid-cols-2 gap-3 mt-8">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Базова вага</span>
                                <span className="text-sm font-bold text-gray-900">{Math.round(cake.weight || 450)} г</span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">Термін зберігання</span>
                                <span className="text-sm font-bold text-gray-900">{cake.shelf_life || '48 годин'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== BOTTOM SECTIONS: Categories + Carousels ===== */}
            <div className="bg-white pb-20 md:pb-32">
                <div className="max-w-6xl mx-auto px-4 md:px-8">

                    {/* Categories strip */}
                    <CategoriesStrip currentCategory={cake.category} />

                    {/* Popular Products carousel */}
                    <ProductCarousel
                        title="Популярні товари"
                        subtitle="Хіти продажів"
                        cakes={popular}
                        linkTo="/cakes"
                        linkText="Всі товари"
                    />

                    {/* Recently Viewed carousel */}
                    <ProductCarousel
                        title="Ви переглядали"
                        subtitle="Нещодавно"
                        cakes={recentlyViewed}
                    />

                    {/* Recommended carousel */}
                    <ProductCarousel
                        title="Рекомендовані"
                        subtitle="Вам сподобається"
                        cakes={recommended}
                        linkTo="/cakes"
                        linkText="Весь каталог"
                    />
                </div>
            </div>

            {/* ===== STICKY BOTTOM BAR ===== */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 ${showStickyBar ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
                    {/* Price */}
                    <div className="flex items-baseline gap-1 shrink-0">
                        <span className="text-xl md:text-2xl font-black text-gray-900 leading-none" style={{ fontFamily: "'Oswald', sans-serif" }}>{displayPrice}</span>
                        <span className="text-sm text-gray-400 font-bold">₴</span>
                    </div>

                    {/* Heart */}
                    <button onClick={toggleWishlist} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center shrink-0 hover:border-[#E8C064] transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isWished ? '#E8C064' : 'none'} stroke={isWished ? '#E8C064' : '#ccc'} strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>

                    {/* Buy button */}
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 h-11 bg-[#E8C064] hover:bg-[#D4A83C] text-white rounded-xl font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Купити
                    </button>
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

// Sub-components for carousels
function ProductCarousel({ title, subtitle, cakes, linkTo, linkText }) {
    const scrollRef = React.useRef(null);
    const { addToCart } = useContext(CartContext);

    const scroll = (dir) => {
        if (!scrollRef.current) return;
        const amount = dir === 'left' ? -280 : 280;
        scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    };

    if (!cakes || cakes.length === 0) return null;

    return (
        <div className="mb-12 md:mb-16">
            <div className="flex items-end justify-between mb-5 md:mb-8">
                <div>
                    {subtitle && <div className="text-[#E8C064] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-1">{subtitle}</div>}
                    <h2 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight uppercase leading-none" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        {title}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    {/* Scroll arrows */}
                    <button onClick={() => scroll('left')} className="hidden md:flex w-9 h-9 rounded-full border border-gray-200 items-center justify-center hover:border-[#E8C064] transition-colors">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={() => scroll('right')} className="hidden md:flex w-9 h-9 rounded-full border border-gray-200 items-center justify-center hover:border-[#E8C064] transition-colors">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    {linkTo && (
                        <Link to={linkTo} className="text-[10px] md:text-xs font-black border-b-2 border-[#E8C064] text-[#7A0019] pb-0.5 hover:text-[#9C142B] transition-all uppercase tracking-wider whitespace-nowrap ml-2">
                            {linkText || 'Всі'}
                        </Link>
                    )}
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-2.5 md:gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 -mx-4 px-4 md:-mx-0 md:px-0"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {cakes.map((cake) => (
                    <div key={cake.id} className="shrink-0 w-[42vw] md:w-[220px] lg:w-[240px]" style={{ scrollSnapAlign: 'start' }}>
                        <ProductCard cake={cake} addToCart={addToCart} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProductCard({ cake, addToCart }) {
    return (
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col h-full overflow-hidden">
            <div className="p-2.5 md:p-4 flex flex-col h-full">
                <Link to={getProductUrl(cake)}>
                    <h3 className="text-[10px] md:text-[13px] font-black text-gray-900 uppercase tracking-tight leading-tight line-clamp-2 min-h-[1.8rem] md:min-h-[2.2rem] text-center mb-1 group-hover:text-[#7A0019] transition-colors"
                        style={{ fontFamily: "'Oswald', sans-serif" }}>
                        {cake.name}
                    </h3>
                </Link>

                <Link to={getProductUrl(cake)} className="relative w-full aspect-square mb-1.5 md:mb-2 block">
                    <div className="w-full h-full flex items-center justify-center p-1.5">
                        {cake.image_url && (
                            <img
                                src={cake.image_url.startsWith('http') ? cake.image_url : `${api.defaults.baseURL}${cake.image_url}`}
                                alt={`${cake.name} купити Київ`}
                                className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                        )}
                    </div>
                </Link>

                <div className="flex items-center justify-center gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map(s => (
                        <svg key={s} className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#E8C064]" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>

                <div className="mt-auto flex items-center justify-between gap-1">
                    <div className="flex items-baseline gap-0.5 shrink-0">
                        <span className="text-[16px] md:text-[20px] font-black text-gray-900 leading-none" style={{ fontFamily: "'Oswald', sans-serif" }}>{cake.price}</span>
                        <span className="text-[9px] md:text-[11px] text-gray-400 font-bold">₴</span>
                    </div>
                    <button
                        onClick={() => {
                            const date = new Date();
                            date.setDate(date.getDate() + 3);
                            const defaultDate = date.toISOString().split('T')[0];
                            const CAKE_CATEGORIES = ['bento', 'biscuit', 'wedding', 'mousse', 'Торти', 'cake'];
                            const defaultFlavor = (cake && CAKE_CATEGORIES.includes(cake.category) && FILLINGS.length > 0) ? FILLINGS[0].name : null;
                            addToCart(cake, 1, defaultFlavor, null, defaultDate, 'pickup');
                        }}
                        className="w-7 h-7 md:w-9 md:h-9 flex-shrink-0 bg-[#E8C064] hover:bg-[#D4A83C] text-white rounded-lg md:rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-sm"
                    >
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

// Categories strip component
function CategoriesStrip({ currentCategory }) {
    const mainCategories = [
        { slug: 'bento', name: 'Бенто', icon: '🧁' },
        { slug: 'biscuit', name: 'Бісквітні', icon: '🎂' },
        { slug: 'mousse', name: 'Мусові', icon: '🍰' },
        { slug: 'wedding', name: 'Весільні', icon: '💒' },
        { slug: 'cupcakes', name: 'Капкейки', icon: '🧁' },
        { slug: 'gingerbread', name: 'Пряники', icon: '🍪' },
        { slug: 'birthday', name: 'День народж.', icon: '🎉' },
        { slug: 'kids', name: 'Дитячі', icon: '🎈' },
    ];

    return (
        <div className="mb-10 md:mb-14">
            <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 md:-mx-0 md:px-0">
                {mainCategories.map(cat => (
                    <Link
                        key={cat.slug}
                        to={getCategoryUrl(cat.slug)}
                        className={`shrink-0 flex items-center gap-1.5 md:gap-2 h-9 md:h-10 px-3.5 md:px-5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border-2 active:scale-95 ${currentCategory === cat.slug
                            ? 'bg-[#7A0019] border-[#7A0019] text-white shadow-md'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-[#E8C064] hover:text-[#7A0019]'
                            }`}
                    >
                        <span className="text-sm md:text-base">{cat.icon}</span>
                        {cat.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

// Hook to manage carousel data
function useCarouselData(currentCakeId) {
    const [popular, setPopular] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    useEffect(() => {
        api.get('/cakes/')
            .then(res => {
                const allCakes = res.data;
                const others = allCakes.filter(c => c.id !== currentCakeId);

                // Popular: top 8 by pseudo-popularity (could be replaced with real data)
                const pop = [...others].sort((a, b) => b.price - a.price).slice(0, 8);
                setPopular(pop);

                // Recommended: random 8
                const rec = [...others].sort(() => 0.5 - Math.random()).slice(0, 8);
                setRecommended(rec);

                // Recently viewed from localStorage
                try {
                    const ids = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
                    const viewed = ids.map(id => allCakes.find(c => c.id === id)).filter(Boolean).filter(c => c.id !== currentCakeId);
                    setRecentlyViewed(viewed.slice(0, 8));
                } catch { }
            })
            .catch(err => console.error("Failed to load products", err));
    }, [currentCakeId]);

    return { popular, recommended, recentlyViewed };
}

// Track recently viewed
function useTrackViewed(cakeId) {
    useEffect(() => {
        if (!cakeId) return;
        try {
            let ids = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            ids = ids.filter(id => id !== cakeId);
            ids.unshift(cakeId);
            ids = ids.slice(0, 20);
            localStorage.setItem('recentlyViewed', JSON.stringify(ids));
        } catch { }
    }, [cakeId]);
}

export default CakeDetail;

