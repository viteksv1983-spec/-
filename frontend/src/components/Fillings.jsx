import React from 'react';
import { FILLINGS } from '../constants/fillings';

function Fillings() {
    return (
        <div className="min-h-screen bg-[#FDFBF7]">

            {/* Page Hero */}
            <div className="relative overflow-hidden py-16 md:py-24 text-center">
                <div className="relative z-10 container mx-auto px-6">
                    <div className="text-xs font-bold uppercase tracking-[0.3em] text-[#E8C064] mb-4">Кондитерська Майстерня</div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 uppercase tracking-tight mb-4"
                        style={{ fontFamily: "'Oswald', sans-serif" }}>
                        Наші <span className="text-[#7A0019]">Начинки</span>
                    </h1>
                    <div className="w-20 h-1 bg-[#E8C064] mx-auto mb-6 rounded-full" />
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
                        Ми використовуємо лише найсвіжіші та найякісніші інгредієнти для створення
                        неповторного смаку кожного вашого торта.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 pb-20">

                {/* Fillings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-20">
                    {FILLINGS.map((filling, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-1 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
                        >
                            {/* Image */}
                            <div className="relative h-52 md:h-56 overflow-hidden">
                                <img
                                    src={filling.image}
                                    alt={filling.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => { e.target.src = 'https://placehold.co/600x400/FDFBF7/7A0019?text=Antreme'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="p-5 md:p-7 flex flex-col flex-grow">
                                <h3 className="text-lg md:text-xl font-black text-gray-900 mb-2 uppercase tracking-tight group-hover:text-[#7A0019] transition-colors duration-300"
                                    style={{ fontFamily: "'Oswald', sans-serif" }}>
                                    {filling.name}
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed italic flex-grow">
                                    "{filling.description}"
                                </p>
                                <div className="mt-4 pt-4 flex items-center justify-between border-t border-gray-100">
                                    <span className="text-[#E8C064] text-sm tracking-wider">
                                        ⭐⭐⭐⭐⭐
                                    </span>
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-300">
                                        Handmade
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Block */}
                <div className="max-w-4xl mx-auto rounded-3xl p-10 md:p-14 text-center relative overflow-hidden bg-[#7A0019] border border-[#9C142B]">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-4"
                            style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Маєте власну ідею?
                        </h2>
                        <div className="w-16 h-1 bg-[#E8C064] mx-auto mb-6 rounded-full" />
                        <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                            Якщо ви не знайшли ідеальну начинку — напишіть нам, і ми створимо
                            індивідуальне поєднання саме для вашого свята.
                        </p>
                        <a
                            href="tel:0979081504"
                            className="inline-block px-10 py-4 bg-[#E8C064] hover:bg-[#D4A83C] text-white font-black text-sm uppercase tracking-widest rounded-full transition-all hover:scale-105 shadow-md"
                        >
                            Замовити консультацію
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Fillings;
