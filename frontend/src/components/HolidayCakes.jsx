import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { HOLIDAY_SUB_CATEGORIES, CATEGORIES } from '../constants/categories';

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

                // Handle relative paths
                if (img && !img.startsWith('http')) {
                    img = `${api.defaults.baseURL}${img}`;
                }

                return {
                    ...cat,
                    title: cat.name.toUpperCase(),
                    img: img || `https://placehold.co/400x400/fff/7b002c?text=${cat.name}`
                };
            });

            setCategories(enriched);
        } catch (error) {
            console.error("Failed to fetch categories", error);
            // Fallback to constants if API fails? 
            // Better to show what we have.
            setCategories(HOLIDAY_SUB_CATEGORIES.map(cat => ({
                ...cat,
                title: cat.name.toUpperCase(),
                img: `https://placehold.co/400x400/fff/7b002c?text=${cat.name}`
            })));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfaf5]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7b002c]"></div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-[#fdfaf5] py-12 md:py-20 px-4">
            <div className="container mx-auto max-w-6xl text-center">
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter mb-12 md:mb-16" style={{ fontFamily: "'Oswald', sans-serif" }}>
                    ТОРТИ ДЛЯ СВЯТА
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {categories.map((cat, index) => (
                        <Link
                            key={index}
                            to={`/cakes?category=${cat.slug}`}
                            className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col items-center p-4 md:p-6"
                        >
                            {/* Image Container */}
                            <div className="w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 md:mb-6">
                                <img
                                    src={cat.img}
                                    alt={cat.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                        if (e.target.src !== 'https://placehold.co/400x400/fff/7b002c?text=Antreme') {
                                            e.target.src = 'https://placehold.co/400x400/fff/7b002c?text=Antreme';
                                        }
                                    }}
                                />
                            </div>

                            {/* Title */}
                            <h3 className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-tight text-center leading-tight group-hover:text-[#7b002c] transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                {cat.title}
                            </h3>

                            {/* Subtle background highlight for mobile */}
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-[#7b002c] scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-500"></div>
                        </Link>
                    ))}
                </div>

                {/* SEO / Category List Section */}
                <div className="mt-20 md:mt-32 pt-12 md:pt-16 border-t border-gray-100 text-left">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 uppercase tracking-widest" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Торти на замовлення Antreme
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
                        У нашій кондитерській майстерні ви можете замовити десерт для будь-якої події. Ми пропонуємо широкий вибір категорій, щоб ваш вибір був ідеальним:
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        {CATEGORIES.map((cat, i) => (
                            <React.Fragment key={cat.slug}>
                                <Link
                                    to={`/cakes?category=${cat.slug}`}
                                    className="text-[#7b002c] hover:text-black font-semibold text-xs md:text-sm transition-colors underline decoration-[#7b002c]/20 underline-offset-4 hover:decoration-[#7b002c]"
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
