import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductManager } from './ProductManager';
import { CourierSettingsManager } from './CourierSettingsManager';
import {
  Shield,
  BarChart3,
  Package,
  Truck,
  Store,
  DollarSign,
  TrendingUp,
  Layers,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { orders, products, setActiveModal } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'courier'>('overview');

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pathaoOrdersCount = orders.filter((o) => o.courierConsignment?.provider === 'pathao').length;
  const steadfastOrdersCount = orders.filter((o) => o.courierConsignment?.provider === 'steadfast').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" /> Store Executive Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Alve Shop Electronics Admin Panel</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time sales analytics, multi-image product CRUD, Pathao & Steadfast merchant settings, and POS counter.
          </p>
        </div>

        <button
          onClick={() => setActiveModal('pos')}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-500/20 transition-all"
        >
          <Store className="w-4 h-4" /> Open Physical POS Counter
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Overview Analytics
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'products'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" /> Product Manager ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('courier')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'courier'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" /> Pathao & Steadfast Settings
        </button>
      </div>

      {/* Tab 1: Overview Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key KPI Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Revenue */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Total Store Revenue</div>
                <div className="text-2xl font-black text-white">৳{totalRevenue.toLocaleString('en-BD')}</div>
                <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" /> +18.4% from last month
                </div>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Total Orders Executed</div>
                <div className="text-2xl font-black text-white">{orders.length}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Online + Offline POS sales</div>
              </div>
            </div>

            {/* Pathao Dispatches */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Pathao Dispatches</div>
                <div className="text-2xl font-black text-white">{pathaoOrdersCount}</div>
                <div className="text-[10px] text-rose-400 font-semibold mt-0.5">Pathao Hermes API</div>
              </div>
            </div>

            {/* Steadfast Dispatches */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-medium">Steadfast Dispatches</div>
                <div className="text-2xl font-black text-white">{steadfastOrdersCount}</div>
                <div className="text-[10px] text-amber-400 font-semibold mt-0.5">Steadfast API Portal</div>
              </div>
            </div>
          </div>

          {/* Recent Sales Activity Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-black text-white">Recent Sales Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-bold">
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Channel</th>
                    <th className="p-3 text-right">Total</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {orders.slice(0, 5).map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold text-white">{o.id}</td>
                      <td className="p-3 text-slate-300">{o.customerName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          o.channel === 'offline_pos' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {o.channel}
                        </span>
                      </td>
                      <td className="p-3 text-right font-black text-white">৳{o.totalAmount.toLocaleString('en-BD')}</td>
                      <td className="p-3 text-center uppercase font-bold text-emerald-400 text-[10px]">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Product Manager */}
      {activeTab === 'products' && <ProductManager />}

      {/* Tab 3: Courier Settings */}
      {activeTab === 'courier' && <CourierSettingsManager />}
    </div>
  );
};
