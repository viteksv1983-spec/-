import React, { useEffect } from 'react';
import SEOHead from './SEOHead';

// Text reviews from screenshots
const TEXT_REVIEWS = [
    {
        id: 1,
        author: "Клієнт",
        date: "Нещодавно",
        rating: 5,
        content: "Смакуємо 🎂 торт))) цей смак неймовірний, торт не мокрий а саме так як має бути, смачний, в міру солоденький. Все до смаку. Дякуємо ❤️",
        type: "text"
    },
    {
        id: 2,
        author: "Клієнт",
        date: "Нещодавно",
        rating: 5,
        content: "Людочка, Ви , як завжди, на висоті, торт неперевершений. Смак просто 🔥, всі в захваті- смакота. Дякую Вам, в складні часи- ми разом!!!",
        type: "text"
    },
    {
        id: 3,
        author: "Клієнт",
        date: "Нещодавно",
        rating: 5,
        content: "Дякуємо за неймовірно смачний тортик ❤️ і чудове свято!",
        type: "text"
    },
    {
        id: 4,
        author: "Клієнт",
        date: "Нещодавно",
        rating: 5,
        content: "Дуже смачно 😍 Дякуємо Вам за свято!",
        type: "text"
    },
    {
        id: 5,
        author: "Клієнт",
        date: "Нещодавно",
        rating: 5,
        content: "Людочка, дякую. Тортик був на смак просто неймовірний, на дууууже смачний 😊 Дякуємо",
        type: "text"
    },
    {
        id: 6,
        author: "Клієнт",
        date: "Нещодавно",
        rating: 5,
        content: "Дуже дякую Вам за ту красоту і смакоту, яку Ви мені зробили 🔥🔥🔥 просто неперевершена ✨✨✨ Бажаю Вам нових досягнень 🥰🥰🥰",
        type: "text"
    },
    {
        id: 7,
        author: "Клієнт",
        date: "Нещодавно",
        rating: 5,
        content: "Дуже, дуже дякую! Тортик неймовірний! Батьки прослезились! Це так гарно! ❤️❤️",
        type: "text"
    },
    {
        id: 8,
        author: "Клієнт",
        date: "Нещодавно",
        rating: 5,
        content: "Людмила, тортик був неймовірно смачний і красивий, в принципі як завжди на протязі вже багатьох років ❤️ Дуже Вам дякуємо 😘❤️",
        type: "text"
    },
    {
        id: 9,
        author: "Клієнт",
        date: "Нещодавно",
        rating: 5,
        content: "Доброе утро! Людмила, это было превосходно!!! Очень вкусно, очень-очень... Малыш счастлив!",
        type: "text"
    },
    {
        id: 10,
        author: "Клієнт",
        date: "Нещодавно",
        rating: 5,
        content: "Люда, торт перфект ❤️ Дякуємо!!!",
        type: "text"
    }
];

// Story reviews with real images
const STORY_REVIEWS = [
    { id: 1, title: "Торт з єдинорогом", thumb: "/reviews/review_1.jpg" },
    { id: 2, title: "Торт 'Ми разом'", thumb: "/reviews/review_2.jpg" },
    { id: 3, title: "Капкейки '26'", thumb: "/reviews/review_3.jpg" },
    { id: 4, title: "44 Річниця весілля", thumb: "/reviews/review_4.jpg" },
    { id: 5, title: "Захоплений відгук", thumb: "/reviews/review_5.jpg" },
    { id: 6, title: "Дитяче свято Pokemon", thumb: "/reviews/review_6.jpg" },
    { id: 7, title: "Торт 'Перфект'", thumb: "/reviews/review_7.jpg" },
    { id: 8, title: "Торт Brawl Stars", thumb: "/reviews/review_8.jpg" },
    { id: 9, title: "Тематичні капкейки", thumb: "/reviews/review_9.jpg" },
    { id: 10, title: "Жовтий мусовий торт", thumb: "/reviews/review_11.jpg" }
];

