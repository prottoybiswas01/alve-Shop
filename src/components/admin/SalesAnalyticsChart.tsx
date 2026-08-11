import React, { useState } from 'react';
import type { Order } from '../../types';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Store, Globe } from 'lucide-react';

export const SalesAnalyticsChart: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const [selectedYear, setSelectedYear] = useState('2026');

  // Compute monthly revenue data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const monthlyStats = months.map((month, idx) => {
    const monthOrders = orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d.getMonth() === idx;
    });

    const revenue = monthOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const count = monthOrders.length;

    return { month, revenue, count };
  });

  const maxRevenue = Math.max(...monthlyStats.map((m) => m.revenue), 100000);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const onlineOrders = orders.filter((o) => o.channel === 'online').length;
  const posOrders = orders.filter((o) => o.channel === 'offline_pos').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl relative overflow-hidden shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Gross Sales Revenue</div>
              <div className="text-2xl font-black text-slate-900 mt-1">৳{totalRevenue.toLocaleString('en-BD')}</div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> Real-time Production Metrics
              </div>
            </div>
            <div className="p-3 bg-orange-50 text-[#FF5500] rounded-xl border border-orange-200/60">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl relative overflow-hidden shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Sales Volume</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{orders.length} Orders</div>
              <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-1">
                <ShoppingBag className="w-3.5 h-3.5" /> {deliveredCount} Completed
              </div>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-200/60">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl relative overflow-hidden shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Online Store Orders</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{onlineOrders} Orders</div>
              <div className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1 mt-1">
                <Globe className="w-3.5 h-3.5" /> Web Storefront
              </div>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-200/60">
              <Globe className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl relative overflow-hidden shadow-2xs">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">POS Store Counter</div>
              <div className="text-2xl font-black text-slate-900 mt-1">{posOrders} Walk-ins</div>
              <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <Store className="w-3.5 h-3.5" /> In-Store Retail
              </div>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200/60">
              <Store className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Graph */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#FF5500] font-bold text-xs uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4" /> Financial Performance
            </div>
            <h3 className="text-lg font-black text-slate-900">Monthly Sales Revenue ({selectedYear})</h3>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-800 px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#FF5500] font-bold"
            >
              <option value="2026">Year 2026</option>
              <option value="2025">Year 2025</option>
            </select>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-6 pb-2">
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 border-b border-slate-200 pb-4">
            {monthlyStats.map((item, idx) => {
              const heightPercent = Math.max(8, Math.round((item.revenue / maxRevenue) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20">
                    <div className="font-bold text-[#FF5500]">{item.month} Revenue</div>
                    <div>৳{item.revenue.toLocaleString('en-BD')} ({item.count} orders)</div>
                  </div>

                  {/* Revenue Bar */}
                  <div className="w-full bg-slate-100 rounded-xl h-full flex items-end overflow-hidden p-0.5">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-lg transition-all duration-500 group-hover:brightness-110 ${
                        item.revenue > 0
                          ? 'bg-gradient-to-t from-[#FF5500] to-amber-500 shadow-md'
                          : 'bg-slate-200'
                      }`}
                    />
                  </div>

                  {/* Month Label */}
                  <div className="text-[11px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                    {item.month}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF5500] inline-block" /> Completed Sales
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-200 inline-block" /> Baseline
              </span>
            </div>
            <div>
              Target: <span className="text-slate-900 font-bold">৳{maxRevenue.toLocaleString('en-BD')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
