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
    <div className="min-h-screen bg-[#FAF7F5] text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
      {/* Executive Header Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#FF5500] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  Aura<span className="text-[#FF5500]">Mart</span> Executive Admin Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Store Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time Analytics, Catalog Manager, Order Dispatch & Courier Logistics Integration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveModal('pos')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
            >
              <Store className="w-4 h-4 text-orange-400" />
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
                ? 'bg-[#FF5500] text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Overview Analytics
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'products'
                ? 'bg-[#FF5500] text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" /> Product Catalog ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'orders'
                ? 'bg-[#FF5500] text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Orders & Fulfillment ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'coupons'
                ? 'bg-[#FF5500] text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
            }`}
          >
            <Tag className="w-4 h-4" /> Coupons & Vouchers ({coupons.length})
          </button>

          <button
            onClick={() => setActiveTab('courier')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'courier'
                ? 'bg-[#FF5500] text-white shadow-md shadow-orange-500/20'
                : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
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
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#FF5500] flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold">Total Revenue</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">৳{totalRevenue.toLocaleString('en-BD')}</div>
                  <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" /> Live Production Metrics
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold">Total Orders</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">{orders.length}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Online + Store POS</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold">Pending Verification</div>
                  <div className="text-2xl font-black text-amber-600 mt-0.5">{pendingOrders}</div>
                  <div className="text-[10px] text-amber-600 font-semibold mt-0.5">Fulfillment Queue</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-semibold">Registered Accounts</div>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">{users.length} Users</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Store Merchants</div>
                </div>
              </div>
            </div>

            {/* Courier API Dispatches Counter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 font-black flex items-center justify-center text-xs">
                    PTH
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">Pathao Courier Dispatches</div>
                    <div className="text-xs text-slate-500">Automated Pathao API Endpoint</div>
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{pathaoOrdersCount} Dispatches</div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-black flex items-center justify-center text-xs">
                    STF
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">Steadfast Courier Dispatches</div>
                    <div className="text-xs text-slate-500">Steadfast Merchant API</div>
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{steadfastOrdersCount} Dispatches</div>
              </div>
            </div>

            {/* Recent Orders Log Table / Clean Empty State */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Recent Sales & Orders</h3>
                {orders.length > 0 && (
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#FF5500] hover:underline font-bold flex items-center gap-1"
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
                      <tr className="bg-[#FAF5EE] text-slate-700 border-b border-slate-200 uppercase font-bold">
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Payment</th>
                        <th className="p-3 text-right">Total Payable</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 6).map((o) => (
                        <tr key={o.id} className="hover:bg-orange-50/30 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-900">{o.id}</td>
                          <td className="p-3">
                            <div className="font-bold text-slate-800">{o.customerName}</div>
                            <div className="text-slate-500 text-[10px]">{o.customerPhone}</div>
                          </td>
                          <td className="p-3 capitalize text-slate-600">
                            {o.paymentMethod} ({o.paymentStatus})
                          </td>
                          <td className="p-3 text-right font-black text-[#FF5500]">
                            ৳{o.totalAmount.toLocaleString('en-BD')}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                o.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : o.status === 'pending'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-blue-100 text-blue-700'
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
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center my-4">
                  <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Inbox className="w-7 h-7 text-[#FF5500]" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">No Orders Recorded Yet</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                    Your production system starts completely clean. Orders placed by customers on the storefront or through the POS counter will appear here in real-time.
                  </p>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="px-4 py-2 bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-1.5"
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
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Order ID, Customer Name, Phone Number..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none w-full"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold uppercase text-[11px] transition-all ${
                      orderStatusFilter === st
                        ? 'bg-[#FF5500] text-white shadow-xs'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List / Clean Empty State */}
            {filteredOrders.length > 0 ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#FAF5EE] text-slate-700 border-b border-slate-200 uppercase tracking-wider font-bold">
                        <th className="p-4">Order ID & Date</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Delivery Address</th>
                        <th className="p-4 text-right">Total Amount</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4">Courier Consignment</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-orange-50/30 transition-colors">
                          <td className="p-4 font-mono">
                            <div className="font-bold text-slate-900 text-sm">{order.id}</div>
                            <div className="text-slate-500 text-[11px]">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="font-bold text-slate-800">{order.customerName}</div>
                            <div className="text-slate-500 font-mono text-[11px]">{order.customerPhone}</div>
                          </td>

                          <td className="p-4 max-w-xs">
                            <div className="text-slate-700 truncate">{order.shippingAddress.fullAddress}</div>
                            <div className="text-slate-500 text-[11px]">
                              {order.shippingAddress.cityZone}, {order.shippingAddress.district}
                            </div>
                          </td>

                          <td className="p-4 text-right">
                            <div className="font-black text-[#FF5500] text-sm">৳{order.totalAmount.toLocaleString('en-BD')}</div>
                          </td>

                          <td className="p-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : order.status === 'pending'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {order.status}
                            </span>
                          </td>

                          <td className="p-4">
                            {order.courierConsignment ? (
                              <div>
                                <div className="font-bold text-blue-600 uppercase text-[11px]">
                                  {order.courierConsignment.provider} API
                                </div>
                                <div className="font-mono text-slate-600 text-[11px]">
                                  {order.courierConsignment.trackingCode}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <button
                                  disabled={dispatchLoadingId === order.id}
                                  onClick={() => handleDispatch(order.id, 'pathao')}
                                  className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white rounded-lg text-[10px] font-bold transition-all"
                                >
                                  Pathao
                                </button>
                                <button
                                  disabled={dispatchLoadingId === order.id}
                                  onClick={() => handleDispatch(order.id, 'steadfast')}
                                  className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-600 hover:text-white rounded-lg text-[10px] font-bold transition-all"
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
                              className="p-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-200 transition-all"
                              title="Print Invoice"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                setActiveTrackingOrder(order);
                                setActiveModal('tracking');
                              }}
                              className="p-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-200 transition-all"
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
              <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-2xs">
                <div className="w-16 h-16 bg-slate-50 border border-slate-200 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-[#FF5500]" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">No Orders Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  Customer orders will automatically appear here once checkout orders are placed online or via the POS counter.
                </p>
                <button
                  onClick={() => setActiveModal('pos')}
                  className="px-5 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs transition-all shadow-md"
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
