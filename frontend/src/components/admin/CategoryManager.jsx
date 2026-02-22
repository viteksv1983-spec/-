import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../constants/categories';
import { FiUpload, FiCheck, FiX, FiImage } from 'react-icons/fi';

export default function CategoryManager() {
    const [metadata, setMetadata] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const [uploadingSlug, setUploadingSlug] = useState(null);

    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const response = await api.get('/admin/categories/metadata');
            setMetadata(response.data);
        } catch (error) {
            console.error("Failed to fetch category metadata", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (slug, file) => {
        setUploadingSlug(slug);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const uploadRes = await api.post('/admin/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            const imageUrl = uploadRes.data.image_url;

            // Update metadata
            await api.patch(`/admin/categories/metadata/${slug}`, { image_url: imageUrl }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            fetchMetadata();
            alert('Зображення оновлено!');
        } catch (error) {
            console.error("Upload failed", error);
            alert('Помилка завантаження');
        } finally {
            setUploadingSlug(null);
        }
    };

    const getCategoryImage = (slug) => {
        const meta = metadata.find(m => m.slug === slug);
        if (meta && meta.image_url) {
            return meta.image_url.startsWith('http') ? meta.image_url : `${api.defaults.baseURL}${meta.image_url}`;
        }
        // Fallback or placeholder
        return `https://placehold.co/400x400/fff/7b002c?text=${slug}`;
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-antreme-red"></div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-3xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Керування категоріями</h1>
                    <p className="text-gray-500 text-sm mt-1">Оновлюйте головні зображення для розділів святкових тортів</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                {CATEGORIES.filter(c => !['bento', 'biscuit', 'mousse', 'wedding', 'cupcakes', 'gingerbread'].includes(c.slug) || c.slug === 'wedding').map((cat) => (
                    <div key={cat.slug} className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="aspect-square md:aspect-video relative bg-gray-50 overflow-hidden">
                            <img
                                src={getCategoryImage(cat.slug)}
                                alt={cat.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {uploadingSlug === cat.slug && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>

                        <div className="p-2.5 md:p-3">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 md:mb-3">
                                <h3 className="font-bold text-gray-900 text-[10px] md:text-xs truncate uppercase tracking-tight text-center md:text-left leading-tight">{cat.name}</h3>
                            </div>

                            <label className="flex items-center justify-center gap-1.5 md:gap-2 w-full px-2 py-1.5 md:px-3 md:py-1.5 bg-gray-50 hover:bg-antreme-red hover:text-white rounded-lg md:rounded-xl text-gray-600 font-bold text-[9px] md:text-[10px] cursor-pointer transition-all border border-gray-100 uppercase tracking-widest text-center mt-auto">
                                <FiUpload className="w-3 h-3 hidden md:block" />
                                <span>Змінити</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            handleImageUpload(cat.slug, e.target.files[0]);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
