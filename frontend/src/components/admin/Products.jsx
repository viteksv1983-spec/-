import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api'; // Use centralized api instance
import { useAuth } from '../../context/AuthContext';
import { FiEdit2, FiPlus, FiGrid, FiList } from 'react-icons/fi';

import { CATEGORIES } from '../../constants/categories';

const NAV_CATEGORIES = [
    { id: 'all', name: 'Усі товари', icon: <FiGrid /> },
    ...CATEGORIES.map(c => ({ id: c.slug, name: c.name }))
];

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get('category') || 'all';
    const { token } = useAuth();

    const fetchProducts = async (category) => {
        setLoading(true);
        try {
            const params = category !== 'all' ? { category } : {};
            const response = await api.get('/cakes/', { params });
            setProducts(response.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(selectedCategory);
    }, [selectedCategory]);

    return (
        <div className="max-w-6xl">
            {/* Main Content */}
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Товари</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {selectedCategory === 'all'
                                ? 'Керування усім асортиментом'
                                : `Керування категорією: ${NAV_CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
                        </p>
                    </div>
                    <Link
                        to="/admin/products/new"
                        className="flex items-center gap-2 bg-[#ffcc00] text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-[#ffdb4d] transition-all shadow-sm active:scale-95"
                    >
                        <FiPlus className="w-5 h-5" />
                        <span>Додати товар</span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
                    {loading ? (
                        <div className="p-20 text-center">
                            <div className="inline-block w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-medium">Завантаження товарів...</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600 min-w-[700px]">
                                    <thead className="bg-gray-50/50 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4">ID</th>
                                            <th className="px-6 py-4">Фото</th>
                                            <th className="px-6 py-4">Назва</th>
                                            <th className="px-6 py-4">Ціна</th>
                                            <th className="px-6 py-4">Вага</th>
                                            <th className="px-6 py-4 text-right">Дії</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {products.length > 0 ? (
                                            products.map((product) => (
                                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="px-6 py-4 font-medium text-gray-400 text-xs">#{product.id}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-yellow-200 transition-colors">
                                                            <img
                                                                src={product.image_url && product.image_url.startsWith('http') ? product.image_url : `${api.defaults.baseURL}${product.image_url}`}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900">{product.name}</div>
                                                        <div className="text-[10px] text-gray-400 uppercase mt-0.5">{product.category}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-gray-900">{product.price}</span>
                                                        <span className="text-[10px] text-gray-400 ml-1">₴</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">{product.weight ? `${product.weight} г` : '-'}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link
                                                            to={`/admin/products/edit/${product.id}`}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 font-bold transition-all"
                                                        >
                                                            <FiEdit2 className="w-4 h-4" />
                                                            <span>Редагувати</span>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-20 text-center text-gray-500">
                                                    Товарів у цій категорії поки що немає
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards View */}
                            <div className="md:hidden divide-y divide-gray-100">
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <div key={product.id} className="flex gap-3 p-4 bg-white hover:bg-gray-50 transition-colors">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 relative">
                                                <img
                                                    src={product.image_url && product.image_url.startsWith('http') ? product.image_url : `${api.defaults.baseURL}${product.image_url}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 py-1">
                                                <div className="flex justify-between items-start">
                                                    <div className="font-bold text-gray-900 text-sm truncate leading-tight w-4/5">{product.name}</div>
                                                    <div className="text-[10px] text-gray-400 ml-2">#{product.id}</div>
                                                </div>
                                                <div className="text-[10px] text-gray-400 uppercase mt-0.5 tracking-wider font-medium">{product.category}</div>
                                                <div className="flex justify-between items-end mt-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-900 text-sm">{product.price} <span className="text-[10px] text-gray-400 font-normal">₴</span></span>
                                                        {product.weight && <span className="text-[10px] text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded">{(product.weight >= 10 && product.weight <= 200) ? product.weight + '0 г' : product.weight + ' кг'}</span>}
                                                    </div>
                                                    <Link
                                                        to={`/admin/products/edit/${product.id}`}
                                                        className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-blue-50 transition-colors border border-gray-100"
                                                    >
                                                        <FiEdit2 className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-gray-500">
                                        Товарів у цій категорії поки що немає
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
