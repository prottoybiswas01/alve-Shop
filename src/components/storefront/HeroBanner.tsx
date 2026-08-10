import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { products, setSelectedProduct, setActiveModal } = useApp();
  const featuredProducts = products.filter((p) => p.featured);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  if (featuredProducts.length === 0) return null;

  const current = featuredProducts[currentIndex];

  return (
    <div className="relative overflow-hidden bg-slate-900 border-b border-slate-800 my-4 rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Background Gradient Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Text Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Flagship Electronics 2026
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Truck className="w-3.5 h-3.5" /> Pathao & Steadfast Express Dispatch
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            {current.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 line-clamp-3 max-w-2xl font-normal leading-relaxed">
            {current.shortDescription}
          </p>

          {/* Pricing & CTA */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-2">
                ৳{current.price.toLocaleString('en-BD')}
                {current.originalPrice && (
                  <span className="text-sm font-medium text-slate-500 line-through">
                    ৳{current.originalPrice.toLocaleString('en-BD')}
                  </span>
                )}
              </div>
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Official Warranty Included
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedProduct(current);
                setActiveModal('product_detail');
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
            >
              <span>Explore Specifications</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slider Dots */}
          <div className="flex items-center gap-2 pt-4">
            {featuredProducts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === idx ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Image Preview */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative group cursor-pointer" onClick={() => {
            setSelectedProduct(current);
            setActiveModal('product_detail');
          }}>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-hidden">
              <img
                src={current.thumbnail}
                alt={current.name}
                className="w-full h-64 sm:h-80 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-6 right-6 bg-slate-900/90 backdrop-blur border border-slate-700 px-3 py-1 rounded-full text-xs font-bold text-blue-400">
                {current.category.toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
