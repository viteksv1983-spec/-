import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiEdit2 } from 'react-icons/fi';

export default function SEOPages() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editingPage, setEditingPage] = useState(null);

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const response = await api.get('/admin/pages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPages(response.data);
        } catch (error) {
            console.error("Failed to fetch pages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingPage({
            route_path: '/',
            name: '',
            meta_title: '',
            meta_description: '',
            h1_heading: ''
        });
        setIsEditing(true);
    };

    const handleEdit = (page) => {
        setEditingPage(page);
        setIsEditing(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingPage.id) {
                await api.patch(`/admin/pages/${editingPage.id}`, editingPage, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await api.post('/admin/pages', editingPage, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsEditing(false);
            setEditingPage(null);
            fetchPages();
            alert('Збережено!');
        } catch (error) {
            console.error("Failed to save page", error);
            alert('Помилка збереження');
        }
    };

    if (loading) return <div>Завантаження...</div>;

    return (
        <div className="max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold">SEO Статичних Сторінок</h1>
                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 bg-antreme-red text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors shrink-0"
                >
                    <FiPlus />
                    <span>Додати сторінку</span>
                </button>
            </div>

            {isEditing ? (
                <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
                    <h2 className="text-xl font-bold mb-6">{editingPage.id ? 'Редагування' : 'Нова сторінка'}</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">URL (Route Path)</label>
                            <input
                                type="text"
                                value={editingPage.route_path}
                                onChange={e => setEditingPage({ ...editingPage, route_path: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="/ або /catalog"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Назва (для адмінки)</label>
                            <input
                                type="text"
                                value={editingPage.name}
                                onChange={e => setEditingPage({ ...editingPage, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                placeholder="Головна сторінка"
                            />
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="font-bold mb-4 text-gray-900">SEO Дані</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Meta Title</label>
                                    <input
                                        type="text"
                                        value={editingPage.meta_title || ''}
                                        onChange={e => setEditingPage({ ...editingPage, meta_title: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Meta Description</label>
                                    <textarea
                                        rows="3"
                                        value={editingPage.meta_description || ''}
                                        onChange={e => setEditingPage({ ...editingPage, meta_description: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">H1 Heading</label>
                                    <input
                                        type="text"
                                        value={editingPage.h1_heading || ''}
                                        onChange={e => setEditingPage({ ...editingPage, h1_heading: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700"
                        >
                            Зберегти
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 min-w-[600px]">
                        <thead className="bg-gray-50 text-gray-900 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">URL</th>
                                <th className="px-6 py-4 hidden sm:table-cell">Назва</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4 hidden md:table-cell">H1</th>
                                <th className="px-6 py-4">Дії</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pages.map((page) => (
                                <tr key={page.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-mono text-xs">{page.route_path}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900 hidden sm:table-cell">{page.name}</td>
                                    <td className="px-6 py-4 truncate max-w-[150px] sm:max-w-[200px]" title={page.meta_title}>{page.meta_title}</td>
                                    <td className="px-6 py-4 hidden md:table-cell">{page.h1_heading}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleEdit(page)}
                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                        >
                                            <FiEdit2 className="w-4 h-4" />
                                            <span className="hidden sm:inline">Редагувати</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
