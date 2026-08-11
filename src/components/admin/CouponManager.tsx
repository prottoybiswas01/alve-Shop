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
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 text-[#FF5500] font-bold text-xs uppercase tracking-wider mb-1">
            <Tag className="w-4 h-4" /> Promotional Vouchers
          </div>
          <h2 className="text-xl font-black text-slate-900">Coupon Code Manager</h2>
          <p className="text-xs text-slate-500">
            Create promo codes for store customers to apply at checkout for instant discounts.
          </p>
        </div>
      </div>

      {/* Add Coupon Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 p-6 rounded-2xl space-y-4 shadow-2xs">
        <div className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Create New Discount Coupon Code
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Coupon Code *</label>
            <input
              type="text"
              required
              placeholder="e.g. ALVE500"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono font-bold uppercase focus:outline-none focus:border-[#FF5500]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Discount Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#FF5500]"
            >
              <option value="fixed">Fixed Amount (৳ Discount)</option>
              <option value="percentage">Percentage (% OFF)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              {type === 'fixed' ? 'Discount Amount (৳) *' : 'Discount Percentage (%) *'}
            </label>
            <input
              type="number"
              required
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#FF5500]"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Min Order Amount (৳)</label>
            <input
              type="number"
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#FF5500]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> Add Coupon Code
          </button>
        </div>
      </form>

      {/* Coupons Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#FAF5EE] text-slate-700 border-b border-slate-200 uppercase font-bold">
              <th className="p-4">Coupon Code</th>
              <th className="p-4">Discount Rate</th>
              <th className="p-4">Min Spend Required</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-orange-50/30">
                <td className="p-4 font-mono font-bold text-[#FF5500] text-sm">{c.code}</td>
                <td className="p-4 font-bold text-slate-900">
                  {c.type === 'fixed' ? `৳${c.discountValue.toLocaleString('en-BD')} FLAT OFF` : `${c.discountValue}% OFF`}
                </td>
                <td className="p-4 text-slate-700">৳{(c.minOrderAmount || 0).toLocaleString('en-BD')}</td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => toggleCouponActive(c.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                      c.active
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-100 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {c.active ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {c.active ? 'Active' : 'Disabled'}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => deleteCoupon(c.id)}
                    className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition-all border border-rose-200"
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
