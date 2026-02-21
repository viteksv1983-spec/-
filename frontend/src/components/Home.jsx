import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import logo from '../assets/logo.png';
import { CartContext } from '../context/CartContext';
import QuickOrderModal from './QuickOrderModal';
import heroBanner from '../assets/hero-banner.png';
import mobileHeroBg from '../assets/mobile_hero_bg.png';
import transparentHeroCake from '../assets/transparent-hero-cake.png';
import bentoImg from '../assets/category-bento.png';
import biscuitImg from '../assets/category-biscuit.png';
import mousseImg from '../assets/category-mousse.png';

import { CATEGORIES } from '../constants/categories';

const blockStyles = [
    { bg: 'bg-[#FFF0F5]', border: 'border-pink-100', shadow: 'shadow-[0_8px_30px_rgba(160,21,62,0.06)] hover:shadow-[0_15px_40px_rgba(160,21,62,0.12)]' },
    { bg: 'bg-[#FFFBEB]', border: 'border-amber-100', shadow: 'shadow-[0_8px_30px_rgba(210,170,0,0.06)] hover:shadow-[0_15px_40px_rgba(210,170,0,0.12)]' },
    { bg: 'bg-[#F5F0FF]', border: 'border-purple-100', shadow: 'shadow-[0_8px_30px_rgba(120,60,220,0.06)] hover:shadow-[0_15px_40px_rgba(120,60,220,0.12)]' },
    { bg: 'bg-[#F0F8FF]', border: 'border-blue-100', shadow: 'shadow-[0_8px_30px_rgba(0,100,200,0.06)] hover:shadow-[0_15px_40px_rgba(0,100,200,0.12)]' },
    { bg: 'bg-[#F5FFFA]', border: 'border-teal-100', shadow: 'shadow-[0_8px_30px_rgba(0,150,120,0.06)] hover:shadow-[0_15px_40px_rgba(0,150,120,0.12)]' },
    { bg: 'bg-[#FFF5EE]', border: 'border-orange-100', shadow: 'shadow-[0_8px_30px_rgba(200,100,50,0.06)] hover:shadow-[0_15px_40px_rgba(200,100,50,0.12)]' },
    { bg: 'bg-[#F8F8FF]', border: 'border-indigo-100', shadow: 'shadow-[0_8px_30px_rgba(80,80,200,0.06)] hover:shadow-[0_15px_40px_rgba(80,80,200,0.12)]' },
    { bg: 'bg-[#FFFFF0]', border: 'border-yellow-100', shadow: 'shadow-[0_8px_30px_rgba(200,200,50,0.06)] hover:shadow-[0_15px_40px_rgba(200,200,50,0.12)]' },
    { bg: 'bg-[#F0FFF0]', border: 'border-green-100', shadow: 'shadow-[0_8px_30px_rgba(50,200,50,0.06)] hover:shadow-[0_15px_40px_rgba(50,200,50,0.12)]' },
];

const categoryDescriptions = {
    'wedding': 'Для найголовнішого\nсвята у житті',
    'birthday': 'Яскраві торти для\nвашого свята',
    'anniversary': 'Солідні торти для\nповажних дат',
    'kids': 'Казкові дизайни\nдля малечі',
    'boy': 'Оригінальні торти\nдля хлопчиків',
    'girl': 'Ніжні десерти\nдля дівчаток',
    'for-women': 'Вишукані торти\nдля жінок',
    'for-men': 'Стильні торти\nдля чоловіків',
    'patriotic': 'З любов\'ю\nдо України',
    'gender-reveal': 'Дізнайтесь стать\nмалюка солодко',
    'corporate': 'Індивідуальні\nкорпоративні десерти',
};

const PROMO_CATEGORY_SLUGS = [
    'wedding',
    'birthday',
    'anniversary',
    'kids',
    'patriotic',
    'gender-reveal',
    'for-women',
    'for-men',
    'corporate'
];

const promoCategories = PROMO_CATEGORY_SLUGS.map(slug => CATEGORIES.find(c => c.slug === slug)).filter(Boolean);

