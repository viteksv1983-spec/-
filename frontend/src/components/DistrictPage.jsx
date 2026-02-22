import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { FILLINGS } from '../constants/fillings';
import QuickOrderModal from './QuickOrderModal';
import SEOHead from './SEOHead';
import { getProductUrl } from '../utils/urls';
import heroBanner from '../assets/hero-banner.webp';

const DISTRICTS_DATA = {
    'poznyaky': {
        name: 'на Позняках',
        deliveryInfo: 'Швидка доставка мікрорайоном Позняки (Дарницький район). Від 100 грн.',
        description: 'Шукаєте де замовити справжній авторський торт на Позняках? Кондитерська майстерня Antreme пропонує свіжі десерти з натуральних інгредієнтів. Ми знаходимося недалеко, тому гарантуємо швидку та обережну доставку прямо до ваших дверей на Позняках.'
    },
    'osokorky': {
        name: 'на Осокорках',
        deliveryInfo: 'Швидка доставка мікрорайоном Осокорки. Від 100 грн.',
        description: 'Смачні торти на замовлення з доставкою на Осокорки від кондитерської Antreme. Велика палітра смаків, індивідуальні дизайни бенто-тортів, весільних та дитячих тортів.'
    },
    'obolon': {
        name: 'на Оболоні',
        deliveryInfo: 'Надійна доставка на Оболонь авто-холодильником.',
        description: 'Замовити торт на Оболонь стало ще простіше! Майстерня Antreme гарантує ідеальний смак та бездоганний вигляд кожного десерту для вашого свята на Оболоні.'
    },
    'troyeshchyna': {
        name: 'на Троєщині',
        deliveryInfo: 'Доставка на Троєщину у зручний для вас час.',
        description: 'Потрібен торт на свято на Троєщині? Ми створюємо авторські торти, які ідеально доповнять ваше свято. Сучасні дизайни, свіжі ягоди та натуральні вершки.'
    },
    'pechersk': {
        name: 'на Печерську',
        deliveryInfo: 'Преміум доставка на Печерськ.',
        description: 'Шукаєте преміальні торти на Печерську? Кондитерська Antreme пропонує ексклюзивні весільні та корпоративні торти з вишуканим декором та доставкою у центр Києва.'
    }
};

export default function DistrictPage() {
    const { district } = useParams();
    const [cakes, setCakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);
    const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);
    const [selectedCakeForQuickOrder, setSelectedCakeForQuickOrder] = useState(null);

    const districtData = DISTRICTS_DATA[district] || {
        name: `по Києву (${district})`,
        deliveryInfo: 'Доставка у ваш район.',
        description: 'Свіжі авторські торти з доставкою до вашого району.'
    };

    useEffect(() => {
        // Fetch some random/popular cakes for the district page
        api.get('/cakes/')
            .then(res => {
                const shuffled = [...res.data].sort(() => 0.5 - Math.random());
                setCakes(shuffled.slice(0, 8)); // Top 8 cakes
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [district]);

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

    const handleAddToCart = (cake) => {
        const CAKE_CATEGORIES = ['bento', 'biscuit', 'wedding', 'mousse', 'Торти', 'cake'];
        const defaultFlavor = (cake && CAKE_CATEGORIES.includes(cake.category) && FILLINGS.length > 0) ? FILLINGS[0].name : null;
        addToCart(cake, 1, defaultFlavor, null, null, 'pickup');
    };

    const schemaData = {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "Bakery"],
        "name": `Кондитерська Antreme - Доставка ${districtData.name}`,
        "image": "https://antreme.kyiv.ua/og-image.jpg",
        "url": `https://antreme.kyiv.ua/districts/${district}`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Київ",
            "addressRegion": "Київська область",
            "addressCountry": "UA"
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <SEOHead
                title={`Торти на замовлення ${districtData.name} | Доставка - Antreme`}
                description={districtData.description}
                canonical={`/districts/${district}`}
                schema={schemaData}
            />

            {/* Hero Section */}
            <div className="w-full pt-2 md:pt-4 mb-4 md:mb-6 px-4 md:px-10">
                <section
                    className="max-w-[1340px] mx-auto relative flex flex-col md:block rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl overflow-hidden py-16 md:py-24 text-center px-6"
                    style={{ background: 'linear-gradient(135deg, #3D0814 0%, #5a0020 45%, #7b002c 100%)' }}
                >
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url(${heroBanner})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 tracking-tight uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Торти на замовлення <br className="hidden md:block" /> <span className="text-[#F5C24D]">{districtData.name}</span>
                        </h1>
                        <p className="text-white/80 text-sm md:text-lg max-w-2xl mx-auto mb-8 font-medium">
                            {districtData.deliveryInfo} Ми доставляємо свято просто до ваших дверей. Кондитерська Antreme пропонує виключно натуральні та красиві десерти.
                        </p>
                        <a href="#catalog" className="inline-flex items-center gap-2 px-8 py-3 bg-[#E8C064] text-[#4a1c28] hover:bg-[#D4A83C] text-sm md:text-base font-bold uppercase tracking-widest rounded-full transition-all active:scale-95 shadow-lg">
                            Обрати торт
                        </a>
                    </div>
                </section>
            </div>

            {/* SEO Content & Catalog */}
            <div id="catalog" className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">

                <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 mb-12">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Як ми доставляємо торти {districtData.name}?
                    </h2>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        {districtData.description} Усі десерти готуються безпосередньо перед відправкою. Транспортування об'ємних або багатоярусних тортів відбувається зі збереженням температурного режиму.
                    </p>
                    <ul className="list-disc pl-5 text-gray-600 space-y-2">
                        <li><strong>Свіжість:</strong> Ми не заморожуємо готові торти. Все робиться під ваше замовлення.</li>
                        <li><strong>Надійність:</strong> Ваш торт приїде цілим навіть нашими київськими дорогами.</li>
                        <li><strong>Зручність:</strong> Ви можете оплатити доставку кур'єру або на рахунок нашої крамниці.</li>
                    </ul>
                </div>

                <div className="mb-8 flex items-center justify-between border-b pb-4">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Популярні торти
                    </h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#E8C064]/30 border-t-[#E8C064] rounded-full animate-spin"></div></div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                        {cakes.map((cake) => (
                            <div key={cake.id} className="group bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden p-3 md:p-4">
                                <Link to={getProductUrl(cake)} className="block relative w-full aspect-square mb-3">
                                    {cake.image_url && (
                                        <img src={cake.image_url.startsWith('http') ? cake.image_url : `${api.defaults.baseURL}${cake.image_url}`} alt={cake.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                    )}
                                </Link>
                                <Link to={getProductUrl(cake)}>
                                    <h3 className="text-[12px] md:text-[14px] font-black text-gray-900 uppercase tracking-tight leading-tight line-clamp-2 min-h-[2rem] md:min-h-[2.5rem] text-center mb-2 group-hover:text-[#7A0019] transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                        {cake.name}
                                    </h3>
                                </Link>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-[16px] md:text-[20px] font-black" style={{ fontFamily: "'Oswald', sans-serif" }}>{cake.price} <span className="text-[10px] text-gray-400">₴</span></span>
                                    <button onClick={(e) => { e.preventDefault(); handleQuickOrder(cake); }} className="px-3 border border-[#E8C064] text-[#7A0019] text-[9px] md:text-[10px] font-black uppercase rounded-lg h-8 md:h-9 hover:bg-[#FFF8E7] transition-colors whitespace-nowrap">
                                        1 клік
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
