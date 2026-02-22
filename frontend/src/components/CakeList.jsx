import React, { useEffect, useState, useContext, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { FILLINGS } from '../constants/fillings';
import QuickOrderModal from './QuickOrderModal';
import SEOHead from './SEOHead';
import { categorySeoData } from '../constants/categorySeo';
import { marked } from 'marked';

function CakeList({ predefinedCategory, predefinedSlug }) {
    const [cakes, setCakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
    const [selectedCakeForQuickOrder, setSelectedCakeForQuickOrder] = useState(null);
    const [wishlist, setWishlist] = useState(() => {
        try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); } catch { return []; }
    });
    const { addToCart } = useContext(CartContext);
    const [searchParams] = useSearchParams();
    const categoryQuery = searchParams.get('category');
    const category = predefinedCategory || categoryQuery;
    const searchQuery = searchParams.get('search');

    // Retrieve SEO Data if available
    const seoData = category ? categorySeoData[category] : null;

    // ===== FILTER & SORT STATE =====
    const [sortBy, setSortBy] = useState('popular');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [selectedWeights, setSelectedWeights] = useState([]);
    const [onlyAvailable, setOnlyAvailable] = useState(false);

    useEffect(() => {
        setLoading(true);
        api.get('/cakes/', { params: { category } })
            .then(response => {
                setCakes(response.data);
                setLoading(false);
                // Set initial price range based on data
                if (response.data.length > 0) {
                    const prices = response.data.map(c => c.price);
                    setPriceRange([Math.min(...prices), Math.max(...prices)]);
                }
            })
            .catch(error => {
                console.error("There was an error fetching the cakes!", error);
                setLoading(false);
            });
    }, [category]);

    // Price bounds from data
    const priceBounds = useMemo(() => {
        if (cakes.length === 0) return [0, 10000];
        const prices = cakes.map(c => c.price);
        return [Math.min(...prices), Math.max(...prices)];
    }, [cakes]);

    const handleAddToCart = (cake) => {
        const CAKE_CATEGORIES = ['bento', 'biscuit', 'wedding', 'mousse', 'Торти', 'cake'];
        const defaultFlavor = (cake && CAKE_CATEGORIES.includes(cake.category) && FILLINGS.length > 0) ? FILLINGS[0].name : null;
        addToCart(cake, 1, defaultFlavor, null, null, 'pickup');
    };

    const toggleWishlist = (cakeId) => {
        setWishlist(prev => {
            const next = prev.includes(cakeId) ? prev.filter(id => id !== cakeId) : [...prev, cakeId];
            localStorage.setItem('wishlist', JSON.stringify(next));
            return next;
        });
    };

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
        if (seoData && seoData.h1) return seoData.h1;
        if (!category) return 'ВСЯ КОЛЕКЦІЯ';
        return categoryLabels[category]?.toUpperCase() || 'ПРОДУКЦІЯ';
    };

    // ===== FILTER + SORT LOGIC =====
    const getProcessedCakes = () => {
        let result = [...cakes];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(cake =>
                cake.name.toLowerCase().includes(query) ||
                (cake.description && cake.description.toLowerCase().includes(query)) ||
                (cake.category && cake.category.toLowerCase().includes(query))
            );
        }

        // Price filter
        result = result.filter(c => c.price >= priceRange[0] && c.price <= priceRange[1]);

        // Weight filter
        if (selectedWeights.length > 0) {
            result = result.filter(c => {
                const w = c.weight || (c.category === 'bento' ? 450 : c.category === 'cupcakes' ? 80 : 1000);
                const wKg = w < 10 ? w : w / 1000;
                return selectedWeights.some(sw => {
                    if (sw === 'mini') return wKg <= 0.5;
                    if (sw === 'small') return wKg > 0.5 && wKg <= 1;
                    if (sw === 'medium') return wKg > 1 && wKg <= 2;
                    if (sw === 'large') return wKg > 2;
                    return true;
                });
            });
        }

        // Sort
        if (sortBy === 'cheap') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'expensive') result.sort((a, b) => b.price - a.price);
        else if (sortBy === 'new') result.sort((a, b) => b.id - a.id);
        // 'popular' = default order

        return result;
    };

    const processedCakes = getProcessedCakes();

    // Active filter count (for badge)
    const activeFilterCount = (
        (priceRange[0] > priceBounds[0] || priceRange[1] < priceBounds[1] ? 1 : 0) +
        (selectedWeights.length > 0 ? 1 : 0) +
        (onlyAvailable ? 1 : 0)
    );

    const resetFilters = () => {
        setPriceRange(priceBounds);
        setSelectedWeights([]);
        setOnlyAvailable(false);
    };

    const handleQuickOrder = (cake) => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        const defaultDate = date.toISOString().split('T')[0];

        const CAKE_CATEGORIES = ['bento', 'biscuit', 'wedding', 'mousse', 'Торти', 'cake'];
        const defaultFlavor = (cake && CAKE_CATEGORIES.includes(cake.category) && FILLINGS.length > 0) ? FILLINGS[0].name : null;

        setSelectedCakeForQuickOrder({
            ...cake,
            deliveryDate: defaultDate,
            deliveryMethod: 'pickup',
            flavor: defaultFlavor
        });
        setIsQuickOrderOpen(true);
    };

    const getRating = (id) => {
        const seed = ((id * 7 + 13) % 20) / 20;
        return { stars: 5, count: Math.floor(seed * 40 + 5) };
    };

    const getWeight = (cake) => {
        if (cake.weight) return cake.weight;
        if (cake.category === 'bento') return '450Г';
        if (cake.category === 'cupcakes') return '80Г';
        return '1000Г';
    };

    const toggleWeight = (w) => {
        setSelectedWeights(prev => prev.includes(w) ? prev.filter(x => x !== w) : [...prev, w]);
    };

    const sortOptions = [
        { key: 'popular', label: 'Популярні' },
        { key: 'cheap', label: 'Дешевші' },
        { key: 'expensive', label: 'Дорожчі' },
        { key: 'new', label: 'Нові' },
    ];

    const weightChips = [
        { key: 'mini', label: 'до 500г', icon: '🧁' },
        { key: 'small', label: '0.5–1 кг', icon: '🎂' },
        { key: 'medium', label: '1–2 кг', icon: '🎂' },
        { key: 'large', label: '2+ кг', icon: '🎂' },
    ];

    const breadcrumbs = [{
        "@type": "ListItem",
        "position": 1,
        "name": "Головна",
        "item": "https://antreme.kyiv.ua/"
    }, {
        "@type": "ListItem",
        "position": 2,
        "name": "Каталог",
        "item": "https://antreme.kyiv.ua/cakes"
    }];

    if (category) {
        breadcrumbs.push({
            "@type": "ListItem",
            "position": 3,
            "name": getCategoryTitle(),
            "item": `https://antreme.kyiv.ua/cakes?category=${category}`
        });
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs
    };

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": processedCakes.map((cake, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "url": `https://antreme.kyiv.ua/cakes/${cake.id}`
        }))
    };

    const schemaData = [breadcrumbSchema, itemListSchema];

    const canonicalUrl = predefinedSlug ? `/${predefinedSlug}` : (category ? `/cakes?category=${category}` : '/cakes');

    const metaTitle = seoData ? seoData.title : `${getCategoryTitle()} | Купити торти в Києві – Antreme`;
    const metaDesc = seoData ? seoData.description : `Шукаєте ${getCategoryTitle().toLowerCase()}? В кондитерській Antreme величезний вибір свіжих десертів з натуральних інгредієнтів. Адресна доставка по Києву.`;

    return (
        <div className="min-h-screen bg-white">
            <SEOHead
                title={metaTitle}
                description={metaDesc}
                canonical={canonicalUrl}
                schema={schemaData}
            />
            {/* Page Header */}
            <div className="bg-white pt-6 md:pt-12 pb-4 md:pb-8 px-4 md:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-6xl font-black text-gray-900 uppercase tracking-tight mb-2 md:mb-4"
                        style={{ fontFamily: "'Oswald', sans-serif" }}>
                        {getCategoryTitle()}
                    </h1>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="h-[1px] w-8 md:w-12 bg-gray-200" />
                        <p className="text-gray-500 text-xs md:text-base font-medium italic"
                            style={{ fontFamily: "'Dancing Script', cursive" }}>
                            {getCategorySubtitle()}
                        </p>
                        <div className="h-[1px] w-8 md:w-12 bg-gray-200" />
                    </div>
                </div>
            </div>

            {/* ===== SORT CHIPS + FILTER BUTTON ===== */}
            <div className="max-w-7xl mx-auto px-2 md:px-6 mb-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:justify-center">
                    {/* Sort chips */}
                    {sortOptions.map(opt => (
                        <button
                            key={opt.key}
                            onClick={() => setSortBy(opt.key)}
                            className={`shrink-0 h-9 md:h-10 px-4 md:px-5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-wider transition-all active:scale-95 border-2 ${sortBy === opt.key
                                ? 'bg-[#7A0019] border-[#7A0019] text-white shadow-md'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}

                    {/* Divider */}
                    <div className="w-px h-6 bg-gray-200 shrink-0 mx-1" />

                    {/* Filter button */}
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="shrink-0 h-9 md:h-10 px-4 md:px-5 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-wider transition-all active:scale-95 border-2 border-gray-200 text-gray-600 hover:border-[#E8C064] hover:text-[#7A0019] bg-white flex items-center gap-2 relative"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Фільтр
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#E8C064] text-[#4a1c28] text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>


            </div>

            {/* ===== PRODUCT GRID ===== */}
            <div className="max-w-7xl mx-auto px-2 md:px-6 pb-16">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-14 h-14 border-4 border-[#E8C064]/30 border-t-[#E8C064] rounded-full animate-spin mb-5" />
                        <div className="text-gray-500 font-bold uppercase tracking-widest text-xs">Завантаження...</div>
                    </div>
                ) : processedCakes.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-5xl mb-5 opacity-30">🔍</div>
                        <p className="text-gray-500 text-base font-medium mb-2">Нічого не знайдено</p>
                        <p className="text-gray-400 text-sm mb-6">Спробуйте змінити параметри фільтра</p>
                        <button
                            onClick={resetFilters}
                            className="inline-block text-[#7A0019] font-bold uppercase tracking-widest text-xs border-b-2 border-[#7A0019] pb-1 hover:text-[#9C142B] transition-all"
                        >
                            Скинути фільтри
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-5">
                        {processedCakes.map((cake, index) => {
                            const rating = getRating(cake.id);
                            const weight = getWeight(cake);
                            const isWished = wishlist.includes(cake.id);

                            return (
                                <div key={cake.id}
                                    className="group bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col h-full overflow-hidden relative"
                                >
                                    <div className="p-3 md:p-4 flex flex-col h-full">

                                        {/* Title at top */}
                                        <Link to={`/cakes/${cake.id}`}>
                                            <h3 className="text-[11px] md:text-[14px] font-black text-gray-900 uppercase tracking-tight leading-tight line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] text-center mb-1 group-hover:text-[#7A0019] transition-colors"
                                                style={{ fontFamily: "'Oswald', sans-serif" }}>
                                                {cake.name}
                                            </h3>
                                        </Link>

                                        {/* Image + Wishlist */}
                                        <div className="relative w-full aspect-square mb-2">
                                            <button
                                                onClick={(e) => { e.preventDefault(); toggleWishlist(cake.id); }}
                                                className="absolute top-0 right-0 z-20 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full transition-all"
                                                title="Додати в обране"
                                            >
                                                <svg className="w-5 h-5 md:w-6 md:h-6 transition-colors" viewBox="0 0 24 24"
                                                    fill={isWished ? '#E8C064' : 'none'}
                                                    stroke={isWished ? '#E8C064' : '#ccc'}
                                                    strokeWidth="2">
                                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                </svg>
                                            </button>

                                            {index < 2 && (
                                                <div className="absolute top-0 left-0 z-20 bg-[#E8C064] text-[#4a1c28] text-[8px] md:text-[10px] font-black uppercase px-2 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-sm tracking-wider">
                                                    ХІТ
                                                </div>
                                            )}

                                            <Link to={`/cakes/${cake.id}`} className="block w-full h-full flex items-center justify-center p-1">
                                                {cake.image_url && (
                                                    <img
                                                        src={cake.image_url.startsWith('http') ? cake.image_url : `${api.defaults.baseURL}${cake.image_url}`}
                                                        alt={`${cake.name} купити Київ`}
                                                        className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                                                        loading="lazy"
                                                    />
                                                )}
                                            </Link>
                                        </div>

                                        {/* Stars rating */}
                                        <div className="flex items-center justify-center gap-1 mb-1.5">
                                            <div className="flex items-center gap-px">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <svg key={s} className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#E8C064]" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-[10px] md:text-xs text-gray-400 font-medium ml-0.5">{rating.count}</span>
                                        </div>

                                        {/* Weight + Availability */}
                                        <div className="flex flex-col items-center gap-0.5 mb-2 md:mb-3">
                                            <span className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-wide">{weight}</span>
                                            <div className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                                                <span className="text-[9px] md:text-[10px] text-green-600 font-bold uppercase tracking-wider">Можливе замовлення</span>
                                            </div>
                                        </div>

                                        {/* Price + Buttons */}
                                        <div className="mt-auto flex items-center justify-between gap-1.5">
                                            <div className="flex items-baseline gap-1 min-w-0 shrink-0">
                                                <span className="text-[18px] md:text-[22px] font-black text-gray-900 leading-none"
                                                    style={{ fontFamily: "'Oswald', sans-serif" }}>
                                                    {cake.price}
                                                </span>
                                                <span className="text-[10px] md:text-xs text-gray-400 font-bold">₴</span>
                                            </div>

                                            <div className="flex items-center gap-1 md:gap-1.5">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); handleQuickOrder(cake); }}
                                                    className="h-8 md:h-10 px-2.5 md:px-4 border-2 border-[#E8C064] text-[#7A0019] rounded-lg md:rounded-xl font-black uppercase text-[8px] md:text-[10px] tracking-wider hover:bg-[#FFF8E7] active:scale-95 transition-all whitespace-nowrap"
                                                >
                                                    1 клік
                                                </button>
                                                <button
                                                    onClick={(e) => { e.preventDefault(); handleAddToCart(cake); }}
                                                    className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 bg-[#E8C064] hover:bg-[#D4A83C] text-white rounded-lg md:rounded-xl flex items-center justify-center active:scale-95 transition-all shadow-sm"
                                                >
                                                    <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <circle cx="9" cy="21" r="1" />
                                                        <circle cx="20" cy="21" r="1" />
                                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ===== CATEGORY SEO TEXT ===== */}
            {seoData && seoData.seoText && (
                <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
                    <div
                        className="prose prose-sm md:prose-base prose-stone max-w-none prose-headings:text-[#7A0019] prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-black prose-h2:uppercase prose-h2:tracking-tight prose-h2:mt-12 prose-h2:mb-6 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900 prose-strong:font-bold prose-ul:list-disc prose-ol:list-decimal"
                        dangerouslySetInnerHTML={{ __html: marked.parse(seoData.seoText) }}
                    />
                </div>
            )}

            {/* ===== FILTER BOTTOM SHEET (OVERLAY) ===== */}
            {isFilterOpen && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />

                    {/* Sheet */}
                    <div className="relative w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl max-h-[85vh] overflow-y-auto shadow-2xl animate-slide-up">
                        {/* Handle bar (mobile) */}
                        <div className="sticky top-0 bg-white rounded-t-3xl md:rounded-t-3xl z-10 border-b border-gray-100">
                            <div className="flex justify-center pt-3 pb-1 md:hidden">
                                <div className="w-10 h-1 bg-gray-300 rounded-full" />
                            </div>
                            <div className="flex items-center justify-between px-6 py-4">
                                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                    Фільтр
                                </h3>
                                <button onClick={() => setIsFilterOpen(false)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="px-6 py-5 space-y-8">

                            {/* === Price Range === */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">
                                    Ціна, ₴
                                </label>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-1">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Від</span>
                                        <input
                                            type="number"
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#E8C064] transition-all"
                                        />
                                    </div>
                                    <div className="w-4 h-0.5 bg-gray-300 mt-5" />
                                    <div className="flex-1">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">До</span>
                                        <input
                                            type="number"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#E8C064] transition-all"
                                        />
                                    </div>
                                </div>
                                {/* Slider */}
                                <input
                                    type="range"
                                    min={priceBounds[0]}
                                    max={priceBounds[1]}
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                    className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#E8C064]"
                                />
                            </div>

                            {/* === Weight === */}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                                    Вага
                                </label>
                                <div className="grid grid-cols-2 gap-2.5">
                                    {weightChips.map(w => (
                                        <button
                                            key={w.key}
                                            onClick={() => toggleWeight(w.key)}
                                            className={`h-12 rounded-xl font-bold text-sm transition-all border-2 flex items-center justify-center gap-2 active:scale-95 ${selectedWeights.includes(w.key)
                                                ? 'bg-[#7A0019] border-[#7A0019] text-white shadow-md'
                                                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            <span className="text-base">{w.icon}</span>
                                            {w.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom actions */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center gap-3">
                            <button
                                onClick={resetFilters}
                                className="h-12 px-5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-wider hover:border-gray-300 active:scale-95 transition-all"
                            >
                                Скинути
                            </button>
                            <button
                                onClick={() => setIsFilterOpen(false)}
                                className="flex-1 h-12 bg-[#E8C064] hover:bg-[#D4A83C] text-white rounded-xl font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                            >
                                Показати {processedCakes.length} {processedCakes.length === 1 ? 'товар' : processedCakes.length < 5 ? 'товари' : 'товарів'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter bottom-sheet animation */}
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>

            <QuickOrderModal
                isOpen={isQuickOrderOpen}
                onClose={() => setIsQuickOrderOpen(false)}
                cake={selectedCakeForQuickOrder}
                deliveryDate={selectedCakeForQuickOrder?.deliveryDate}
                deliveryMethod={selectedCakeForQuickOrder?.deliveryMethod}
                flavor={selectedCakeForQuickOrder?.flavor}
            />
        </div>
    );
}

export default CakeList;
