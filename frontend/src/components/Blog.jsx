import React from 'react';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
    {
        id: 1,
        title: "Мистецтво вибору весільного торта: Поради для наречених",
        excerpt: "Дізнайтеся, як обрати ідеальний торт для вашого особливого дня, від смакових поєднань до стильного оформлення.",
        date: "15 Лютого, 2026",
        image: "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&q=80&w=800",
        category: "Весілля"
    },
    {
        id: 2,
        title: "Тренди бенто-тортів 2026: Маленьке свято щодня",
        excerpt: "Чому маленькі тортики стали такими популярними та які дизайни будуть у моді цього року.",
        date: "10 Лютого, 2026",
        image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=800",
        category: "Тренди"
    },
    {
        id: 3,
        title: "Секрети ідеального мусу: Чому наші клієнти це обожнюють",
        excerpt: "Зазирніть за лаштунки нашої кухні та дізнайтеся, що робить наші мусові торти такими легкими та ніжними.",
        date: "05 Лютого, 2026",
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=800",
        category: "Майстерність"
    },
    {
        id: 4,
        title: "Традиції Antreme: Як ми створюємо солодкі шедеври",
        excerpt: "Дізнайтеся про наші сімейні рецепти, натуральні інгредієнти та філософію, яка стоїть за кожним кремовим завитком.",
        date: "01 Лютого, 2026",
        image: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?auto=format&fit=crop&q=80&w=800",
        category: "Про нас"
    },
    {
        id: 5,
        title: "Дитячі свята: Як створити казку за допомогою десертів",
        excerpt: "Ідеї тематичних тортів, які приведуть у захват ваших дітей та стануть головною прикрасою свята.",
        date: "25 Січня, 2026",
        image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800",
        category: "Діти"
    },
    {
        id: 6,
        title: "Симфонія смаку: Кращі поєднання начинок",
        excerpt: "Шоколад та малина, цитрус та карамель? Ми розкриваємо секрети ідеальних смакових пар для вашого торта.",
        date: "20 Січня, 2026",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800",
        category: "Майстерність"
    },
    {
        id: 7,
        title: "Солодкий стіл для корпоративу: Як вразити колег",
        excerpt: "Поради з організації ідеального кенді-бару для вашої компанії — від брендованих капкейків до велетенських тортів.",
        date: "15 Січня, 2026",
        image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800",
        category: "Корпоратив"
    },
    {
        id: 8,
        title: "Еко-кондитерська: Чому ми обираємо тільки натуральні продукти",
        excerpt: "Розповідаємо, чому ми не використовуємо замінники та як справжнє вершкове масло змінює смак ваших десертів.",
        date: "10 Січня, 2026",
        image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&q=80&w=800",
        category: "Якість"
    },
    {
        id: 9,
        title: "Мистецтво декору: Як ми прикрашаємо ваші свята",
        excerpt: "Розкриваємо секрети створення вишуканих прикрас: від живих квітів та ягід до майстерної роботи з шоколадом.",
        date: "05 Січня, 2026",
        image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800",
        category: "Майстерність"
    }
];

function Blog() {
    return (
        <div className="bg-[#F8F3EE] min-h-screen pb-20">
            {/* Hero Section */}
            <div className="bg-amber-400 py-16 md:py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[100px] -translate-y-1/2 -translate-x-1/2 rounded-full"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-[#5a0020] uppercase tracking-tighter mb-4 italic">
                        Наш Блог
                    </h1>
                    <p className="text-lg md:text-xl text-[#5a0020]/80 font-medium max-w-2xl mx-auto uppercase tracking-widest text-[10px] md:text-xs">
                        Історії, поради та натхнення від команди Antreme
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-10 md:-mt-16 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {BLOG_POSTS.map((post) => (
                        <article
                            key={post.id}
                            className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-amber-200/50 transition-all duration-500 group border border-gray-100 flex flex-col"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-amber-400 text-[#5a0020] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 flex flex-col flex-1">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                                    {post.date}
                                </span>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 group-hover:text-vatsak-red transition-colors leading-tight">
                                    {post.title}
                                </h2>
                                <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">
                                    {post.excerpt}
                                </p>
                                <button className="inline-flex items-center gap-2 text-[#5a0020] font-black uppercase tracking-widest text-[11px] group/btn">
                                    <span>Читати далі</span>
                                    <span className="w-8 h-px bg-[#5a0020]/20 group-hover/btn:w-12 transition-all duration-300"></span>
                                    <span className="text-lg group-hover/btn:translate-x-1 transition-transform inline-block">→</span>
                                </button>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Newsletter Box */}
                <div className="mt-20 bg-gray-900 rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-center max-w-5xl mx-auto shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 blur-[100px] -translate-y-1/2 translate-x-1/2 rounded-full"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-6 italic">
                            Залишайтеся солодкими
                        </h2>
                        <p className="text-gray-400 mb-10 max-w-xl mx-auto uppercase tracking-widest text-[10px] md:text-xs">
                            Підписуйтесь на наші оновлення та отримуйте найсвіжіші статті та акції першими
                        </p>
                        <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
                            <input
                                type="email"
                                placeholder="Ваша електронна пошта"
                                className="flex-1 bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-400 transition-all text-sm font-bold"
                            />
                            <button className="bg-amber-400 text-[#5a0020] font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-white transition-all shadow-lg active:scale-95">
                                Підписатися
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Blog;
