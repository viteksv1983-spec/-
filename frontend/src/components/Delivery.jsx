import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';

function Delivery() {
    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <SEOHead
                title="Доставка тортів у Києві – Antreme"
                description="Швидка та безпечна доставка тортів по Києву. Самовивіз та адресна доставка."
                ogImage="/og-delivery.jpg"
            />

            {/* Hero Banner */}
            <div className="relative overflow-hidden py-16 md:py-24 text-center">
                <div className="relative z-10 container mx-auto px-6">
                    <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#E8C064] mb-4">Antreme</div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tight mb-4"
                        style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Доставка
                    </h1>
                    <div className="w-20 h-1 bg-[#E8C064] mx-auto mb-6 rounded-full" />
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        Ваш торт мрії — вже на шляху до вас
                    </p>
                </div>
            </div>

            {/* Delivery Options Cards */}
            <div className="container mx-auto px-6 pb-16">
                <div className="max-w-5xl mx-auto">

                    {/* 3 Method Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-16">
                        {[
                            {
                                icon: '🚗',
                                title: "Кур'єр по місту",
                                desc: 'Доставка у зручний для вас час',
                                price: '100 грн',
                                sub: 'Безкоштовно від 500 грн',
                                priceColor: '#E8C064',
                                highlight: true
                            },
                            {
                                icon: '🏪',
                                title: 'Самовивіз',
                                desc: 'Забрати з нашої кондитерської',
                                price: 'Безкоштовно',
                                sub: 'вул. Харківське шосе, 180/21',
                                priceColor: '#22c55e',
                                highlight: false
                            },
                            {
                                icon: '📦',
                                title: 'Нова Пошта',
                                desc: 'Доставка по Україні',
                                price: 'За тарифами НП',
                                sub: '1-3 дні',
                                priceColor: '#E8C064',
                                highlight: false
                            }
                        ].map((item, i) => (
                            <div key={i} className={`relative group bg-white rounded-2xl md:rounded-3xl p-8 text-center transition-all duration-300 hover:-translate-y-1 border shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] ${item.highlight
                                ? 'border-[#E8C064]/40'
                                : 'border-gray-100'
                                }`}>
                                {item.highlight && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#E8C064] text-white text-xs font-black uppercase tracking-widest rounded-full shadow-sm">
                                        Популярно
                                    </div>
                                )}
                                <div className="text-5xl mb-5">{item.icon}</div>
                                <h3 className="text-xl font-black text-gray-900 mb-3 uppercase"
                                    style={{ fontFamily: "'Oswald', sans-serif" }}>{item.title}</h3>
                                <p className="text-gray-500 mb-5 text-sm">{item.desc}</p>
                                <div className="text-2xl font-black mb-2" style={{ color: item.priceColor }}>{item.price}</div>
                                <p className="text-xs text-gray-400">{item.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Important Info */}
                    <div className="bg-white rounded-2xl md:rounded-3xl p-8 md:p-12 mb-12 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                        <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase flex items-center gap-3"
                            style={{ fontFamily: "'Oswald', sans-serif" }}>
                            <span className="w-8 h-1 bg-[#E8C064] rounded-full inline-block" />
                            Важлива інформація
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { icon: '⏰', title: 'Час доставки', text: 'Щодня з 9:00 до 21:00. Можливість обрати конкретний час при оформленні замовлення.' },
                                { icon: '📅', title: 'Термін виготовлення', text: 'Стандартні торти - 24 години. Авторські торти - 2-3 дні. Печенье та солодощі - в наявності.' },
                                { icon: '❄️', title: 'Температурний режим', text: 'Доставка в спеціальних термопакетах з холодоакумуляторами для збереження свіжості.' },
                                { icon: '💳', title: 'Оплата', text: "Готівкою кур'єру, карткою онлайн або при самовивозі. Безготівковий розрахунок для юр.осіб." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#FFF8E7] flex items-center justify-center text-2xl flex-shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 mb-1.5 uppercase text-sm tracking-wide"
                                            style={{ fontFamily: "'Oswald', sans-serif" }}>{item.title}</h4>
                                        <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Zones Table */}
                    <div className="mb-14">
                        <h2 className="text-2xl font-black text-gray-900 text-center uppercase mb-8"
                            style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Зони доставки по місту
                        </h2>
                        <div className="overflow-x-auto bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="px-8 py-5 text-left font-black text-xs uppercase tracking-widest text-[#7A0019]">Район</th>
                                        <th className="px-8 py-5 text-left font-black text-xs uppercase tracking-widest text-[#7A0019]">Вартість</th>
                                        <th className="px-8 py-5 text-left font-black text-xs uppercase tracking-widest text-[#7A0019]">Час доставки</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { zone: 'Центр міста', price: '50 грн', time: '30-60 хв' },
                                        { zone: 'Спальні райони', price: '100 грн', time: '1-2 години' },
                                        { zone: 'Передмістя', price: '150 грн', time: '2-3 години' }
                                    ].map((row, i) => (
                                        <tr key={i} className="group transition-colors hover:bg-[#FFF8E7]/50 border-b border-gray-50 last:border-0">
                                            <td className="px-8 py-5 text-gray-900 font-medium">{row.zone}</td>
                                            <td className="px-8 py-5 font-black text-[#E8C064]">{row.price}</td>
                                            <td className="px-8 py-5 text-gray-500">{row.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-sm text-gray-400 mt-4 text-center">
                            * При замовленні від 500 грн — доставка безкоштовна у всі райони міста
                        </p>
                    </div>

                    {/* Contact CTA */}
                    <div className="rounded-2xl md:rounded-3xl p-10 md:p-14 text-center relative overflow-hidden bg-[#7A0019]">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-4"
                                style={{ fontFamily: "'Oswald', sans-serif" }}>
                                Є питання щодо доставки?
                            </h2>
                            <p className="text-white/70 text-lg mb-8">
                                Наші менеджери з радістю допоможуть вам оформити замовлення
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <a href="tel:0979081504"
                                    className="flex items-center gap-2 text-xl font-black text-[#E8C064] hover:text-white transition-colors">
                                    📞 097 908 15 04
                                </a>
                                <span className="text-white/30 hidden sm:block">|</span>
                                <Link
                                    to="/torty-na-zamovlennya/"
                                    className="inline-block px-10 py-4 bg-[#E8C064] hover:bg-[#D4A83C] text-white font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 shadow-md"
                                >
                                    Оформити замовлення
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Delivery;
