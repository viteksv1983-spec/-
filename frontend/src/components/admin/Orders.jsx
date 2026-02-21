import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api'; // Use centralized api instance
import { useAuth } from '../../context/AuthContext';
import { FiPackage, FiClock, FiUser, FiPhone, FiChevronRight, FiCopy, FiX, FiExternalLink, FiTruck } from 'react-icons/fi';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { token } = useAuth();
    const [searchParams] = useSearchParams();
    const statusFilter = searchParams.get('status');

    const fetchOrders = async (status) => {
        setLoading(true);
        try {
            const params = status ? { status } : {};
            const response = await api.get('/orders/', { params });
            // Sort by ID desc (newest first)
            const sorted = response.data.sort((a, b) => b.id - a.id);
            setOrders(sorted);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            // Update local state
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Помилка при оновленні статусу");
        }
    };

    const handleCopyOrder = (order) => {
        const itemsText = order.items.map(item =>
            `- ${item.cake?.name || 'Торт'} x${item.quantity}${item.flavor ? ` (${item.flavor})` : ''}${item.weight ? ` [${item.weight}кг]` : ''}`
        ).join('\n');

        const text = `📦 ЗАМОВЛЕННЯ #${order.id}\n` +
            `👤 Клієнт: ${order.customer_name || 'Гість'}\n` +
            `📞 Телефон: ${order.customer_phone || '-'}\n` +
            `🚚 Доставка: ${order.delivery_method === 'uklon' ? '🚕 Таксі' : '🏪 Самовивіз'}\n` +
            `📅 Дата: ${order.delivery_date || '-'}\n` +
            `🎂 Товари:\n${itemsText}\n` +
            `💰 Сума: ${order.total_price} грн`;

        navigator.clipboard.writeText(text);
        alert("Деталі замовлення скопійовано!");
    };

    useEffect(() => {
        if (token) fetchOrders(statusFilter);
    }, [token, statusFilter]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat('uk-UA', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (e) {
            return dateStr;
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Замовлення</h1>
                    <p className="text-sm text-gray-500 mt-1">Керування замовленнями</p>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Updates</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-5xl">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-600 min-w-[800px]">
                        <thead className="bg-gray-50/50 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 w-32">ID & Дата</th>
                                <th className="px-6 py-4 w-44">Клієнт</th>
                                <th className="px-6 py-4">Товари</th>
                                <th className="px-6 py-4 w-36 text-center">Доставка</th>
                                <th className="px-6 py-4 w-24 text-center">Сума</th>
                                <th className="px-6 py-4 w-32 text-right">Статус</th>
                                <th className="px-6 py-4 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-yellow-50/30 transition-all group cursor-pointer"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 text-sm">#{order.id}</div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-wider">
                                            {formatDate(order.created_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                                                <FiUser className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <div className="font-bold text-gray-900 leading-tight truncate">{order.customer_name || 'Гість'}</div>
                                                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-tight">
                                                    {order.customer_phone || '-'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {order.items && order.items.slice(0, 2).map((item, idx) => (
                                                <div key={idx} className="flex items-start gap-1.5 max-w-xs">
                                                    <div className="mt-1.5 w-1 h-1 bg-yellow-400 rounded-full flex-shrink-0"></div>
                                                    <div className="truncate font-bold text-gray-800 text-[11px] leading-tight">
                                                        {item.cake?.name || `Торт #${item.cake_id}`}
                                                        <span className="text-gray-400 ml-1 font-medium italic">×{item.quantity}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items && order.items.length > 2 && (
                                                <div className="text-[9px] text-vatsak-red font-bold uppercase ml-2.5">
                                                    + ще {order.items.length - 2} тов.
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${order.delivery_method === 'uklon'
                                                ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                : 'bg-green-50 text-green-600 border-green-100'
                                                }`}>
                                                {order.delivery_method === 'uklon' ? '🚕 Uklon' : '🏪 Самовивіз'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-block px-1.5 py-0.5 bg-gray-50 rounded-lg border border-gray-100 group-hover:border-yellow-200 transition-colors">
                                            <span className="font-bold text-gray-900 text-[13px]">{order.total_price}</span>
                                            <span className="text-[9px] text-gray-400 ml-0.5">₴</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer focus:outline-none w-full ${order.status === 'completed'
                                                ? 'bg-green-50 text-green-600 border-green-200'
                                                : order.status === 'processing'
                                                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                                                    : order.status === 'cancelled'
                                                        ? 'bg-gray-50 text-gray-400 border-gray-200'
                                                        : 'bg-amber-50 text-amber-600 border-amber-200'
                                                }`}
                                        >
                                            <option value="pending">Очікує</option>
                                            <option value="processing">В роботі</option>
                                            <option value="completed">Виконано</option>
                                            <option value="cancelled">Скасовано</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <FiChevronRight className="w-4 h-4 text-gray-300 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards View */}
                <div className="md:hidden divide-y divide-gray-100">
                    {orders.map((order) => (
                        <div key={order.id} className="p-4 bg-white hover:bg-yellow-50/20 active:bg-yellow-50/50 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">#{order.id}</div>
                                    <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">
                                        {formatDate(order.created_at)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-gray-900 text-sm">{order.total_price} ₴</span>
                                </div>
                            </div>

                            {/* Mobile Image Thumbnails */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex -space-x-2 overflow-hidden py-1">
                                    {order.items && order.items.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="inline-block w-8 h-8 rounded-full border-2 border-white bg-gray-50 flex-shrink-0 relative overflow-hidden shadow-sm">
                                            {item.cake?.image_url ? (
                                                <img
                                                    src={item.cake.image_url.startsWith('http') ? item.cake.image_url : `${api.defaults.baseURL}${item.cake.image_url}`}
                                                    alt="cake"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                    <span className="text-[8px] font-bold text-gray-400">?</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="text-xs text-gray-500 font-medium italic">
                                    {order.items?.length || 0} тов. {order.items?.length > 3 && <span className="text-vatsak-red font-bold">(+{order.items.length - 3})</span>}
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-1.5">
                                    <FiUser className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-xs font-bold text-gray-700 truncate max-w-[120px]">{order.customer_name || 'Гість'}</span>
                                </div>
                                <div className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border ${order.delivery_method === 'uklon' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                    {order.delivery_method === 'uklon' ? '🚕 Uklon' : '🏪 Самовивіз'}
                                </div>
                            </div>

                            <div className="flex justify-end items-center">
                                <div onClick={(e) => e.stopPropagation()}>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border transition-all cursor-pointer focus:outline-none ${order.status === 'completed'
                                            ? 'bg-green-50 text-green-600 border-green-200'
                                            : order.status === 'processing'
                                                ? 'bg-blue-50 text-blue-600 border-blue-200'
                                                : order.status === 'cancelled'
                                                    ? 'bg-gray-50 text-gray-400 border-gray-200'
                                                    : 'bg-amber-50 text-amber-600 border-amber-200'
                                            }`}
                                    >
                                        <option value="pending">Очікує</option>
                                        <option value="processing">В роботі</option>
                                        <option value="completed">Виконано</option>
                                        <option value="cancelled">Скасовано</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {orders.length === 0 && (
                    <div className="p-12 md:p-20 text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <FiPackage className="w-6 h-6 md:w-8 md:h-8 text-gray-300" />
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-gray-900">Замовлень поки немає</h3>
                        <p className="text-xs md:text-sm text-gray-400 mt-1">Як тільки з'явиться перше замовлення, воно відобразиться тут</p>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity" onClick={() => setSelectedOrder(null)}>
                    <div
                        className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl animate-fade-in-up flex flex-col max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Замовлення #{selectedOrder.id}</h2>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">
                                    {formatDate(selectedOrder.created_at)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleCopyOrder(selectedOrder)}
                                    className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-vatsak-red transition-all"
                                    title="Скопіювати для Telegram"
                                >
                                    <FiCopy className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-gray-900 transition-all"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {/* Customer Section */}
                            <section>
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Клієнт</h3>
                                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 border border-gray-100">
                                        <FiUser className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-gray-900 leading-tight">{selectedOrder.customer_name || 'Гість'}</div>
                                        <div className="flex items-center gap-2 text-vatsak-red font-bold text-sm mt-1">
                                            <FiPhone className="w-3.5 h-3.5" />
                                            {selectedOrder.customer_phone || '-'}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Delivery & Items Section */}
                            <section className="space-y-4">
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Доставка та Товари</h3>

                                {/* Delivery Card */}
                                <div className="flex items-center justify-between p-4 rounded-2xl border-2 border-dashed border-gray-100 bg-white shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedOrder.delivery_method === 'uklon' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                            {selectedOrder.delivery_method === 'uklon' ? <FiTruck className="w-5 h-5" /> : <FiPackage className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-900 uppercase tracking-tight">
                                                {selectedOrder.delivery_method === 'uklon' ? 'Таксі Uklon' : 'Самовивіз з цеху'}
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-medium">Метод доставки</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-gray-900">{selectedOrder.delivery_date || '-'}</div>
                                        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Дата доставки</div>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="group relative flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                                            <div className="w-16 h-16 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex-shrink-0">
                                                {item.cake?.image_url && (
                                                    <img
                                                        src={item.cake.image_url.startsWith('http') ? item.cake.image_url : `${api.defaults.baseURL}${item.cake.image_url}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 py-1">
                                                <div className="font-bold text-gray-900 text-sm truncate uppercase tracking-tight">
                                                    {item.cake?.name || 'Торт'}
                                                </div>
                                                <div className="flex flex-wrap gap-1.5 mt-1">
                                                    {item.flavor && (
                                                        <span className="text-[8px] font-bold uppercase tracking-wider bg-red-50 text-vatsak-red px-1.5 py-0.5 rounded border border-red-100">
                                                            {item.flavor}
                                                        </span>
                                                    )}
                                                    {item.weight && (
                                                        <span className="text-[8px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded border border-gray-100">
                                                            {item.weight} кг
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-2 text-[10px] font-bold text-gray-400">
                                                    {item.quantity} шт. × {Math.round(selectedOrder.total_price / selectedOrder.items.reduce((sum, i) => sum + i.quantity, 0))} ₴
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Order Summary */}
                            <section className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 transform translate-x-16 -translate-y-16 rotate-45 opacity-20 blur-2xl"></div>
                                <div className="relative flex justify-between items-end">
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Разом</div>
                                        <div className="text-3xl font-bold text-yellow-400 drop-shadow-sm">
                                            {selectedOrder.total_price} <span className="text-lg">₴</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Статус</div>
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                                            className="bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider outline-none focus:bg-white/20 transition-all cursor-pointer"
                                        >
                                            <option value="pending" className="text-gray-900">Очікує</option>
                                            <option value="processing" className="text-gray-900">В роботі</option>
                                            <option value="completed" className="text-gray-900">Виконано</option>
                                            <option value="cancelled" className="text-gray-900">Скасовано</option>
                                        </select>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
