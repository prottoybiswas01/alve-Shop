import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { printInvoiceHTML } from '../../services/invoiceService';
import { OrderStatus } from '../../types';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Truck,
  Printer,
  Eye,
  XCircle,
  Filter,
  ArrowUpRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ModeratorDashboard: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    dispatchOrderToCourier,
    setActiveInvoiceOrder,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" /> Moderator Fulfillment Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Order Verification & Logistics Dispatch</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Confirm pending orders, auto-generate Pathao or Steadfast courier consignments, and issue customer invoices.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-3 rounded-2xl text-xs">
          <div>
            <div className="text-slate-400">Pending Orders</div>
            <div className="text-xl font-black text-amber-400">
              {orders.filter((o) => o.status === 'pending').length}
            </div>
          </div>
          <div className="w-px h-8 bg-slate-800" />
          <div>
            <div className="text-slate-400">Ready for Courier</div>
            <div className="text-xl font-black text-blue-400">
              {orders.filter((o) => o.status === 'confirmed').length}
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Order ID, Customer Name, Phone, or Tracking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] transition-all ${
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
                <th className="p-4">Customer Details</th>
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
                    {/* ID & Date */}
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
                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div className="font-bold text-slate-200">{order.customerName}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{order.customerPhone}</div>
                      <div className="text-slate-500 text-[10px] uppercase font-bold">{order.paymentMethod} • {order.paymentStatus}</div>
                    </td>

                    {/* Address */}
                    <td className="p-4 max-w-xs">
                      <div className="text-slate-300 truncate">{order.shippingAddress.fullAddress}</div>
                      <div className="text-slate-500 font-semibold text-[11px]">
                        {order.shippingAddress.cityZone}, {order.shippingAddress.district} ({order.shippingAddress.deliveryType === 'inside_dhaka' ? 'Dhaka' : 'Out-Dhaka'})
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-4 text-right">
                      <div className="font-black text-white text-sm">৳{order.totalAmount.toLocaleString('en-BD')}</div>
                      <div className="text-slate-500 text-[10px]">{order.items.length} item(s)</div>
                    </td>

                    {/* Status Pill */}
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

                    {/* Courier Consignment */}
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

                    {/* Actions */}
                    <td className="p-4 text-right space-x-1">
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
    </div>
  );
};
