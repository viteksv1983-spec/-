import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';

function CakeDetail() {
    const { id } = useParams();
    const [cake, setCake] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const { addToCart } = useContext(CartContext);

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
        addToCart(cake, quantity);
        alert(`${quantity} x ${cake.name} додано в кошик!`);
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

    return (
        <div className="min-h-screen bg-white text-gray-800">
            {/* Breadcrumb */}
            <div className="bg-[#f5f5f5] py-3 border-b border-gray-200">
                <div className="container mx-auto px-4 md:px-6">
                    <p className="text-gray-500 text-xs uppercase tracking-wide font-medium">
                        <Link to="/" className="hover:text-vatsak-red">Головна</Link> <span className="mx-2">/</span>
                        <Link to="/cakes" className="hover:text-vatsak-red">Торти</Link> <span className="mx-2">/</span>
                        <span className="text-vatsak-red">{cake.name}</span>
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Section */}
                    <div className="relative">
                        <div className="sticky top-8">
                            <div className="border border-gray-100 overflow-hidden bg-white shadow-sm">
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
                            <div className="mb-3">
                                <span className="inline-block bg-vatsak-red/10 text-vatsak-red text-xs font-bold px-3 py-1 uppercase tracking-wider">
                                    {cake.category}
                                </span>
                            </div>
                        )}

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight uppercase tracking-wide">
                            {cake.name}
                        </h1>

                        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
                            <span className="text-xs text-gray-400 uppercase tracking-widest">Артикул: {cake.id + 1000}</span>
                            <span className="text-green-700 text-xs font-bold uppercase bg-green-50 px-3 py-1 tracking-wider">
                                В наявності
                            </span>
                        </div>

                        <div className="text-4xl md:text-5xl font-bold text-vatsak-red mb-8">
                            {cake.price} <span className="text-2xl text-gray-600 font-normal">грн</span>
                        </div>

                        {/* Quantity and Add to Cart */}
                        <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-8">
                            {/* Quantity Selector */}
                            <div className="flex items-center border-2 border-gray-200 h-14">
                                <button
                                    onClick={decrementQuantity}
                                    className="w-14 h-full flex items-center justify-center text-gray-500 hover:text-vatsak-red hover:bg-gray-50 transition-colors text-2xl font-bold"
                                >
                                    −
                                </button>
                                <span className="w-14 h-full flex items-center justify-center text-lg font-bold text-gray-800 border-x-2 border-gray-200">
                                    {quantity}
                                </span>
                                <button
                                    onClick={incrementQuantity}
                                    className="w-14 h-full flex items-center justify-center text-gray-500 hover:text-vatsak-red hover:bg-gray-50 transition-colors text-2xl font-bold"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-vatsak-red text-white h-14 px-8 text-base font-bold uppercase tracking-widest hover:bg-red-900 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                </svg>
                                В Кошик
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
                                                        <div className="font-semibold text-gray-900">{cake.weight} г</div>
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
        </div>
    );
}

export default CakeDetail;