function Reviews() {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const schemaData = JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "AggregateRating",
        "itemReviewed": {
            "@type": "Bakery",
            "name": "Antreme",
            "image": "https://antreme.com.ua/logo.png",
            "priceRange": "$$",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Харківське шосе, 180/21",
                "addressLocality": "Київ",
                "addressCountry": "UA"
            }
        },
        "ratingValue": "5.0",
        "reviewCount": "127"
    });

    return (
        <div className="min-h-screen bg-[#FDFBF7] pb-20">
            <SEOHead
                title="Відгуки клієнтів | Antreme - Кондитерська майстерня"
                description="Читайте відгуки наших задоволених клієнтів про бенто-торти, весільні та бісквітні торти на замовлення у Києві. Найвищі оцінки та щирі емоції."
                keywords="відгуки антреме, відгуки торти на замовлення київ, antreme reviews, найкращі торти київ відгуки"
            />

            {/* Structured Data for SEO */}
            <script type="application/ld+json">
                {schemaData}
            </script>

            {/* Hero Section - Premium Instagram Branding (Optimized Size) */}
            <header className="bg-[#FDFBF7] py-8 md:py-12">
                <div className="max-w-[1440px] mx-auto px-4 md:px-6">
                    <div className="relative rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-xl group border-2 md:border-4 border-white aspect-[16/10] md:aspect-[3/1] lg:aspect-[3.5/1]">
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                        <img
                            src="/reviews/reviews_hero.jpg"
                            alt="Antreme Instagram Stats"
                            className="absolute inset-0 w-full h-full object-cover object-center"
                        />
                    </div>
                </div>
            </header>

            {/* Stats/Badge Section */}
            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-4 md:p-10 flex flex-wrap justify-around items-center border border-amber-100">
                    <div className="text-center p-2 md:p-4">
                        <div className="text-2xl md:text-4xl font-black text-[#5a0020] mb-1">5.0</div>
                        <div className="flex justify-center text-amber-400 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            ))}
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Середній бал</div>
                    </div>
                    <div className="h-12 w-px bg-gray-100 hidden md:block"></div>
                    <div className="text-center p-2 md:p-4">
                        <div className="text-2xl md:text-4xl font-black text-[#5a0020] mb-1">100%</div>
                        <div className="text-amber-500 font-bold mb-1 text-sm md:text-base">Якість</div>
                        <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Натуральні інгредієнти</div>
                    </div>
                    <div className="h-12 w-px bg-gray-100 hidden md:block"></div>
                    <div className="text-center p-2 md:p-4">
                        <div className="text-2xl md:text-4xl font-black text-[#5a0020] mb-1">1000+</div>
                        <div className="text-amber-500 font-bold mb-1 text-sm md:text-base">Задоволених</div>
                        <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Клієнтів за рік</div>
                    </div>
                </div>
            </div>

            {/* Stories Section */}
            <section className="container mx-auto px-6 py-20 pb-10">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-0.5 shadow-xl">
                        <div className="w-full h-full rounded-full bg-white p-0.5">
                            <img src="/reviews/liudmila_insta.png" className="w-full h-full rounded-full object-cover" alt="Antreme Stories" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Antreme&background=5a0020&color=fff'; }} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-[#5a0020] uppercase tracking-widest font-serif">Stories Відгуки</h2>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-[0.3em] mt-1">Скріншоти з нашого Instagram</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {STORY_REVIEWS.map((story) => (
                        <div key={story.id} className="group relative aspect-[9/16] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
                            <img src={story.thumb} alt={story.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                                <p className="text-xs font-bold uppercase tracking-widest">{story.title}</p>
                            </div>
                            {/* Instagram Icon Overlay */}
                            <div className="absolute top-4 right-4 text-white/50 group-hover:text-white transition-colors">
                                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.277.058-2.148.262-2.91.56a5.89 5.89 0 00-2.126 1.384 5.89 5.89 0 00-1.383 2.127c-.298.762-.502 1.633-.561 2.91-.057 1.28-.072 1.688-.072 4.947s.015 3.667.072 4.947c.059 1.277.263 2.148.561 2.91a5.89 5.89 0 001.383 2.127 5.89 5.89 0 002.127 1.383c.762.298 1.633.502 2.91.561 1.28.057 1.688.072 4.947.072s3.667-.015 4.947-.072c1.277-.059 2.148-.263 2.91-.561a5.89 5.89 0 002.127-1.383 5.89 5.89 0 001.383-2.127c.298-.762.502-1.633.561-2.91.057-1.28.072-1.688.072-4.947s-.015-3.667-.072-4.947c-.059-1.277-.263-2.148-.561-2.91a5.89 5.89 0 00-1.383-2.127 5.89 5.89 0 00-2.127-1.383c-.762-.298-1.633-.502-2.91-.561-1.28-.057-1.688-.072-4.947-.072zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Text Reviews Grid */}
            <section className="container mx-auto px-6 py-20 bg-white/50 border-y border-amber-50">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-black text-[#5a0020] mb-4 uppercase tracking-widest font-serif">Що кажуть клієнти</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm italic">Відгуки з месенджерів та особистих повідомлень</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {TEXT_REVIEWS.map((review) => (
                        <article key={review.id} className="bg-white p-10 rounded-3xl shadow-xl shadow-amber-900/5 hover:-translate-y-2 transition-all duration-300 border border-transparent hover:border-amber-100 group relative">
                            {/* Quote Decoration */}
                            <span className="absolute top-6 right-8 text-6xl text-amber-50 font-serif group-hover:text-amber-100 transition-colors pointer-events-none opacity-50">"</span>

                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                ))}
                            </div>

                            <p className="text-gray-700 leading-relaxed mb-8 text-lg font-medium italic relative z-10">
                                {review.content}
                            </p>

                            <footer className="flex items-center gap-4 pt-6 border-t border-gray-50">
                                <div className="w-12 h-12 rounded-full bg-[#5a0020] text-white flex items-center justify-center font-black text-xl shadow-lg border-2 border-white">
                                    {review.author[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#5a0020] uppercase tracking-widest leading-none mb-1">{review.author}</h4>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{review.date}</p>
                                </div>
                            </footer>
                        </article>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <div className="container mx-auto px-6 mt-20">
                <div className="bg-[#5a0020] rounded-[3rem] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <span className="inline-block px-4 py-1 rounded-full bg-amber-400 text-[#5a0020] text-[10px] font-black uppercase tracking-widest mb-6 border-2 border-[#5a0020]">Нам важливо знати</span>
                        <h2 className="text-3xl md:text-5xl font-black mb-8 font-serif uppercase tracking-widest leading-tight">Поділіться вашими <br /> враженнями</h2>
                        <p className="mb-12 text-amber-100 text-lg md:text-xl font-medium leading-relaxed italic">
                            Ми щиро вдячні за кожен ваш відгук. Він допомагає нам ставати кращими для вас!
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <a href="https://www.instagram.com/liudmilaprikhodko" target="_blank" rel="noopener noreferrer" className="bg-white text-[#5a0020] px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-amber-400 transition-all transform hover:scale-110 shadow-2xl group flex items-center gap-3">
                                Instagram
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                            <a href="https://t.me/antreeeme" target="_blank" rel="noopener noreferrer" className="bg-transparent border-2 border-white/30 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:border-white transition-all transform hover:scale-110 flex items-center gap-3">
                                Telegram
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reviews;
