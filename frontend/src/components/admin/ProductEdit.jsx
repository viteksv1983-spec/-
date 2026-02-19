import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

import { ALL_CATEGORIES } from '../../constants/categories';

const CATEGORIES = ALL_CATEGORIES;

const WEIGHT_OPTIONS = [
    { value: 400, label: '400 г (Бенто)' },
    { value: 500, label: '500 г' },
    { value: 600, label: '600 г' },
    { value: 800, label: '800 г' },
    { value: 1000, label: '1 кг' },
    { value: 1500, label: '1.5 кг' },
    { value: 2000, label: '2 кг' },
    { value: 2500, label: '2.5 кг' },
    { value: 3000, label: '3 кг' },
    { value: 4000, label: '4 кг' },
    { value: 5000, label: '5 кг' }
];

export default function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const isNew = !id || id === 'new';
    const [loading, setLoading] = useState(!isNew);
    const [activeTab, setActiveTab] = useState('content'); // 'content' or 'seo'

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        weight: '',
        category: '',
        image_url: '',
        // SEO
        meta_title: '',
        meta_description: '',
        h1_heading: '',
        meta_keywords: '',
        canonical_url: ''
    });

    useEffect(() => {
        if (isNew) {
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const response = await api.get(`/cakes/${id}`);
                setFormData({
                    ...response.data,
                    // Ensure fields are not null for inputs
                    description: response.data.description || '',
                    weight: response.data.weight || '',
                    category: response.data.category || '',
                    image_url: response.data.image_url || '',
                    meta_title: response.data.meta_title || '',
                    meta_description: response.data.meta_description || '',
                    h1_heading: response.data.h1_heading || '',
                    meta_keywords: response.data.meta_keywords || '',
                    canonical_url: response.data.canonical_url || ''
                });
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, isNew]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert numbers to correct types
            const dataToSave = {
                ...formData,
                price: parseFloat(formData.price),
                weight: formData.weight ? parseFloat(formData.weight) : null
            };

            if (isNew) {
                await api.post('/cakes/', dataToSave);
                alert('Товар додано!');
            } else {
                await api.patch(`/cakes/${id}`, dataToSave, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Товар оновлено!');
            }
            navigate('/admin/products');
        } catch (error) {
            console.error("Failed to save product", error);
            const detail = error.response?.data?.detail;
            const errorMsg = Array.isArray(detail) ? detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join('\n') : (typeof detail === 'string' ? detail : 'Помилка збереження');
            alert(errorMsg);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/admin/products')} className="p-2 hover:bg-gray-100 rounded-full">
                    <FiArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold">{isNew ? 'Додавання нового товару' : `Редагування товару: ${formData.name}`}</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        type="button"
                        onClick={() => setActiveTab('content')}
                        className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider ${activeTab === 'content' ? 'bg-gray-50 text-vatsak-red border-b-2 border-vatsak-red' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Основна інформація
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('seo')}
                        className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider ${activeTab === 'seo' ? 'bg-gray-50 text-vatsak-red border-b-2 border-vatsak-red' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        SEO Налаштування
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'content' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Назва</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vatsak-red focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Ціна (грн)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vatsak-red focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Опис</label>
                                <textarea
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vatsak-red focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Вага</label>
                                    <select
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vatsak-red focus:border-transparent cursor-pointer"
                                    >
                                        <option value="">Оберіть вагу</option>
                                        {WEIGHT_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Категорія</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vatsak-red focus:border-transparent cursor-pointer"
                                    >
                                        <option value="">Оберіть категорію</option>
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Зображення товару</label>
                                <div className="flex flex-col gap-4">
                                    {formData.image_url && (
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                                                <img
                                                    src={formData.image_url.startsWith('http') || formData.image_url.startsWith('blob') ? formData.image_url : `${api.defaults.baseURL}${formData.image_url}`}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                                                className="px-4 py-2 text-xs font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Видалити фото
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                name="image_url"
                                                value={formData.image_url}
                                                onChange={handleChange}
                                                placeholder="Вставте посилання або завантажте файл"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vatsak-red focus:border-transparent mb-2"
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;

                                                    const uploadData = new FormData();
                                                    uploadData.append('file', file);

                                                    try {
                                                        const response = await api.post('/admin/upload', uploadData, {
                                                            headers: {
                                                                'Content-Type': 'multipart/form-data',
                                                                'Authorization': `Bearer ${token}`
                                                            }
                                                        });
                                                        setFormData(prev => ({ ...prev, image_url: response.data.image_url }));
                                                    } catch (error) {
                                                        console.error("Upload failed", error);
                                                        const detail = error.response?.data?.detail;
                                                        alert("Помилка завантаження файлу: " + (typeof detail === 'string' ? detail : "Перевірте підключення або спробуйте увійти знову"));
                                                    }
                                                }}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-vatsak-red file:text-white hover:file:bg-red-700 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Meta Title (Заголовок вкладки)</label>
                                <input
                                    type="text"
                                    name="meta_title"
                                    value={formData.meta_title}
                                    onChange={handleChange}
                                    placeholder="Купити торт Київ..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Рекомендована довжина: 50-60 символів.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Meta Description (Опис для Google)</label>
                                <textarea
                                    name="meta_description"
                                    rows="3"
                                    value={formData.meta_description}
                                    onChange={handleChange}
                                    placeholder="Смачні торти на замовлення..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Рекомендована довжина: 150-160 символів.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">H1 Заголовок</label>
                                <input
                                    type="text"
                                    name="h1_heading"
                                    value={formData.h1_heading}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Keywords (Ключові слова)</label>
                                <input
                                    type="text"
                                    name="meta_keywords"
                                    value={formData.meta_keywords}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Canonical URL</label>
                                <input
                                    type="text"
                                    name="canonical_url"
                                    value={formData.canonical_url}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-bold shadow-lg shadow-green-200"
                    >
                        <FiSave className="w-5 h-5" />
                        <span>{isNew ? 'Додати товар' : 'Зберегти зміни'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
