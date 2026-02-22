import React from 'react';
import { FaHeart, FaStar, FaAward } from 'react-icons/fa';
import SEOHead from './SEOHead';

function About() {
    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #1a0010 0%, #2d0018 40%, #1a0010 100%)' }}>
            <SEOHead title="Про нас | Кондитерська Antreme Київ" />

            {/* Hero Section */}
            <header className="relative h-[65vh] flex items-center justify-center overflow-hidden">
                <img
                    src="/about/about_2.jpg"
                    alt="Antreme Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, rgba(26,0,16,0.1) 0%, rgba(26,0,16,0.5) 100%)' }} />
                <div className="relative z-10 text-center px-6">
                    <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#FFD700] mb-4">Antreme</div>
                    <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-2xl"
                        style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Про нас
                    </h1>
                    <div className="w-20 h-1 bg-[#FFD700] mx-auto mb-6 rounded-full" />
                    <p className="text-white/70 text-lg md:text-xl tracking-wide">
                        Antreme — Майстерність, народжена пристрастю
                    </p>
                </div>
            </header>

            {/* Introduction */}
            <section className="container mx-auto px-6 py-20 md:py-28">
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6"
                        style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Тільки найкраще для <span style={{ color: '#FFD700' }}>ваших моментів</span>
                    </h2>
                    <div className="w-16 h-1 bg-[#FFD700] mx-auto mb-8 rounded-full" />
                    <p className="text-xl text-white/60 leading-relaxed italic">
                        "Ми не просто створюємо десерти — ми створюємо емоції, що залишаються у вашій пам'яті назавжди."
                    </p>
                </div>

                {/* Text + Image 2-col */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl group border border-white/10"
                        style={{ boxShadow: '0 0 40px rgba(255,215,0,0.1)' }}>
                        <img
                            src="/about/about_1.jpg"
                            alt="Тільки найкраще"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0"
                            style={{ background: 'linear-gradient(to top, rgba(26,0,16,0.5), transparent)' }} />
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tight"
                            style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Натуральність та <span style={{ color: '#FFD700' }}>Якість</span>
                        </h3>
                        <p className="text-white/60 text-lg leading-relaxed">
                            Кожен інгредієнт у нашій майстерні підбирається з особливою прискіпливістю. Ми використовуємо лише натуральне масло, вершки найвищої якості та справжній шоколад. Жодних компромісів зі смаком та здоров'ям наших клієнтів.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-[#FFD700]/20"
                                style={{ background: 'rgba(255,215,0,0.08)' }}>
                                <FaStar className="text-[#FFD700]" />
                                <span className="font-black text-sm text-white uppercase tracking-wide">100% Натурально</span>
                            </div>
                            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10"
                                style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <FaHeart className="text-red-400" />
                                <span className="font-black text-sm text-white uppercase tracking-wide">Зроблено з любов'ю</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chef Section */}
            <section className="py-20 md:py-28 relative overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {/* Decorative glow */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #FFD700, transparent)' }} />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#FFD700] mb-4">Знайомтесь</div>
                                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4"
                                    style={{ fontFamily: "'Oswald', sans-serif" }}>
                                    Моя мета — зробити ваше свято <span style={{ color: '#FFD700' }}>незабутнім</span>
                                </h2>
                                <p className="text-[#FFD700] font-black italic text-lg">
                                    — Людмила Приходько, засновник Antreme
                                </p>
                            </div>
                            <p className="text-white/60 text-lg leading-relaxed">
                                Моя подорож у світ кондитерського мистецтва розпочалася як мрія, яка перетворилася на справу життя. Кожен торт для мене — це чисте полотно, на якому я втілюю ваші найсміливіші ідеї. Я особисто контролюю кожен етап створення десерту, щоб ви отримали ідеальний результат.
                            </p>
                            <div className="flex items-center gap-5 p-6 rounded-2xl border border-[#FFD700]/20"
                                style={{ background: 'rgba(255,215,0,0.08)' }}>
                                <FaAward className="text-4xl text-[#FFD700] flex-shrink-0" />
                                <div>
                                    <h4 className="font-black text-white uppercase tracking-wide">Авторський підхід</h4>
                                    <p className="text-sm text-white/50 uppercase tracking-widest mt-1">Унікальність у кожній деталі</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl"
                                style={{ background: 'linear-gradient(135deg, #FFD700, #7b002c)' }} />
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                                style={{ boxShadow: '0 0 50px rgba(255,215,0,0.15)' }}>
                                <img
                                    src="/about/about_3.jpg"
                                    alt="Людмила Приходько"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0"
                                    style={{ background: 'linear-gradient(to top, rgba(26,0,16,0.6), transparent 50%)' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-6 py-20 md:py-28">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight"
                        style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Antreme у <span style={{ color: '#FFD700' }}>цифрах</span>
                    </h2>
                    <div className="w-16 h-1 bg-[#FFD700] mx-auto mt-5 rounded-full" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {[
                        { label: "Років досвіду", val: "20+", icon: "🏆" },
                        { label: "Задоволених клієнтів", val: "6000+", icon: "❤️" },
                        { label: "Авторських рецептів", val: "50+", icon: "📖" },
                        { label: "Щасливих весіль", val: "200+", icon: "💍" }
                    ].map((stat, i) => (
                        <div key={i} className="group rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-2 border border-white/10 hover:border-[#FFD700]/30"
                            style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
                            <div className="text-3xl mb-3">{stat.icon}</div>
                            <div className="text-4xl font-black text-[#FFD700] mb-2"
                                style={{ fontFamily: "'Oswald', sans-serif" }}>{stat.val}</div>
                            <div className="text-xs font-bold text-white/40 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default About;
