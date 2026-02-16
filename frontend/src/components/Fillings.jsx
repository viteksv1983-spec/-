import React from 'react';
import { FILLINGS } from '../constants/fillings';

function Fillings() {
    return (
        <div className="bg-white min-h-screen py-16">

            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-vatsak-red uppercase tracking-tight mb-4">
                        Наші Начинки
                    </h1>
                    <div className="w-24 h-1.5 bg-vatsak-gold mx-auto mb-6"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Ми використовуємо лише найсвіжіші та найякісніші інгредієнти для створення
                        неповторного смаку кожного вашого торта.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {FILLINGS.map((filling, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group flex flex-col h-full border border-gray-100"
                        >
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={filling.image}
                                    alt={filling.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute bottom-4 left-6">
                                    <span className="bg-white/90 backdrop-blur-sm text-[#5a0020] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                                        Premium
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-vatsak-red transition-colors">
                                    {filling.name}
                                </h3>
                                <p className="text-gray-600 leading-relaxed italic flex-grow">
                                    "{filling.description}"
                                </p>
                                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-vatsak-gold font-bold flex items-center gap-1">
                                        <span>⭐⭐⭐⭐⭐</span>
                                    </span>
                                    <span className="text-xs uppercase tracking-widest font-bold text-gray-400">
                                        Handmade
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center bg-white p-12 rounded-3xl shadow-lg border border-vatsak-gold/20 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-black text-[#5a0020] mb-6 uppercase">Маєте власну ідею?</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Якщо ви не знайшли ідеальну начинку — напишіть нам, і ми створимо
                        індивідуальне поєднання саме для вашого свята.
                    </p>
                    <a
                        href="tel:0979081504"
                        className="inline-block bg-[#5a0020] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-vatsak-red transition-all shadow-xl hover:shadow-vatsak-red/40"
                    >
                        Замовити консультацію
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Fillings;
