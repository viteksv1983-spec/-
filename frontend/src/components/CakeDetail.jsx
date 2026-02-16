import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { FILLINGS } from '../constants/fillings';
import QuickOrderModal from './QuickOrderModal';


function CakeDetail() {
    const { id } = useParams();
    const [cake, setCake] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [selectedWeight, setSelectedWeight] = useState(1);
    const [selectedFlavor, setSelectedFlavor] = useState(FILLINGS.length > 0 ? FILLINGS[0].name : '');
    const [activeTab, setActiveTab] = useState('description');
    const { addToCart } = useContext(CartContext);
    const [isQuickOrderOpen, setIsQuickOrderOpen] = useState(false);



    const weightOptions = [];
    for (let w = 1; w <= 5; w += 0.5) {
        weightOptions.push(w);
    }

    useEffect(() => {
        api.get(`/cakes/${id}`)
            .then(response => {
                setCake(response.data);
            })
            .catch(error => {
                console.error("Error fetching cake details", error);
            });
    }, [id]);

    const handleAddToCart = () => {
        // Only cakes have flavors for now. If it's not a cake, don't pass flavor or pass null.
        const CAKE_CATEGORIES = ['bento', 'biscuit', 'wedding', 'mousse', 'Торти', 'cake'];
        const flavor = CAKE_CATEGORIES.includes(cake.category) ? selectedFlavor : null;

        // Calculate price based on weight.
        const baseWeightKg = cake.weight ? (cake.weight < 10 ? cake.weight : cake.weight / 1000) : 1;
        const pricePerKg = cake.price / baseWeightKg;
        const finalPrice = Math.round(pricePerKg * selectedWeight);

        const itemToAdd = {
            ...cake,
            price: finalPrice
        };

        addToCart(itemToAdd, quantity, flavor, selectedWeight);
        alert(`${quantity} x ${cake.name} (${selectedWeight} кг) ${flavor ? `(${flavor}) ` : ''}додано в кошик!`);
    };

    const decrementQuantity = () => {
        if (quantity > 1) setQuantity(prev => prev - 1);
    };

    const incrementQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    if (!cake) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-vatsak-red"></div>
            </div>
        );
    }

    // Calculate display price based on selected weight
    const baseWeightKg = cake.weight ? (cake.weight < 10 ? cake.weight : cake.weight / 1000) : 1;
    const pricePerKg = cake.price / baseWeightKg;
    const displayPrice = Math.round(pricePerKg * selectedWeight);

    return (
        <div className="min-h-screen bg-white text-gray-800">
            {/* Breadcrumb */}
            <div className="bg-[#f5f5f5] py-3 border-b border-gray-200">
                <div className="container mx-auto px-4 md:px-6">
                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                        <Link to="/" className="hover:text-vatsak-red transition-colors">Головна</Link> <span className="mx-2 text-gray-300">/</span>
                        <Link to="/cakes" className="hover:text-vatsak-red transition-colors">Торти</Link> <span className="mx-2 text-gray-300">/</span>
                        <span className="text-vatsak-red">{cake.name}</span>
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Section */}
                    <div className="relative">
                        <div className="sticky top-8">
                            <div className="border border-gray-100 overflow-hidden bg-white shadow-lg rounded-3xl">
                                {cake.image_url && (
                                    <img
                                        src={cake.image_url.startsWith('http') ? cake.image_url : `http://localhost:8000${cake.image_url}`}
                                        alt={cake.name}
                                        className="w-full h-auto object-cover"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex flex-col">
                        {/* Category Badge */}
                        {cake.category && (
                            <div className="mb-4">
                                <span className="inline-block bg-vatsak-red/5 text-vatsak-red text-[10px] font-bold px-4 py-1.5 uppercase tracking-[0.1em] rounded-full border border-vatsak-red/10">
                                    {cake.category}
                                </span>
                            </div>
                        )}

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight uppercase tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
                            {cake.name}
                        </h1>

                        <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-100">
                            <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Артикул: {cake.id + 1000}</span>
                            <span className="text-green-700 text-[10px] font-bold uppercase bg-green-50 px-3 py-1.5 tracking-widest rounded-full border border-green-100">
                                В наявності
                            </span>
                        </div>

                        <div className="text-5xl md:text-6xl font-black text-vatsak-red mb-8 flex items-baseline gap-2">
                            {displayPrice} <span className="text-xl text-gray-400 font-bold uppercase">грн</span>
                        </div>

                        {/* Weight Selection */}
                        <div className="mb-8">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-3">
                                <span>Виберіть вагу</span>
                                <div className="flex-1 h-px bg-gray-100"></div>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {weightOptions.map((weight) => (
                                    <button
                                        key={weight}
                                        onClick={() => setSelectedWeight(weight)}
                                        className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-lg border-2 transition-all ${selectedWeight === weight
                                            ? 'border-vatsak-red bg-vatsak-red text-white shadow-md'
                                            : 'border-gray-200 text-gray-600 hover:border-vatsak-red/50 hover:text-vatsak-red bg-white'
                                            }`}
                                    >
                                        {weight} кг
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Flavor Selection */}
                        {['bento', 'biscuit', 'wedding', 'mousse', 'Торти', 'cake'].includes(cake.category) && (
                            <div className="mb-10">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-3">
                                    <span>Виберіть начинку</span>
                                    <div className="flex-1 h-px bg-gray-100"></div>
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {FILLINGS.map((filling) => (
                                        <div
                                            key={filling.id}
                                            onClick={() => setSelectedFlavor(filling.name)}
                                            className={`cursor-pointer group relative rounded-2xl p-3 border-2 transition-all duration-300 ${selectedFlavor === filling.name
                                                ? 'border-vatsak-red bg-vatsak-red/[0.02] shadow-md'
                                                : 'border-gray-100 hover:border-vatsak-red/30 bg-white hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="relative h-20 mb-3 rounded-lg overflow-hidden">
                                                <img
                                                    src={filling.image.startsWith('http') ? filling.image : `http://localhost:8000${filling.image}`}
                                                    alt={filling.name}
                                                    className={`w-full h-full object-cover transition-transform duration-500 ${selectedFlavor === filling.name ? 'scale-110' : 'group-hover:scale-105'}`}
                                                />
                                                {selectedFlavor === filling.name && (
                                                    <div className="absolute inset-0 bg-vatsak-red/10 flex items-center justify-center">
                                                        <div className="bg-vatsak-red text-white p-1 rounded-full shadow-lg">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <p className={`text-[10px] font-bold uppercase tracking-wider text-center transition-colors ${selectedFlavor === filling.name ? 'text-vatsak-red' : 'text-gray-600'}`}>
                                                {filling.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <p className="text-xs text-gray-500 italic leading-relaxed">
                                        <span className="font-bold text-gray-800 not-italic">Опис: </span>
                                        {FILLINGS.find(f => f.name === selectedFlavor)?.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Quantity and Add to Cart */}
                        <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-10">
                            {/* Quantity Selector */}
                            <div className="flex items-center bg-[#fafafa] h-16 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                <button
                                    onClick={decrementQuantity}
                                    className="w-16 h-full flex items-center justify-center text-gray-400 hover:text-vatsak-red transition-colors text-2xl"
                                >
                                    −
                                </button>
                                <span className="w-12 h-full flex items-center justify-center text-lg font-black text-gray-900">
                                    {quantity}
                                </span>
                                <button
                                    onClick={incrementQuantity}
                                    className="w-16 h-full flex items-center justify-center text-gray-400 hover:text-vatsak-red transition-colors text-2xl"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-vatsak-red text-white h-16 px-10 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#8b0032] transition-all shadow-xl hover:shadow-vatsak-red/40 transform active:scale-[0.98] flex items-center justify-center gap-3 rounded-2xl"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                </svg>
                                У Кошик
                            </button>

                            <button
                                onClick={() => setIsQuickOrderOpen(true)}
                                className="flex-1 bg-white text-vatsak-red border-2 border-vatsak-red h-16 px-10 text-xs font-bold uppercase tracking-[0.2em] hover:bg-vatsak-red hover:text-white transition-all shadow-md hover:shadow-vatsak-red/30 transform active:scale-[0.98] flex items-center justify-center gap-3 rounded-2xl"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                Замовити в 1 клік
                            </button>
                        </div>


                        {/* Tabs */}
                        <div className="mb-6">
                            <div className="flex border-b border-gray-200 mb-6">
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'description'
                                        ? 'text-vatsak-red border-b-2 border-vatsak-red'
                                        : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    Опис
                                </button>
                                <button
                                    onClick={() => setActiveTab('ingredients')}
                                    className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'ingredients'
                                        ? 'text-vatsak-red border-b-2 border-vatsak-red'
                                        : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    Склад
                                </button>
                                <button
                                    onClick={() => setActiveTab('delivery')}
                                    className={`px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'delivery'
                                        ? 'text-vatsak-red border-b-2 border-vatsak-red'
                                        : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    Доставка
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="text-gray-600 leading-relaxed">
                                {activeTab === 'description' && (
                                    <div>
                                        <p className="mb-4 text-base">{cake.description}</p>

                                        {/* Характеристики */}
                                        <div className="bg-gray-50 p-5 mt-6 space-y-3">
                                            <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wide mb-4">Характеристики</h3>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                {cake.weight && (
                                                    <>
                                                        <div className="text-gray-500">Вага:</div>
                                                        <div className="font-semibold text-gray-900">{Math.round(cake.weight)} г</div>
                                                    </>
                                                )}
                                                {cake.shelf_life && (
                                                    <>
                                                        <div className="text-gray-500">Термін придатності:</div>
                                                        <div className="font-semibold text-gray-900">{cake.shelf_life}</div>
                                                    </>
                                                )}
                                                {cake.category && (
                                                    <>
                                                        <div className="text-gray-500">Категорія:</div>
                                                        <div className="font-semibold text-gray-900">{cake.category}</div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'ingredients' && (
                                    <div>
                                        <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wide mb-4">Склад продукту</h3>
                                        <p className="text-base">{cake.ingredients || 'Інформація про склад уточнюється'}</p>
                                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mt-6">
                                            <p className="text-sm text-amber-800">
                                                <strong>Увага!</strong> Може містити сліди горіхів, молока та глютену.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'delivery' && (
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-6 h-6 text-vatsak-red flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-1">Безкоштовна доставка</h4>
                                                <p className="text-sm">При замовленні від 500 грн по місту</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <svg className="w-6 h-6 text-vatsak-red flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-1">Швидка доставка</h4>
                                                <p className="text-sm">Доставка протягом 24 годин у межах міста</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <svg className="w-6 h-6 text-vatsak-red flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            <div>
                                                <h4 className="font-bold text-gray-900 mb-1">Гарантія якості</h4>
                                                <p className="text-sm">Тільки свіжі інгредієнти та перевірені рецепти</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="bg-gray-50 p-5 text-sm text-gray-600 space-y-2 mt-4">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>100% натуральні інгредієнти</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>Виготовлено в день замовлення</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                <span>Сертифікована продукція</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <QuickOrderModal
                cake={cake}
                isOpen={isQuickOrderOpen}
                onClose={() => setIsQuickOrderOpen(false)}
            />
        </div>
    );

}

export default CakeDetail;
