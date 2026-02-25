import React from 'react';
import { Link } from 'react-router-dom';
import { FILLINGS } from '../constants/fillings';
import SEOHead from './SEOHead';

function Fillings() {
    // Group fillings by category
    const chocolateFillings = FILLINGS.filter(f => f.category === 'chocolate');
    const fruitFillings = FILLINGS.filter(f => f.category === 'fruit');
    const classicFillings = FILLINGS.filter(f => f.category === 'classic');
    const mousseFillings = FILLINGS.filter(f => f.category === 'mousse');

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Яка начинка найпопулярніша?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Найпопулярніші наші начинки — це 'Снікерс' та 'Фісташка-малина'. Вони мають збалансований смак та подобаються більшості гостей."
                }
            },
            {
                "@type": "Question",
                "name": "Чи можна поєднати дві начинки в одному торті?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Для стабільності одного ярусу ми використовуємо одну начинку. Проте у багатоярусних тортах ви можете обрати окремий смак для кожного ярусу."
                }
            },
            {
                "@type": "Question",
                "name": "Чи можна зробити торт менш солодким?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Так, ми працюємо з натуральними інгредієнтами та можемо адаптувати рівень солодкості за вашим бажанням."
                }
            },
            {
                "@type": "Question",
                "name": "Які начинки найкраще підходять для дітей?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Для дитячих свят ми рекомендуємо легкі та зрозумілі смаки: 'Полуниця-вершки', 'Молочна дівчинка' або 'Ванільний бісквіт'."
                }
            }
        ]
    };

    const FillingCard = ({ filling }) => (
        <div className="group bg-white rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl border border-gray-100">
            <div className="relative h-48 overflow-hidden">
                <img
                    src={filling.image}
                    alt={`Начинка для торта ${filling.name} — Antreme Київ`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://placehold.co/600x400/FDFBF7/7A0019?text=Antreme'; }}
                />
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2 uppercase tracking-tight" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                    {filling.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                    {filling.description}
                </p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <SEOHead
                title="Начинки для тортів на замовлення в Києві — смаки | Antreme"
                description="Оберіть начинку для торта на замовлення в Києві. Шоколадні, фруктові, мусові та класичні смаки. Натуральні інгредієнти. Авторська кондитерська Antreme."
                schema={faqSchema}
            />

            {/* Title & Hero Section */}
            <div className="bg-white py-16 border-b border-gray-100">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 uppercase tracking-tight mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        Начинки для тортів на замовлення в Києві
                    </h1>
                    <div className="w-24 h-1.5 bg-[#7A0019] mx-auto mb-8 rounded-full"></div>

                    <section className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Оберіть ідеальний смак для вашого торта</h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-4">
                            У кондитерській Antreme ми пропонуємо понад 15 авторських начинок для <Link to="/torty-na-zamovlennya/" class="text-[#7A0019] font-semibold hover:underline">тортів на замовлення в Києві</Link>. Кожен смак створюється з натуральних інгредієнтів без маргарину та штучних замінників.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Ви можете обрати начинку для весільного, дитячого, ювілейного або святкового торта — ми допоможемо підібрати варіант відповідно до формату заходу та кількості гостей.
                        </p>
                    </section>
                </div>
            </div>

            <div className="container mx-auto px-6 py-16">

                {/* Chocolate Section */}
                <section className="mb-20">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-10 border-l-8 border-[#7A0019] pl-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        Шоколадні начинки
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {chocolateFillings.map(f => <FillingCard key={f.id} filling={f} />)}
                    </div>
                </section>

                {/* Fruit Section */}
                <section className="mb-20">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-10 border-l-8 border-[#E8C064] pl-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        Фруктові та ягідні
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {fruitFillings.map(f => <FillingCard key={f.id} filling={f} />)}
                    </div>
                </section>

                {/* Classic Section */}
                <section className="mb-20">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-10 border-l-8 border-[#7A0019] pl-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        Класичні
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {classicFillings.map(f => <FillingCard key={f.id} filling={f} />)}
                    </div>
                </section>

                {/* Mousse Section */}
                <section className="mb-20">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-10 border-l-8 border-[#E8C064] pl-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        Мусові
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mousseFillings.map(f => <FillingCard key={f.id} filling={f} />)}
                    </div>
                </section>

                {/* How to choose */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    <section className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-black text-gray-900 uppercase mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Як обрати начинку для торта?
                        </h2>
                        <ul className="space-y-4 text-gray-700">
                            <li className="flex items-start gap-3">
                                <span className="text-[#7A0019] mt-1">●</span>
                                <div><strong>Для дітей</strong> — легкі фруктові смаки. Рекомендуємо <Link to="/torty-na-zamovlennya/dytyachi/" className="text-[#7A0019] hover:underline">дитячі торти</Link> з полуницею або ваніллю.</div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#7A0019] mt-1">●</span>
                                <div><strong>Для весіль</strong> — збалансовані кремові або ягідні смаки. Обирайте <Link to="/torty-na-zamovlennya/vesilni/" className="text-[#7A0019] hover:underline">весільні торти</Link>, що сподобаються всім гостям.</div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#7A0019] mt-1">●</span>
                                <div><strong>Для чоловіків</strong> — насичені шоколадні варіанти. Перегляньте <Link to="/torty-na-zamovlennya/dlya-cholovikiv/" className="text-[#7A0019] hover:underline">торти для чоловіків</Link> зі Снікерсом або трюфелем.</div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#7A0019] mt-1">●</span>
                                <div><strong>Для святкування</strong> — ошатні жіночі дизайни. Подивіться <Link to="/torty-na-zamovlennya/dlya-zhinok/" className="text-[#7A0019] hover:underline">торти для жінок</Link> з мусовими начинками.</div>
                            </li>
                        </ul>
                    </section>

                    <section className="bg-[#7A0019] text-white p-10 rounded-3xl shadow-xl">
                        <h2 className="text-2xl font-black uppercase mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Якість інгредієнтів
                        </h2>
                        <p className="mb-6 leading-relaxed opacity-90">
                            Ми використовуємо виключно натуральне вершкове масло (не маргарин!), натуральні тваринні вершки, справжній бельгійський шоколад та свіжі сезонні ягоди. Ми дбаємо про ваше здоров'я та смак кожного виробу.
                        </p>
                        <Link to="/pro-nas/" className="inline-block px-8 py-3 bg-[#E8C064] text-white font-bold rounded-full uppercase text-xs tracking-widest hover:bg-white hover:text-[#7A0019] transition-all">
                            Більше про нас
                        </Link>
                    </section>
                </div>

                {/* Delivery Block */}
                <section className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 mb-20">
                    <h2 className="text-2xl font-black text-gray-900 uppercase mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        Доставка тортів з обраною начинкою по Києву
                    </h2>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        Ми доставляємо замовлення у спеціально обладнаних автомобілях, щоб зберегти свіжість та вигляд вашого торта. Працюємо по всьому Києву: Позняки, Осокорки, Оболонь, Печерськ, Троєщина, Центр та інші райони.
                    </p>
                    <Link to="/dostavka/" className="text-[#7A0019] font-bold border-b-2 border-transparent hover:border-[#7A0019] transition-all">
                        Умови доставки та оплати →
                    </Link>
                </section>

                {/* FAQ Block */}
                <section className="max-w-4xl mx-auto mb-20">
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-10 text-center" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                        Часті запитання
                    </h2>
                    <div className="space-y-6">
                        {faqSchema.mainEntity.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-2 text-lg">{item.name}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.acceptedAnswer.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Block */}
                <div className="max-w-5xl mx-auto rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden bg-gradient-to-br from-[#7A0019] to-[#4D0010] shadow-2xl">
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase mb-6" style={{ fontFamily: "'Oswald', 'Oswald Fallback', sans-serif" }}>
                            Не знаєте, яку начинку обрати?
                        </h2>
                        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
                            Ми з радістю допоможемо підібрати ідеальний смак, враховуючи ваші вподобання та тематику свята. Напишіть нам або замовте зворотний дзвінок.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="tel:0979081504" className="px-10 py-4 bg-[#E8C064] text-white font-black text-sm uppercase tracking-widest rounded-full hover:bg-white hover:text-[#7A0019] transition-all shadow-lg active:scale-95">
                                Зателефонувати
                            </a>
                            <Link to="/torty-na-zamovlennya/" className="px-10 py-4 border-2 border-white/30 text-white font-black text-sm uppercase tracking-widest rounded-full hover:bg-white hover:text-[#7A0019] transition-all active:scale-95">
                                Обрати торт
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Fillings;

