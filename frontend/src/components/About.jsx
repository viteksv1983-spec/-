import React from 'react';
import { FaHeart, FaStar, FaAward } from 'react-icons/fa';

function About() {
    return (
        <div className="bg-[#FDFBF7] min-h-screen">
            {/* Hero Section */}
            <header className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <img
                    src="/about/about_2.jpg"
                    alt="Antreme Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-widest drop-shadow-2xl font-serif mb-4">
                        Про нас
                    </h1>
                    <p className="text-white text-xl md:text-2xl font-bold tracking-[0.3em] uppercase drop-shadow-lg">
                        Antreme — Майстерність, народжена пристрастю
                    </p>
                </div>
            </header>

            {/* Introduction Section */}
            <section className="container mx-auto px-6 py-24">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl md:text-4xl font-black text-[#5a0020] uppercase tracking-widest font-serif">
                        Тільки найкраще для ваших моментів
                    </h2>
                    <div className="h-1 w-24 bg-amber-400 mx-auto rounded-full"></div>
                    <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium italic">
                        "Ми не просто створюємо десерти — ми створюємо емоції, що залишаються у вашій пам'яті назавжди."
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mt-20 items-center">
                    <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group border-4 border-white">
                        <img
                            src="/about/about_1.jpg"
                            alt="Тільки найкраще"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-[#5a0020] uppercase tracking-tighter">Натуральність та Якість</h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Кожен інгредієнт у нашій майстерні підбирається з особливою прискіпливістю. Ми використовуємо лише натуральне масло, вершки найвищої якості та справжній шоколад. Жодних компромісів зі смаком та здоров'ям наших клієнтів.
                        </p>
                        <div className="flex gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-3">
                                <FaStar className="text-amber-400" />
                                <span className="font-bold text-sm">100% Натурально</span>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-3">
                                <FaHeart className="text-pink-500" />
                                <span className="font-bold text-sm">Зроблено з любов'ю</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Chef Section */}
            <section className="bg-white py-24">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 space-y-8">
                            <h2 className="text-4xl font-black text-[#5a0020] uppercase tracking-widest font-serif">
                                Моя мета — зробити ваше свято незабутнім
                            </h2>
                            <p className="text-xl text-amber-500 font-black italic tracking-wider">
                                — Людмила Приходько, засновник Antreme
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Моя подорож у світ кондитерського мистецтва розпочалася як мрія, яка перетворилася на справу життя. Кожен торт для мене — це чисте полотно, на якому я втілюю ваші найсміливіші ідеї. Я особисто контролюю кожен етап створення десерту, щоб ви отримали ідеальний результат.
                            </p>
                            <div className="pt-4">
                                <div className="inline-flex items-center gap-4 bg-[#FDFBF7] p-6 rounded-2xl border-l-8 border-[#5a0020] shadow-lg">
                                    <FaAward className="text-4xl text-amber-400" />
                                    <div>
                                        <h4 className="font-black text-[#5a0020]">Авторський підхід</h4>
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Унікальність у кожній деталі</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 relative">
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-amber-100 rounded-full blur-3xl opacity-50"></div>
                            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-k8 border-white">
                                <img
                                    src="/about/about_3.jpg"
                                    alt="Людмила Приходько"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Summary */}
            <section className="container mx-auto px-6 py-24 text-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: "Років досвіду", val: "20+" },
                        { label: "Задоволених клієнтів", val: "6000+" },
                        { label: "Авторських рецептів", val: "50+" },
                        { label: "Щасливих весіль", val: "200+" }
                    ].map((stat, i) => (
                        <div key={i} className="p-8 rounded-3xl bg-white shadow-xl border border-gray-100">
                            <div className="text-4xl font-black text-[#5a0020] mb-2">{stat.val}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default About;