function Home() {
    const { addToCart } = useContext(CartContext);
    const [featuredCakes, setFeaturedCakes] = useState([]);
    const [allCakes, setAllCakes] = useState([]);
    const [categoryMetadata, setCategoryMetadata] = useState([]);
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
        // Fetch all cakes
        api.get('/cakes/')
            .then(response => {
                setAllCakes(response.data);
                setFeaturedCakes(response.data.slice(0, 4));
            })
            .catch(error => {
                console.error("Error fetching featured cakes", error);
            });

        // Fetch category metadata for promo blocks
        api.get('/admin/categories/metadata')
            .then(response => {
                setCategoryMetadata(response.data);
            })
            .catch(error => {
                console.error("Error fetching category metadata", error);
            });

        // Trigger fade-in animation
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    return (
        <div className="min-h-screen bg-[#F8F3EE]">
            {/* ====== HERO SECTION ====== */}
            <div className="w-full pt-2 md:pt-4 mb-4 md:mb-6 px-4 md:px-10">
                <section
                    className="max-w-[1340px] mx-auto relative flex flex-col md:block rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #3D0814 0%, #5a0020 45%, #7b002c 100%)' }}
                >
                    {/* === DESKTOP: bg-image approach === */}
                    <img
                        src={heroBanner}
                        alt="Торт Antreme Desktop"
                        className="absolute inset-0 w-full h-full object-cover hidden md:block"
                        style={{ zIndex: 0, objectPosition: 'center right' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />

                    {/* === MOBILE: Transparent PNG Cake overlay === */}
                    <img
                        src={transparentHeroCake}
                        alt="Mobile Hero Cake"
                        className="absolute right-[-10%] bottom-[20%] w-[82%] object-contain md:hidden pointer-events-none"
                        style={{ zIndex: 5, filter: 'brightness(1.2) contrast(1.15) saturate(1.2) drop-shadow(0px 15px 25px rgba(0,0,0,0.6))' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />

                    {/* Desktop gradient overlay */}
                    <div
                        className="absolute inset-0 hidden md:block"
                        style={{
                            background: 'linear-gradient(90deg, rgba(61,8,20,0.95) 0%, rgba(90,0,32,0.85) 35%, rgba(123,0,44,0.45) 60%, rgba(123,0,44,0.15) 80%, transparent 100%)',
                            zIndex: 1
                        }}
                    ></div>

                    {/* Декоративное розовое свечение */}
                    <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-l from-[#C0314A]/15 to-transparent pointer-events-none" style={{ zIndex: 2 }}></div>

                    {/* Золотые боке-частицы */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
                        <div className="absolute top-[8%] right-[12%] w-[80px] h-[80px] rounded-full opacity-[0.12]" style={{ background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)' }}></div>
                        <div className="absolute top-[50%] right-[5%] w-[120px] h-[120px] rounded-full opacity-[0.08]" style={{ background: 'radial-gradient(circle, #F5C24D 0%, transparent 70%)' }}></div>
                        <div className="absolute top-[15%] right-[35%] w-[60px] h-[60px] rounded-full opacity-[0.1]" style={{ background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)' }}></div>
                        <div className="absolute bottom-[20%] right-[18%] w-[90px] h-[90px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #F5C24D 0%, transparent 70%)' }}></div>
                        <div className="absolute top-[65%] right-[40%] w-[50px] h-[50px] rounded-full opacity-[0.09]" style={{ background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)' }}></div>
                        <div className="absolute top-[12%] right-[22%] w-2 h-2 bg-[#FFD700] rounded-full opacity-50 animate-pulse" style={{ boxShadow: '0 0 10px 4px rgba(255,215,0,0.3)' }}></div>
                        <div className="absolute top-[30%] right-[8%] w-1.5 h-1.5 bg-[#F5C24D] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s', boxShadow: '0 0 8px 3px rgba(245,194,77,0.35)' }}></div>
                        <div className="absolute top-[55%] right-[28%] w-1 h-1 bg-[#FFD700] rounded-full opacity-55 animate-pulse" style={{ animationDelay: '0.5s', boxShadow: '0 0 6px 2px rgba(255,215,0,0.4)' }}></div>
                        <div className="absolute top-[22%] right-[45%] w-1.5 h-1.5 bg-[#F5C24D] rounded-full opacity-35 animate-pulse" style={{ animationDelay: '1.5s', boxShadow: '0 0 8px 3px rgba(245,194,77,0.3)' }}></div>
                        <div className="absolute top-[75%] right-[15%] w-1 h-1 bg-[#FFD700] rounded-full opacity-45 animate-pulse" style={{ animationDelay: '2s', boxShadow: '0 0 6px 2px rgba(255,215,0,0.35)' }}></div>
                        <div className="absolute top-[40%] right-[50%] w-2 h-2 bg-[#F5C24D] rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.8s', boxShadow: '0 0 10px 4px rgba(245,194,77,0.25)' }}></div>
                        <div className="absolute top-[5%] right-[30%] w-1 h-1 bg-[#FFD700] rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1.2s', boxShadow: '0 0 6px 2px rgba(255,215,0,0.3)' }}></div>
                        <div className="absolute top-[85%] right-[35%] w-1.5 h-1.5 bg-[#F5C24D] rounded-full opacity-25 animate-pulse" style={{ animationDelay: '2.2s', boxShadow: '0 0 8px 3px rgba(245,194,77,0.2)' }}></div>
                        <div className="absolute top-[10%] right-[15%] w-[300px] h-[300px] rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #FFD700, transparent 60%)' }}></div>
                    </div>

                    {/* === MOBILE FLEX COLUMN: Text(1) → Cake(2) → Buttons(3) === */}
                    {/* === DESKTOP: Flow layout with padding === */}

                    {/* === MOCKUP-STYLE MOBILE CONTENT === */}
                    {/* — ORDER 1: Text Block — */}
                    <div className="relative flex flex-col order-1 px-5 md:px-12 lg:px-16 pt-8 pb-4 md:pb-16 md:pt-16 md:pr-[45%] lg:pr-[42%] md:min-h-[440px] lg:min-h-[480px] justify-center" style={{ zIndex: 10 }}>
                        <div className="w-[65%] md:w-auto">
                            <h1 className="text-[28px] md:text-[40px] lg:text-[50px] xl:text-[56px] font-black text-white leading-[1.15] mb-2 md:mb-3 tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                Торти на <br className="md:hidden" />
                                замовлення <br className="md:hidden" />
                                в Києві
                            </h1>
                            <div className="text-[#F5C24D] text-[11px] md:text-[13px] lg:text-[14px] font-black leading-tight mb-2 md:mb-5 tracking-[0.1em] uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                КОНДИТЕРСЬКА <br className="md:hidden" />
                                МАЙСТЕРНЯ <br className="md:hidden" />
                                ANTREME
                            </div>
                            <p className="text-white/85 text-[11px] md:text-[13px] lg:text-[14px] mb-[10px] md:mb-8 leading-snug font-medium max-w-[400px]">
                                Авторські торти ручної <br className="md:hidden" />
                                роботи <br className="md:hidden" />
                                з натуральних <br className="md:hidden" />
                                інгредієнтів.
                            </p>
                            <p className="text-white/85 text-[11px] md:text-[13px] lg:text-[14px] mb-[10px] md:mb-8 leading-snug font-medium max-w-[400px]">
                                Кожен торт <br className="md:hidden" />
                                створюється <br className="md:hidden" />
                                індивідуально <br className="md:hidden" />
                                протягом 3 днів.
                            </p>
                            <p className="text-white/85 text-[11px] md:text-[13px] lg:text-[14px] mb-0 md:mb-8 leading-snug font-medium max-w-[400px]">
                                Доставка по Києву у зручний для вас час.
                            </p>
                        </div>

                        {/* Desktop buttons (hidden on mobile) */}
                        <div className="hidden md:flex flex-row items-center gap-3 mt-8">
                            <button
                                onClick={handleQuickOrderDefault}
                                className="h-[48px] lg:h-[52px] px-6 lg:px-8 bg-gradient-to-b from-[#FAD872] via-[#F5C24D] to-[#D4A048] hover:brightness-110 text-[#5E0C1B] font-black uppercase tracking-wider text-[12px] lg:text-[13px] rounded-full transition-all duration-300 shadow-[0_8px_20px_rgba(245,194,77,0.45)] active:scale-95 flex items-center justify-center whitespace-nowrap"
                                style={{ fontFamily: "'Oswald', sans-serif" }}
                            >
                                ЗАМОВИТИ ТОРТ
                            </button>
                            <Link
                                to="/cakes"
                                className="h-[48px] lg:h-[52px] px-5 lg:px-6 bg-transparent border border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-black uppercase tracking-wider text-[11px] lg:text-[12px] rounded-full transition-all duration-300 flex items-center justify-center text-center whitespace-nowrap"
                                style={{ fontFamily: "'Oswald', sans-serif" }}
                            >
                                ПЕРЕГЛЯНУТИ КАТАЛОГ
                            </Link>
                        </div>
                    </div>

                    {/* — ORDER 2: Mobile Buttons (at bottom) — */}
                    <div className="relative order-2 md:hidden flex flex-row items-center justify-start gap-2 px-5 pb-7 mt-3" style={{ zIndex: 10 }}>
                        <button
                            onClick={handleQuickOrderDefault}
                            className="flex-1 h-[42px] bg-gradient-to-b from-[#FAD872] via-[#F5C24D] to-[#D4A048] hover:brightness-110 text-[#5E0C1B] font-black uppercase tracking-wider text-[11px] rounded-[20px] transition-all duration-300 shadow-[0_4px_12px_rgba(245,194,77,0.3)] min-w-[140px]"
                            style={{ fontFamily: "'Oswald', sans-serif" }}
                        >
                            ЗАМОВИТИ ТОРТ
                        </button>
                        <Link
                            to="/cakes"
                            className="flex-1 h-[42px] bg-[#9e1634] bg-opacity-90 border border-white/20 hover:bg-[#8B1030] text-white font-black uppercase tracking-[0.05em] text-[10px] rounded-[20px] transition-all duration-300 shadow-sm flex flex-col items-center justify-center leading-[1.2]"
                            style={{ fontFamily: "'Oswald', sans-serif" }}
                        >
                            <span>ПЕРЕГЛЯНУТИ</span>
                            <span>КАТАЛОГ</span>
                        </Link>
                    </div>
                </section>
            </div>


            {/* ====== CATEGORY CARDS — горизонтальный макет: текст слева, фото справа ====== */}
            <div className="w-full px-3 md:px-8 pt-4 md:pt-6 pb-8 md:pb-10" id="categories">
                <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {promoCategories.map((cat, index) => {
                        const style = blockStyles[index % blockStyles.length];
                        const meta = categoryMetadata.find(m => m.slug === cat.slug);
                        let imgUrl = meta?.image_url;
                        if (imgUrl && !imgUrl.startsWith('http')) {
                            imgUrl = `${api.defaults.baseURL}${imgUrl}`;
                        } else if (!imgUrl) {
                            imgUrl = `https://placehold.co/400x400/fff/7b002c?text=${cat.name}`;
                        }

                        const desc = categoryDescriptions[cat.slug] || 'Ексклюзивні торти\nна замовлення';

                        return (
                            <div key={cat.slug} className={`group relative flex flex-row items-center ${style.bg} rounded-[1.5rem] md:rounded-[2rem] ${style.shadow} transition-all duration-500 overflow-visible ${style.border} border hover:-translate-y-1 min-h-[130px] md:min-h-[160px]`}>
                                <div className="flex-1 px-5 md:px-7 py-5 md:py-7 z-10 w-[60%]">
                                    <h3 className="text-[17px] md:text-[20px] lg:text-[22px] font-black text-gray-900 mb-1.5 uppercase tracking-tight leading-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                        {cat.name}
                                    </h3>
                                    <p className="text-gray-500 mb-4 text-[11px] md:text-[13px] font-medium leading-snug whitespace-pre-line">
                                        {desc}
                                    </p>
                                    <Link to={`/cakes?category=${cat.slug}`} className="inline-block bg-white text-gray-800 border border-gray-200 px-5 py-2 font-black uppercase text-[10px] md:text-[11px] tracking-[0.15em] transition-all shadow-sm hover:shadow-md hover:bg-gray-900 hover:text-white rounded-full">
                                        ПЕРЕГЛЯНУТИ
                                    </Link>
                                </div>
                                <div className="relative flex-shrink-0 w-[110px] md:w-[150px] self-end pr-2 md:pr-4 pb-2 md:pb-4">
                                    <img src={imgUrl} alt={cat.name} className="w-full h-auto max-h-[120px] md:max-h-[160px] object-contain mix-blend-multiply group-hover:scale-105 group-hover:-translate-y-1 transition-transform duration-500" />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Visual Impact Section - Premium Value Proportions */}
            <div className="container mx-auto px-4 md:px-8 mb-32">
                <div className="relative bg-white py-20 md:py-28 overflow-hidden rounded-[4rem] border border-gray-50 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-5xl mx-auto text-center">
                            <h2 className="text-5xl md:text-8xl lg:text-[110px] font-black mb-10 leading-none uppercase tracking-tighter" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                <span className="text-[#FFD700] block md:inline translate-y-2 drop-shadow-sm">СМАК</span>
                                <span className="text-gray-100 mx-4 hidden md:inline">/</span>
                                <span className="text-[#FFD700] block md:inline drop-shadow-sm">ЯКІСТЬ</span>
                                <span className="text-gray-100 mx-4 hidden md:inline">/</span>
                                <span className="text-[#FFD700] block md:inline -translate-y-2 drop-shadow-sm">ЦІНА</span>
                            </h2>
                            <div className="flex items-center justify-center gap-4 text-gray-400">
                                <div className="h-[1px] w-12 bg-gray-200"></div>
                                <p className="text-xl md:text-3xl font-medium italic text-gray-500" style={{ fontFamily: "'Dancing Script', cursive" }}>
                                    це наші головні цінності
                                </p>
                                <div className="h-[1px] w-12 bg-gray-200"></div>
                            </div>
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

                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight animate-fade-in uppercase tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                ТОРТИ З <span className="text-[#7A0019]">ДУШЕЮ</span> ТА <span className="text-[#FFD700]">ЛЮБОВ'Ю</span>
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

            {/* Holiday Cakes Promo Section - Modern & Clean */}
            <section className="py-20 md:py-32 bg-white overflow-hidden">
                <div className="container mx-auto px-4 md:px-8">
                    <Link to="/holiday" className="group block relative overflow-hidden rounded-[4rem] bg-[#FDFBF7] border border-gray-50 shadow-2xl shadow-gray-100">
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
            {/* Featured Products */}
            <div className="container mx-auto px-6 pt-10 md:pt-20 pb-16 md:pb-20 bg-white shadow-sm">
                <div className="text-center mb-6 md:mb-12 animate-fade-in">
                    <div className="text-sm text-amber-700 mb-1 uppercase tracking-widest">Популярні</div>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-2 md:mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Обирають найчастіше
                    </h2>
                </div>

                {featuredCakes.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
                            {featuredCakes.map((cake, index) => (
                                <div
                                    key={cake.id}
                                    className="group flex flex-col bg-white rounded-[2rem] shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition-all duration-500 border border-gray-100 p-5 md:p-6 pb-6 md:pb-8 h-full animate-fade-in-stagger"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Image Container */}
                                    <Link to={`/cakes/${cake.id}`} className="relative w-full aspect-square mb-4 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-[#f8f5f2] rounded-full scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        {/* Badges - Circular maroon style */}
                                        <div className="absolute top-0 left-0 flex flex-col gap-2 z-20 pointer-events-none">
                                            {index === 0 && (
                                                <div className="bg-[#7b002c] text-white text-[7px] md:text-[9px] font-black uppercase w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white tracking-tighter">
                                                    Хіт
                                                </div>
                                            )}
                                        </div>

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
                                                        addToCart(cake);
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
                        <div className="text-center mt-12 animate-fade-in-delayed">
                            <Link to="/cakes" className="group inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-12 py-5 font-bold uppercase text-sm tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 duration-300">
                                <span className="flex items-center justify-center gap-2">
                                    Всі пропозиції
                                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                                </span>
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-[#7b002c]/20 border-t-[#7b002c] rounded-full animate-spin mb-4"></div>
                        <div className="text-gray-500 font-medium tracking-wider text-sm animate-pulse uppercase">Завантаження шедеврів...</div>
                    </div>
                )}
            </div>

            {/* Call to Action Banner - Caramel/Sand style */}
            <div className="relative bg-[#D39A5E] text-gray-900 py-20 overflow-hidden border-y border-[#D39A5E]/10 shadow-sm">
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
        </div >
    );
}

export default Home;
