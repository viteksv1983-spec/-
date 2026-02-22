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

    return (
        <div className="min-h-screen bg-[#f6f4ed] pb-20">
            <SEOHead
                title="Торти на свято на замовлення в Києві | Святкові торти - Antreme"
                description="Замовити святковий торт у Києві: на день народження, ювілей, дитячі свята, весілля та корпоративи. Ексклюзивні дизайни, натуральні інгредієнти, доставка від Antreme."
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
                                    alt={cat.title}
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

                {/* SEO / Category List Section */}
                <div className="rounded-3xl p-8 md:p-12 border border-gray-200 bg-white shadow-sm mt-12 mb-12">
                    <h2 className="text-xl md:text-2xl font-black text-[#1d263b] mb-4 uppercase tracking-widest"
                        style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Торти на замовлення Antreme
                    </h2>
                    <div className="w-12 h-0.5 bg-antreme-gold mb-6 rounded-full" />
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
                        У нашій кондитерській майстерні ви можете замовити десерт для будь-якої події. Ми пропонуємо широкий вибір категорій, щоб ваш вибір був ідеальним:
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        {CATEGORIES.map((cat, i) => (
                            <React.Fragment key={cat.slug}>
                                <Link
                                    to={getCategoryUrl(cat.slug)}
                                    className="text-gray-500 hover:text-antreme-red font-semibold text-xs md:text-sm transition-colors underline decoration-gray-300 underline-offset-4 hover:decoration-antreme-red"
                                >
                                    {cat.name}
                                </Link>
                                {i < CATEGORIES.length - 1 && <span className="text-gray-300 select-none">•</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HolidayCakes;
