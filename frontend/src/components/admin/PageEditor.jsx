import React, { useState, useEffect } from 'react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { FiSave, FiX, FiInfo, FiLayout, FiImage, FiSettings } from 'react-icons/fi';

export default function PageEditor() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const [selectedPage, setSelectedPage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const response = await api.get('/admin/pages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPages(response.data);
            if (response.data.length > 0) {
                // Select home page by default if exists
                const home = response.data.find(p => p.route_path === '/') || response.data[0];
                setSelectedPage(home);
            }
        } catch (error) {
            console.error("Failed to fetch pages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.patch(`/admin/pages/${selectedPage.id}`, selectedPage, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Сторінку оновлено успішно! ✨');
            fetchPages();
        } catch (error) {
            console.error("Save failed", error);
            alert('Помилка при збереженні');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vatsak-red"></div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar with page list */}
            <div className="w-full lg:w-72 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/30">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <FiLayout className="text-vatsak-red text-lg" />
                            <span>Сторінки сайту</span>
                        </h2>
                    </div>
                    <div className="p-2 space-y-1">
                        {pages.map((page) => (
                            <button
                                key={page.id}
                                onClick={() => setSelectedPage(page)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all text-sm font-medium flex flex-col gap-0.5 ${selectedPage?.id === page.id
                                        ? 'bg-vatsak-red text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="truncate">{page.name}</span>
                                <span className={`text-[10px] font-mono ${selectedPage?.id === page.id ? 'text-white/70' : 'text-gray-400'}`}>
                                    {page.route_path}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Editor Area */}
            {selectedPage && (
                <div className="flex-grow space-y-6">
                    {/* Header with Save Button */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Редагування: {selectedPage.name}</h1>
                            <p className="text-gray-400 text-xs font-mono mt-1">{selectedPage.route_path}</p>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold bg-green-600 text-white shadow-lg hover:bg-green-700 transition-all ${isSaving ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                        >
                            {isSaving ? <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full"></div> : <FiSave />}
                            <span>ЗБЕРЕГТИ ЗМІНИ</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* SEO Section */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <FiSettings className="text-vatsak-red" />
                                    SEO налаштування
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Meta Title</label>
                                        <input
                                            type="text"
                                            value={selectedPage.meta_title || ''}
                                            onChange={e => setSelectedPage({ ...selectedPage, meta_title: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-vatsak-red/10 transition-all text-sm outline-none"
                                            placeholder="Назва сторінки для пошуковиків"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Meta Description</label>
                                        <textarea
                                            rows="4"
                                            value={selectedPage.meta_description || ''}
                                            onChange={e => setSelectedPage({ ...selectedPage, meta_description: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-vatsak-red/10 transition-all text-sm outline-none resize-none"
                                            placeholder="Короткий опис для Google..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">H1 Заголовок</label>
                                        <input
                                            type="text"
                                            value={selectedPage.h1_heading || ''}
                                            onChange={e => setSelectedPage({ ...selectedPage, h1_heading: e.target.value })}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-vatsak-red/10 transition-all text-sm outline-none font-bold"
                                            placeholder="Головний заголовок сторінки"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <FiInfo className="text-vatsak-red" />
                                    Текстовий контент
                                </h3>
                                <div className="flex-grow flex flex-col">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Текст сторінки</label>
                                    <textarea
                                        value={selectedPage.content || ''}
                                        onChange={e => setSelectedPage({ ...selectedPage, content: e.target.value })}
                                        className="w-full flex-grow px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-vatsak-red/10 transition-all text-sm outline-none min-h-[300px]"
                                        placeholder="Введіть основний текст сторінки..."
                                    />
                                    <p className="text-[10px] text-gray-400 mt-3 italic">
                                        * Наразі підтримується звичайний текст. HTML-теги будуть додані в наступних оновленнях.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
