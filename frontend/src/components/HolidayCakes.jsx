import { getCategoryUrl } from '../utils/urls';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { HOLIDAY_SUB_CATEGORIES, CATEGORIES } from '../constants/categories';
import SEOHead from './SEOHead';

function HolidayCakes() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const response = await api.get('/admin/categories/metadata');
            const metadata = response.data;

            const enriched = HOLIDAY_SUB_CATEGORIES.map(cat => {
                const meta = metadata.find(m => m.slug === cat.slug);
                let img = meta?.image_url;
                if (img && !img.startsWith('http')) {
                    img = `${api.defaults.baseURL}${img}`;
                }
                return {
                    ...cat,
                    title: cat.name.toUpperCase(),
                    img: img || `https://placehold.co/400x400/2d0018/FFD700?text=${cat.name}`
                };
            });

            setCategories(enriched);
        } catch (error) {
            console.error("Failed to fetch categories", error);
            setCategories(HOLIDAY_SUB_CATEGORIES.map(cat => ({
                ...cat,
                title: cat.name.toUpperCase(),
                img: `https://placehold.co/400x400/2d0018/FFD700?text=${cat.name}`
            })));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f6f4ed]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800" />
            </div>
        );
    }

    const getAltText = (slug, defaultTitle) => {
        const altMap = {
            'wedding': 'Весільні торти на замовлення в Києві',
            'kids': 'Дитячі торти Київ',
            'for-women': 'Торт для жінки на замовлення Київ',
            'for-men': 'Торт для чоловіка Київ',
            'anniversary': 'Ювілейний торт Київ'
        };
        return altMap[slug] || `${defaultTitle} Київ`;
    };

    return (
        <div className="min-h-screen bg-[#f6f4ed] pb-20">
            <SEOHead
                title="Торти на свято на замовлення в Києві | Святкові торти - Antreme"
                description="Замовити святковий торт у Києві: на день народження, ювілей, дитячі свята, весілля та корпоративи. Ексклюзивні дизайни, натуральні інгредієнти, доставка від Antreme."
                schema={[
                    {
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": "Торти на замовлення в Києві",
                        "description": "Замовити торт у Києві від кондитерської Antreme. Весільні, дитячі, святкові та корпоративні торти з доставкою.",
                        "url": "https://antreme.kyiv.ua/torty-na-zamovlennya/",
                        "hasPart": {
                            "@type": "ItemList",
                            "itemListElement": [
                                { "@type": "ListItem", "position": 1, "name": "Весільні торти" },
                                { "@type": "ListItem", "position": 2, "name": "Дитячі торти" },
                                { "@type": "ListItem", "position": 3, "name": "Торти на день народження" },
                                { "@type": "ListItem", "position": 4, "name": "Корпоративні торти" }
                            ]
                        }
                    }
                ]}
            />

            {/* Page Hero */}
            <div className="pt-10 pb-6 md:pt-14 md:pb-8 text-center flex flex-col items-center">
                <div className="container mx-auto px-6 flex flex-col items-center">
                    <h1 className="text-3xl md:text-5xl font-black text-[#3b1218] uppercase tracking-wide mb-3"
                        style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Торти на замовлення
                    </h1>
                    {/* Decorative Flourish */}
                    <div className="w-full max-w-sm mx-auto flex justify-center mb-8">
                        <svg width="280" height="20" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80 drop-shadow-sm">
                            <path d="M0,10 Q75,10 145,16 Q150,17 150,17 Q150,17 155,16 Q225,10 300,10 Q225,12 155,18 Q150,19 150,19 Q150,19 145,18 Q75,12 0,10 Z" fill="#c3a272" />
                            <path d="M10,14 Q75,14 145,18 Q150,19 150,19 Q150,19 155,18 Q225,14 290,14" stroke="#c3a272" strokeWidth="0.5" fill="none" />
                        </svg>
                    </div>

                    <div className="max-w-3xl mx-auto text-center mb-8 px-4">
                        <p className="text-gray-700 text-sm md:text-base mb-6 leading-relaxed">
                            Замовити торт у Києві — індивідуальний підхід до кожного свята. Створюємо авторські торти з натуральних інгредієнтів. Понад 6000 виконаних замовлень та доставка по всіх районах Києва.
                        </p>

                        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                            <span className="bg-white/80 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-[#1d263b] shadow-sm border border-[#E8C064]/30 flex items-center gap-1.5">
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#E8C064]"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                Індивідуальний дизайн та декор
                            </span>
                            <span className="bg-white/80 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-[#1d263b] shadow-sm border border-[#E8C064]/30 flex items-center gap-1.5">
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#E8C064]"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                Понад 15 авторських начинок
                            </span>
                            <span className="bg-white/80 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-[#1d263b] shadow-sm border border-[#E8C064]/30 flex items-center gap-1.5">
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#E8C064]"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                Прозора вартість без прихованих доплат
                            </span>
                            <span className="bg-white/80 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-[#1d263b] shadow-sm border border-[#E8C064]/30 flex items-center gap-1.5">
                                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#E8C064]"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                Доставка у всі райони Києва
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8">

                {/* Category Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl lg:max-w-[1050px] mx-auto">
                    {categories.map((cat, index) => (
                        <Link
                            key={index}
                            to={getCategoryUrl(cat.slug)}
                            className="group bg-white rounded-3xl overflow-hidden flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            {/* Image */}
                            <div className="w-full aspect-square overflow-hidden p-4">
                                <img
                                    src={cat.img}
                                    alt={getAltText(cat.slug, cat.title)}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        if (e.target.src !== 'https://placehold.co/400x400/f6f4ed/1d263b?text=Antreme') {
                                            e.target.src = 'https://placehold.co/400x400/f6f4ed/1d263b?text=Antreme';
                                        }
                                    }}
                                />
                            </div>

                            {/* Title */}
                            <div className="w-full p-4 md:p-5 text-center">
                                <h3 className="text-sm md:text-base font-black text-[#1d263b] uppercase tracking-tight text-center leading-tight group-hover:text-antreme-red transition-colors duration-300"
                                    style={{ fontFamily: "'Oswald', sans-serif" }}>
                                    {cat.title}
                                </h3>
                            </div>

                            {/* Gold bottom accent */}
                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-antreme-red scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500" />
                        </Link>
                    ))}
                </div>

                {/* ОСНОВНИЙ SEO-БЛОК ВНИЗУ СТРАНИЦЫ */}
                <section className="seo-content-block container mx-auto max-w-4xl bg-white rounded-3xl p-8 md:p-14 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mt-16 mb-12">
                    <h2 className="text-2xl md:text-3xl font-black text-[#1d263b] mb-6 tracking-tight text-center md:text-left" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Торти на замовлення в Києві — ціна, терміни, умови
                    </h2>
                    <div className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed md:leading-loose">
                        <p>
                            Якщо ви шукаєте, де замовити торт у Києві з гарантією якості та своєчасної доставки, Antreme пропонує професійний підхід до кожного замовлення. Ми працюємо виключно під індивідуальний запит — від мінімалістичних бенто-тортів до багатоярусних <Link to="/torty-na-zamovlennya/vesilni/" className="text-[#a0153e] font-medium hover:underline">весільних композицій</Link>.
                        </p>

                        <h3 className="text-lg md:text-xl font-bold text-[#1d263b] mt-8 mb-4">Скільки коштує торт на замовлення?</h3>
                        <p>Вартість залежить від ваги, складності декору та обраної начинки:</p>
                        <ul className="list-disc list-inside space-y-1 my-4">
                            <li>Бенто-торти — від 300 грн</li>
                            <li>Святкові та дитячі торти — від 650 грн за 1 кг</li>
                            <li>Весільні торти — розрахунок індивідуально</li>
                            <li>Корпоративні торти — за технічним завданням</li>
                        </ul>
                        <p>Мінімальна вага стандартного торта — від 1 кг.</p>

                        <h3 className="text-lg md:text-xl font-bold text-[#1d263b] mt-8 mb-4">Доставка тортів по Києву</h3>
                        <p>Ми доставляємо торти у всі райони Києва: Печерський, Шевченківський, Голосіївський, Солом’янський, Дарницький, Оболонський, Подільський, Деснянський та інші. Доставка здійснюється з дотриманням температурного режиму.</p>

                        <h3 className="text-lg md:text-xl font-bold text-[#1d263b] mt-8 mb-4">Чому варто замовити торт саме у Antreme?</h3>
                        <ul className="list-disc list-inside space-y-1 my-4">
                            <li>Натуральні інгредієнти преміум-класу</li>
                            <li>Власне виробництво без посередників</li>
                            <li>Понад 6000 виконаних замовлень</li>
                            <li><Link to="/vidguky/" className="text-[#a0153e] font-medium hover:underline">Реальні відгуки клієнтів</Link></li>
                            <li>Контроль якості на кожному етапі</li>
                        </ul>

                        <h3 className="text-lg md:text-xl font-bold text-[#1d263b] mt-8 mb-4">Як оформити замовлення?</h3>
                        <ol className="list-decimal list-inside space-y-1 my-4">
                            <li>Обрати категорію та дизайн</li>
                            <li>Узгодити начинку та вагу</li>
                            <li>Погодити дату доставки</li>
                            <li>Внести передоплату для фіксації замовлення</li>
                        </ol>
                        <p className="mt-6 font-medium">
                            Замовити торт можна через форму на сайті або за телефоном у контактах.
                        </p>
                    </div>
                </section>

                {/* FAQ БЛОК */}
                <section className="faq container mx-auto max-w-5xl lg:max-w-[1050px] mb-16">
                    <h2 className="text-2xl md:text-3xl font-black text-[#1d263b] mb-6 text-center tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Часті запитання
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-gray-900 mb-2">За скільки днів потрібно замовляти торт?</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Рекомендуємо оформити замовлення за 2–4 дні. Весільні торти — за 2–3 тижні.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-gray-900 mb-2">Чи можна замовити терміново?</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">У деяких випадках можливе виготовлення за 24–48 годин за наявності вільного виробничого часу.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow md:col-span-2">
                            <h3 className="font-bold text-gray-900 mb-2">Чи можна змінити дизайн?</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Так, кожен проєкт розробляється індивідуально відповідно до ваших побажань.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default HolidayCakes;
