import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ShieldCheck, Sparkles, Flame, Clock, Zap, CheckCircle2 } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { products, setSelectedProduct, setActiveModal, addToCart } = useApp();
  const featuredProducts = products.filter((p) => p.featured || p.discountPercentage);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Flash Sale Countdown Timer (Simulated)
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 24, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    const sliderTimer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(sliderTimer);
  }, [featuredProducts.length]);

  if (products.length === 0) return null;

  const current = featuredProducts[currentIndex] || products[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Flagship Slider Carousel (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between shadow-2xl">
          {/* Background Orbs */}
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Tag Badges */}
          <div className="relative flex flex-wrap items-center gap-2 mb-6 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Flagship Electronics 2026
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Warranty & Cash on Delivery
            </span>
          </div>

          {/* Main Hero Content & Image Grid */}
          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-6 items-center z-10">
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                {current.brand} Official
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {current.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                {current.shortDescription}
              </p>

              {/* Price & Action */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-2">
                    ৳{current.price.toLocaleString('en-BD')}
                    {current.originalPrice && current.originalPrice > current.price && (
                      <span className="text-sm font-semibold text-slate-500 line-through">
                        ৳{current.originalPrice.toLocaleString('en-BD')}
                      </span>
                    )}
                  </div>
                  {current.discountPercentage && (
                    <span className="text-xs text-rose-400 font-bold">
                      Save {current.discountPercentage}% OFF Today
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      addToCart(current, 1);
                      setActiveModal('checkout');
                    }}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-xl shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Buy Now</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProduct(current);
                      setActiveModal('product_detail');
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Image */}
            <div className="md:col-span-5 flex justify-center">
              <div
                onClick={() => {
                  setSelectedProduct(current);
                  setActiveModal('product_detail');
                }}
                className="relative group cursor-pointer"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-hidden">
                  <img
                    src={current.thumbnail}
                    alt={current.name}
                    className="w-full h-48 sm:h-56 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-blue-400">
                    {current.category.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Navigation Dots */}
          <div className="relative flex items-center gap-2 pt-6 z-10">
            {featuredProducts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentIndex === idx ? 'w-8 bg-blue-500' : 'w-2 bg-slate-800 hover:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Flash Deals / Super Offer (4 cols) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-rose-400 font-black text-sm uppercase tracking-wider">
                <Flame className="w-5 h-5 fill-rose-500 animate-pulse" /> Flash Sale Deals
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                Limited Stock
              </span>
            </div>

            {/* Countdown Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-400" /> Ends In:
              </span>
              <div className="flex items-center gap-1 font-mono font-bold text-white text-sm">
                <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">{String(timeLeft.hours).padStart(2, '0')}h</span>
                <span>:</span>
                <span className="bg-slate-900 px-2 py-1 rounded border border-slate-800">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                <span>:</span>
                <span className="bg-rose-600 text-white px-2 py-1 rounded shadow">{String(timeLeft.seconds).padStart(2, '0')}s</span>
              </div>
            </div>

            {/* Featured Flash Item Card */}
            {current && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={current.thumbnail} alt="" className="w-16 h-16 object-cover rounded-xl bg-slate-900 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white line-clamp-2">{current.name}</h4>
                    <div className="text-xs font-black text-rose-400 mt-1">
                      ৳{current.price.toLocaleString('en-BD')}
                    </div>
                  </div>
                </div>

                {/* Stock Meter */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-slate-400">Claimed Progress</span>
                    <span className="text-rose-400">82% Sold Out</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-full w-[82%] rounded-full" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (current) {
                addToCart(current, 1);
                setActiveModal('checkout');
              }
            }}
            className="w-full mt-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Claim Flash Deal Now</span>
          </button>
        </div>
      </div>

      {/* Trust & Guarantee Banner Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">100% Genuine</div>
            <div className="text-[10px] text-slate-400">Official Brand Warranty</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Cash on Delivery</div>
            <div className="text-[10px] text-slate-400">Pay Doorstep Nationwide</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Express Logistics</div>
            <div className="text-[10px] text-slate-400">Pathao & Steadfast</div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">24/7 Dedicated Care</div>
            <div className="text-[10px] text-slate-400">Customer Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};
