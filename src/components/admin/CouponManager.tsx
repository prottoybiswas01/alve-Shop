import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tag, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export const CouponManager: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon, toggleCouponActive } = useApp();

  const [code, setCode] = useState('');
  const [type, setType] = useState<'fixed' | 'percentage'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(500);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(1000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      type,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount),
      active: true,
    });

    setCode('');
    setDiscountValue(500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111622] border border-slate-800/80 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4" /> Promotional Vouchers
          </div>
          <h2 className="text-xl font-black text-white">Coupon Code Manager</h2>
          <p className="text-xs text-slate-400">
            Create promo codes for store customers to apply at checkout for instant discounts.
          </p>
        </div>
      </div>

      {/* Add Coupon Form */}
      <form onSubmit={handleSubmit} className="bg-[#111622] border border-slate-800/80 p-6 rounded-2xl space-y-4 shadow-xl">
        <div className="text-sm font-bold text-white border-b border-slate-800 pb-2">
          Create New Discount Coupon Code
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Coupon Code *</label>
            <input
              type="text"
              required
              placeholder="e.g. ALVE500"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B0F17] border border-slate-800 rounded-xl text-white font-mono font-bold uppercase focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Discount Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 bg-[#0B0F17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
            >
              <option value="fixed">Fixed Amount (৳ Discount)</option>
              <option value="percentage">Percentage (% OFF)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {type === 'fixed' ? 'Discount Amount (৳) *' : 'Discount Percentage (%) *'}
            </label>
            <input
              type="number"
              required
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#0B0F17] border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Min Order Amount (৳)</label>
            <input
              type="number"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#0B0F17] border border-slate-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Coupon Code
          </button>
        </div>
      </form>

      {/* Coupons Table */}
      <div className="bg-[#111622] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#090D16] text-slate-400 border-b border-slate-800 uppercase font-bold">
              <th className="p-4">Coupon Code</th>
              <th className="p-4">Discount Rate</th>
              <th className="p-4">Min Spend Required</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40">
                <td className="p-4 font-mono font-bold text-purple-400 text-sm">{c.code}</td>
                <td className="p-4 font-bold text-white">
                  {c.type === 'fixed' ? `৳${c.discountValue.toLocaleString('en-BD')} FLAT OFF` : `${c.discountValue}% OFF`}
                </td>
                <td className="p-4 text-slate-300">৳{(c.minOrderAmount || 0).toLocaleString('en-BD')}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleCouponActive(c.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                      c.active
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {c.active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {c.active ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => deleteCoupon(c.id)}
                    className="p-1.5 bg-slate-900 text-rose-400 hover:text-white rounded-lg transition-all border border-slate-800"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
