import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function Home() {
    const [featuredCakes, setFeaturedCakes] = useState([]);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Fetch featured cakes (first 6)
        api.get('/cakes/')
            .then(response => {
                setFeaturedCakes(response.data.slice(0, 6));
            })
            .catch(error => {
                console.error("Error fetching featured cakes", error);
            });

        // Trigger fade-in animation
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Animation */}
            <div className="relative bg-gradient-to-br from-[#f5efe6] via-[#fff8e7] to-[#f5efe6] min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
                {/* Animated decorative elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-9xl text-gray-400 animate-float">🎂</div>
                    <div className="absolute bottom-20 right-20 text-9xl text-gray-400 animate-float-delayed">🍰</div>
                    <div className="absolute top-1/3 right-1/4 text-7xl text-gray-400 animate-float-slow">🧁</div>
                </div>

                {/* Animated gradient overlay */}
                <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-amber-100/20 to-transparent animate-shimmer"></div>

                <div className={`container mx-auto px-6 py-20 relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="max-w-3xl">
                        <div className="text-base md:text-lg text-amber-700 mb-4 font-light italic animate-fade-in" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            Для тебе
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight uppercase animate-slide-up" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Найсмачніші<br />
                            Торти і Солодощі<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-red-600 animate-gradient">
                                За Доступною Ціною
                            </span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 mb-4 max-w-2xl animate-fade-in-delayed">
                            У мене можна замовити більше 15 різновидностей тортів та багато смачненького
                        </p>
                        <p className="text-sm md:text-base text-gray-500 mb-8 italic animate-fade-in-delayed">
                            Приготовані з любов'ю та душею. Кожен торт - унікальна робота авторського кондитера.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delayed">
                            <Link to="/cakes" className="group inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-10 py-4 font-bold uppercase text-sm tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 text-center duration-300">
                                <span className="flex items-center justify-center gap-2">
                                    Переглянути Торти
                                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                                </span>
                            </Link>
                            <Link to="/promotions" className="inline-block bg-white text-gray-900 px-10 py-4 font-bold uppercase text-sm tracking-wider border-2 border-gray-300 hover:border-vatsak-red hover:text-vatsak-red transition-all text-center duration-300 transform hover:-translate-y-1">
                                Акції
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Decorative cake image with parallax effect */}
                <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 animate-float-slow">
                        <div className="text-[#d2691e] text-[600px] font-bold opacity-40 drop-shadow-[0_10px_30px_rgba(210,105,30,0.4)]" style={{
                            filter: 'contrast(1.2) saturate(1.3)'
                        }}>🍰</div>
                    </div>
                </div>
            </div>

            {/* Product Category Cards with Staggered Animation */}
            <div className="container mx-auto px-6 py-20" id="categories">
                <div className="text-center mb-12 animate-fade-in">
                    <div className="text-sm text-amber-700 mb-2 uppercase tracking-widest">Категорії</div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-800" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        ЩО МИ ПРОПОНУЄМО
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1 - Торти */}
                    <div className="group bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in">
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-pink-100 to-amber-50 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                            <div className="text-9xl opacity-90 group-hover:scale-125 transition-transform duration-700 relative z-10">🎂</div>
                            <div className="absolute top-4 right-4 bg-vatsak-red text-white px-3 py-1 text-xs font-bold uppercase rounded-full">
                                Хіт
                            </div>
                        </div>
                        <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
                            <h3 className="text-3xl font-bold text-gray-800 mb-3 uppercase group-hover:text-vatsak-red transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                Торти
                            </h3>
                            <p className="text-gray-600 mb-1 italic text-sm" style={{ fontFamily: "'Dancing Script', cursive" }}>
                                Празднічні, урочисті
                            </p>
                            <p className="text-gray-600 mb-6 text-sm">
                                Кожен день — повод для свята
                            </p>
                            <Link to="/cakes?category=cakes" className="inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-8 py-3 font-bold uppercase text-xs tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-300">
                                Замовити
                            </Link>
                        </div>
                    </div>

                    {/* Card 2 - Печиво */}
                    <div className="group bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in-delayed">
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-50 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                            <div className="text-9xl opacity-90 group-hover:scale-125 transition-transform duration-700 relative z-10">🍪</div>
                        </div>
                        <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
                            <h3 className="text-3xl font-bold text-gray-800 mb-3 uppercase group-hover:text-vatsak-red transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                Печиво
                            </h3>
                            <p className="text-gray-600 mb-1 italic text-sm" style={{ fontFamily: "'Dancing Script', cursive" }}>
                                Хрустке і м'яке
                            </p>
                            <p className="text-gray-600 mb-6 text-sm">
                                З горіхами або фруктами, у шоколаді
                            </p>
                            <Link to="/cakes?category=cookies" className="inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-8 py-3 font-bold uppercase text-xs tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-300">
                                Замовити
                            </Link>
                        </div>
                    </div>

                    {/* Card 3 - Солодощі */}
                    <div className="group bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-scale-in-more-delayed">
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-50 flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                            <div className="text-9xl opacity-90 group-hover:scale-125 transition-transform duration-700 relative z-10">🧁</div>
                        </div>
                        <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
                            <h3 className="text-3xl font-bold text-gray-800 mb-3 uppercase group-hover:text-vatsak-red transition-colors" style={{ fontFamily: "'Oswald', sans-serif" }}>
                                Солодощі
                            </h3>
                            <p className="text-gray-600 mb-1 italic text-sm" style={{ fontFamily: "'Dancing Script', cursive" }}>
                                Для найближчих
                            </p>
                            <p className="text-gray-600 mb-6 text-sm">
                                Те, чим хочеться поділитися
                            </p>
                            <Link to="/cakes?category=sweets" className="inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-8 py-3 font-bold uppercase text-xs tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-300">
                                Замовити
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Impact Section - Vatsak Style */}
            <div className="relative bg-white py-24 overflow-hidden">
                {/* Decorative product images with floating emojis */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Top Left - Cake slice */}
                    <div className="absolute top-12 left-8 md:left-20 transform -rotate-12 animate-float">
                        <div className="text-9xl md:text-[180px] opacity-70 drop-shadow-[0_8px_20px_rgba(0,0,0,0.2)]" style={{ filter: 'contrast(1.3) saturate(1.4) brightness(1.1)' }}>🍰</div>
                    </div>

                    {/* Top Right - Orange slices */}
                    <div className="absolute top-16 right-8 md:right-24 transform rotate-12 animate-float-delayed">
                        <div className="text-7xl md:text-[120px] opacity-75 drop-shadow-[0_8px_20px_rgba(0,0,0,0.2)]" style={{ filter: 'contrast(1.3) saturate(1.5) brightness(1.1)' }}>🍊</div>
                    </div>

                    {/* Bottom Right - Chocolate truffles */}
                    <div className="absolute bottom-20 right-12 md:right-32 transform rotate-6 animate-float-slow">
                        <div className="text-8xl md:text-[150px] opacity-70 drop-shadow-[0_8px_20px_rgba(0,0,0,0.25)]" style={{ filter: 'contrast(1.3) saturate(1.4) brightness(1.05)' }}>🍫</div>
                    </div>

                    {/* Bottom Left - Berries */}
                    <div className="absolute bottom-24 left-12 md:left-28 transform -rotate-6 animate-float">
                        <div className="text-7xl md:text-[100px] opacity-75 drop-shadow-[0_8px_20px_rgba(0,0,0,0.2)]" style={{ filter: 'contrast(1.3) saturate(1.6) brightness(1.1)' }}>🍓</div>
                    </div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight uppercase" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            <span className="text-[#ffd700] drop-shadow-[0_4px_12px_rgba(255,215,0,0.5)] animate-pulse-slow">
                                Смак
                            </span>
                            <span className="text-gray-800">, </span>
                            <span className="text-[#ffd700] drop-shadow-[0_4px_12px_rgba(255,215,0,0.5)] animate-pulse-slow" style={{ animationDelay: '0.2s' }}>
                                Якість
                            </span>
                            <br className="hidden md:block" />
                            <span className="text-gray-800"> і </span>
                            <span className="text-[#ffd700] drop-shadow-[0_4px_12px_rgba(255,215,0,0.5)] animate-pulse-slow" style={{ animationDelay: '0.4s' }}>
                                Ціна
                            </span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-700 italic" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            це наші головні цінності
                        </p>
                    </div>
                </div>
            </div>

            {/* About Section with Parallax */}
            <div className="relative bg-gradient-to-br from-[#f5efe6] via-[#fff8e7] to-[#f5efe6] py-20 overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-20 text-6xl">🌿</div>
                    <div className="absolute bottom-20 right-20 text-6xl">✨</div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-xl md:text-2xl text-gray-800 font-bold mb-8 leading-relaxed animate-fade-in" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Я створюю торти з любов'ю та увагою до кожної деталі. Кожен торт виготовляється індивідуально з натуральних інгредієнтів найвищої якості.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div className="group flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105">
                                <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">✨</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Ручна робота</h4>
                                    <p className="text-gray-600 text-sm">Кожен торт виготовляється вручну з особливою увагою до деталей</p>
                                </div>
                            </div>
                            <div className="group flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105">
                                <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">🌿</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Натуральні інгредієнти</h4>
                                    <p className="text-gray-600 text-sm">Використовую тільки якісні та свіжі продукти</p>
                                </div>
                            </div>
                            <div className="group flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105">
                                <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">💝</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Індивідуальний підхід</h4>
                                    <p className="text-gray-600 text-sm">Враховую всі ваші побажання та особливі запити</p>
                                </div>
                            </div>
                            <div className="group flex items-start gap-4 p-6 bg-white/60 backdrop-blur-sm rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105">
                                <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">⏰</div>
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-2 text-lg">Свіжість щодня</h4>
                                    <p className="text-gray-600 text-sm">Готую торти безпосередньо перед доставкою</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Products */}
            {featuredCakes.length > 0 && (
                <div className="container mx-auto px-6 py-20">
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="text-sm text-amber-700 mb-2 uppercase tracking-widest">Популярні</div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            Обирають найчастіше
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {featuredCakes.map((cake, index) => (
                            <Link
                                to={`/cakes/${cake.id}`}
                                key={cake.id}
                                className="group animate-fade-in-stagger"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                        {cake.image_url && (
                                            <img
                                                src={cake.image_url.startsWith('http') ? cake.image_url : `http://localhost:8000${cake.image_url}`}
                                                alt={cake.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                                    </div>
                                    <div className="p-4 text-center">
                                        <h4 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 min-h-[40px] group-hover:text-vatsak-red transition-colors">{cake.name}</h4>
                                        <p className="text-lg font-bold text-amber-600">
                                            {cake.price} <span className="text-xs text-gray-500">грн</span>
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-12 animate-fade-in-delayed">
                        <Link to="/cakes" className="group inline-block bg-gradient-to-r from-[#ffd700] to-[#ffed4e] text-gray-900 px-12 py-5 font-bold uppercase text-sm tracking-wider hover:from-[#ffed4e] hover:to-[#ffd700] transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 duration-300">
                            <span className="flex items-center justify-center gap-2">
                                Всі пропозиції
                                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Call to Action Banner */}
            <div className="relative bg-gradient-to-r from-vatsak-red via-red-700 to-vatsak-red text-white py-16 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 text-6xl animate-float">🎉</div>
                    <div className="absolute bottom-10 right-10 text-6xl animate-float-delayed">🎊</div>
                </div>

                <div className="container mx-auto px-6 text-center relative z-10">
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in" style={{ fontFamily: "'Oswald', sans-serif" }}>
                        ГОТОВІ ЗАМОВИТИ ТОРТ МРІЇ?
                    </h3>
                    <p className="text-lg mb-8 opacity-90 animate-fade-in-delayed">
                        Зв'яжіться з нами або оберіть торт з каталогу
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delayed">
                        <a href="tel:0800123456" className="inline-block bg-white text-vatsak-red px-10 py-4 font-bold uppercase text-sm tracking-wider hover:bg-gray-100 transition-all shadow-lg transform hover:scale-105">
                            📞 Телефонувати
                        </a>
                        <Link to="/cakes" className="inline-block bg-[#ffd700] text-gray-900 px-10 py-4 font-bold uppercase text-sm tracking-wider hover:bg-[#ffed4e] transition-all shadow-lg transform hover:scale-105">
                            Обрати Торт
                        </Link>
                    </div>
                </div>
            </div>

            {/* Add custom CSS for animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-30px); }
                }
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(5deg); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fade-in-delayed {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes scale-in {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.8; }
                }

                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
                .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
                .animate-shimmer { animation: shimmer 3s infinite; background-size: 200% 100%; }
                .animate-fade-in { animation: fade-in 1s ease-out; }
                .animate-fade-in-delayed { animation: fade-in-delayed 1s ease-out 0.3s both; }
                .animate-slide-up { animation: slide-up 0.8s ease-out; }
                .animate-scale-in { animation: scale-in 0.6s ease-out; }
                .animate-scale-in-delayed { animation: scale-in 0.6s ease-out 0.2s both; }
                .animate-scale-in-more-delayed { animation: scale-in 0.6s ease-out 0.4s both; }
                .animate-fade-in-stagger { animation: fade-in 0.6s ease-out both; }
                .animate-gradient { 
                    background-size: 200% auto;
                    animation: gradient 3s ease infinite;
                }
                .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
            `}</style>
        </div>
    );
}

export default Home;
