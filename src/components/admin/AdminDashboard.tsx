import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductManager } from './ProductManager';
import { CourierSettingsManager } from './CourierSettingsManager';
import { CouponManager } from './CouponManager';
import { SalesAnalyticsChart } from './SalesAnalyticsChart';
import { printInvoiceHTML } from '../../services/invoiceService';
import {
  Shield,
  BarChart3,
  Package,
  Truck,
  Store,
  DollarSign,
  TrendingUp,
  Layers,
  ShoppingBag,
  Clock,
  Printer,
  Eye,
  CheckCircle2,
  Users,
  Search,
  Tag,
  Inbox,
  ArrowRight,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    orders,
    products,
    users,
    coupons,
    setActiveModal,
    updateOrderStatus,
    dispatchOrderToCourier,
    setActiveTrackingOrder,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons' | 'courier'>('overview');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [dispatchLoadingId, setDispatchLoadingId] = useState<string | null>(null);

  // Key KPI Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const pathaoOrdersCount = orders.filter((o) => o.courierConsignment?.provider === 'pathao').length;
  const steadfastOrdersCount = orders.filter((o) => o.courierConsignment?.provider === 'steadfast').length;

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch =
      !orderSearch.trim() ||
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  const handleDispatch = async (orderId: string, provider: 'pathao' | 'steadfast') => {
    setDispatchLoadingId(orderId);
    await dispatchOrderToCourier(orderId, provider);
    setDispatchLoadingId(null);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans selection:bg-purple-600 selection:text-white">
      {/* Executive Header Bar */}
      <header className="bg-[#111622]/90 border-b border-slate-800/80 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 border border-purple-400/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight">Admin Executive Control Hub</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Production System
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time Analytics, Product Catalog Manager, Order Dispatch & Logistics Integration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveModal('pos')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Store className="w-4 h-4" />
              <span>Open POS Counter</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Pill Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Overview Analytics
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'products'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Package className="w-4 h-4" /> Product Catalog ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'orders'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Orders & Fulfillment ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'coupons'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Tag className="w-4 h-4" /> Coupons & Vouchers ({coupons.length})
          </button>

          <button
            onClick={() => setActiveTab('courier')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'courier'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Truck className="w-4 h-4" /> Courier API Settings
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* TAB 1: OVERVIEW ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <SalesAnalyticsChart orders={orders} />

            {/* Executive KPI Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#111622] border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Total Store Revenue</div>
                  <div className="text-2xl font-black text-white mt-0.5">৳{totalRevenue.toLocaleString('en-BD')}</div>
                  <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> Live Production Metrics
                  </div>
                </div>
              </div>

              <div className="bg-[#111622] border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Total Orders</div>
                  <div className="text-2xl font-black text-white mt-0.5">{orders.length}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Online + Store POS</div>
                </div>
              </div>

              <div className="bg-[#111622] border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Pending Verification</div>
                  <div className="text-2xl font-black text-amber-400 mt-0.5">{pendingOrders}</div>
                  <div className="text-[10px] text-amber-400 font-semibold mt-0.5">Fulfillment Queue</div>
                </div>
              </div>

              <div className="bg-[#111622] border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 shadow-xl">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-semibold">Registered Accounts</div>
                  <div className="text-2xl font-black text-white mt-0.5">{users.length} Users</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Store Merchants</div>
                </div>
              </div>
            </div>

            {/* Courier API Dispatches Counter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#111622] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-black flex items-center justify-center text-xs">
                    PTH
                  </div>
                  <div>
                    <div className="font-bold text-slate-200 text-sm">Pathao Courier Dispatches</div>
                    <div className="text-xs text-slate-400">Automated Pathao API Endpoint</div>
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{pathaoOrdersCount} Dispatches</div>
              </div>

              <div className="bg-[#111622] border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black flex items-center justify-center text-xs">
                    STF
                  </div>
                  <div>
                    <div className="font-bold text-slate-200 text-sm">Steadfast Courier Dispatches</div>
                    <div className="text-xs text-slate-400">Steadfast Merchant API</div>
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{steadfastOrdersCount} Dispatches</div>
              </div>
            </div>

            {/* Recent Orders Log Table / Clean Empty State */}
            <div className="bg-[#111622] border border-slate-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white">Recent Sales & Orders</h3>
                {orders.length > 0 && (
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                  >
                    <span>View All Orders</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#090D16] text-slate-400 border-b border-slate-800 uppercase font-bold">
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3 text-right">Total Payable</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {orders.slice(0, 6).map((o) => (
                        <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 font-mono font-bold text-white">{o.id}</td>
                          <td className="p-3">
                            <div className="font-bold text-slate-200">{o.customerName}</div>
                            <div className="text-slate-500 text-[10px]">{o.customerPhone}</div>
                          </td>
                          <td className="p-3 capitalize text-slate-300">
                            {o.paymentMethod} ({o.paymentStatus})
                          </td>
                          <td className="p-3 text-right font-black text-white">
                            ৳{o.totalAmount.toLocaleString('en-BD')}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                o.status === 'delivered'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : o.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-blue-500/20 text-blue-400'
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-[#0B0F17] border border-slate-800/80 rounded-2xl p-10 text-center my-4">
                  <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-500">
                    <Inbox className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">No Orders Recorded Yet</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                    Your production system starts completely clean. Orders placed by customers on the storefront or through the POS counter will appear here in real-time.
                  </p>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/20 transition-all inline-flex items-center gap-1.5"
                  >
                    <Package className="w-4 h-4" />
                    <span>Manage Product Catalog</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGER */}
        {activeTab === 'products' && <ProductManager />}

        {/* TAB 3: ORDERS & FULFILLMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Search & Filter Header */}
            <div className="bg-[#111622] border border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-2 bg-[#0B0F17] border border-slate-800 rounded-xl px-3.5 py-2 text-xs flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Order ID, Customer Name, Phone Number..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] transition-all ${
                      orderStatusFilter === st
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-[#0B0F17] text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List / Clean Empty State */}
            {filteredOrders.length > 0 ? (
              <div className="bg-[#111622] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#090D16] text-slate-400 border-b border-slate-800 uppercase tracking-wider font-bold">
                        <th className="p-4">Order ID & Date</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Delivery Address</th>
                        <th className="p-4 text-right">Total Amount</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4">Courier Consignment</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 font-mono">
                            <div className="font-bold text-white text-sm">{order.id}</div>
                            <div className="text-slate-500 text-[11px]">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="font-bold text-slate-200">{order.customerName}</div>
                            <div className="text-slate-400 font-mono text-[11px]">{order.customerPhone}</div>
                          </td>

                          <td className="p-4 max-w-xs">
                            <div className="text-slate-300 truncate">{order.shippingAddress.fullAddress}</div>
                            <div className="text-slate-500 text-[11px]">
                              {order.shippingAddress.cityZone}, {order.shippingAddress.district}
                            </div>
                          </td>

                          <td className="p-4 text-right">
                            <div className="font-black text-white text-sm">৳{order.totalAmount.toLocaleString('en-BD')}</div>
                          </td>

                          <td className="p-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : order.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-blue-500/20 text-blue-400'
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-[#111622] border border-slate-800/80 rounded-2xl p-12 text-center shadow-xl">
                <div className="w-16 h-16 bg-slate-900 border border-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">No Orders Found</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
                  Customer orders will automatically appear here once checkout orders are placed online or via the POS counter.
                </p>
                <button
                  onClick={() => setActiveModal('pos')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20"
                >
                  Launch In-Store POS Counter
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: COUPONS & VOUCHERS */}
        {activeTab === 'coupons' && <CouponManager />}

        {/* TAB 5: COURIER API SETTINGS */}
        {activeTab === 'courier' && <CourierSettingsManager />}
      </main>
    </div>
  );
};
