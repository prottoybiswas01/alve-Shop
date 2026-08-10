import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { printInvoiceHTML } from '../../services/invoiceService';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Printer,
  Eye,
  Truck,
  Clock,
  Check,
} from 'lucide-react';

export const ModeratorDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    dispatchOrderToCourier,
    setActiveModal,
    setActiveTrackingOrder,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dispatchLoadingId, setDispatchLoadingId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      !searchTerm.trim() ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm) ||
      o.courierConsignment?.trackingCode.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleDispatch = async (orderId: string, provider: 'pathao' | 'steadfast') => {
    setDispatchLoadingId(orderId);
    await dispatchOrderToCourier(orderId, provider);
    setDispatchLoadingId(null);
  };

  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const readyCount = orders.filter((o) => o.status === 'confirmed').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header Banner */}
      <header className="bg-slate-900/90 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-rose-600 flex items-center justify-center text-white font-black shadow-lg shadow-amber-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white">Order Verification & Logistics Desk</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                  Moderator Ops
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Verify pending orders, issue customer invoices, and auto-dispatch to Pathao & Steadfast logistics APIs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2 px-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-slate-400">Pending Orders</div>
                <div className="text-sm font-black text-amber-400">{pendingCount}</div>
              </div>
            </div>
            <div className="w-px h-7 bg-slate-800" />
            <div className="flex items-center gap-2 px-2">
              <Check className="w-4 h-4 text-blue-400" />
              <div>
                <div className="text-[10px] text-slate-400">Confirmed</div>
                <div className="text-sm font-black text-blue-400">{readyCount}</div>
              </div>
            </div>
            <div className="w-px h-7 bg-slate-800" />
            <div className="flex items-center gap-2 px-2">
              <Truck className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-[10px] text-slate-400">In Transit</div>
                <div className="text-sm font-black text-purple-400">{shippedCount}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Operations Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search & Status Filters Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Order ID, Customer Name, Phone, or Courier Tracking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl font-bold uppercase text-[11px] transition-all ${
                  statusFilter === st
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Queue Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-bold">
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer Info</th>
                  <th className="p-4">Delivery Address</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4">Courier Consignment</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 font-mono">
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          <span>{order.id}</span>
                          {order.channel === 'offline_pos' && (
                            <span className="text-[9px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded font-sans font-bold">
                              POS
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-slate-200">{order.customerName}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{order.customerPhone}</div>
                        <div className="text-slate-500 text-[10px] uppercase font-bold">
                          {order.paymentMethod} • {order.paymentStatus}
                        </div>
                      </td>

                      <td className="p-4 max-w-xs">
                        <div className="text-slate-300 truncate">{order.shippingAddress.fullAddress}</div>
                        <div className="text-slate-500 font-semibold text-[11px]">
                          {order.shippingAddress.cityZone}, {order.shippingAddress.district}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="font-black text-white text-sm">৳{order.totalAmount.toLocaleString('en-BD')}</div>
                        <div className="text-slate-500 text-[10px]">{order.items.length} item(s)</div>
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                            order.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : order.status === 'confirmed'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : order.status === 'shipped'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                              : order.status === 'delivered'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="p-4">
                        {order.courierConsignment ? (
                          <div>
                            <div className="font-bold text-blue-400 uppercase text-[11px]">
                              {order.courierConsignment.provider} API
                            </div>
                            <div className="font-mono text-slate-300 text-[11px]">
                              {order.courierConsignment.trackingCode}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              disabled={dispatchLoadingId === order.id}
                              onClick={() => handleDispatch(order.id, 'pathao')}
                              className="px-2.5 py-1 bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600 hover:text-white rounded-lg text-[10px] font-bold transition-all"
                            >
                              Pathao
                            </button>
                            <button
                              disabled={dispatchLoadingId === order.id}
                              onClick={() => handleDispatch(order.id, 'steadfast')}
                              className="px-2.5 py-1 bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600 hover:text-white rounded-lg text-[10px] font-bold transition-all"
                            >
                              Steadfast
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
                            title="Confirm Order"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => printInvoiceHTML(order)}
                          className="p-1.5 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-all"
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setActiveTrackingOrder(order);
                            setActiveModal('tracking');
                          }}
                          className="p-1.5 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-all"
                          title="View Tracking Timeline"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500">
                      No orders match your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
