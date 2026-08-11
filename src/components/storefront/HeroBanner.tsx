import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, ChevronLeft, ArrowRight, Grid } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory, setSelectedProduct, setActiveModal, products } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  const categories = [
    { name: 'Honey & Spices', id: 'Honey & Spices' },
    { name: 'Stationeries', id: 'Stationeries' },
    { name: 'Pickles & Preserves', id: 'Pickles & Preserves' },
    { name: 'Rice & Grains', id: 'Groceries' },
    { name: 'Daily Essentials', id: 'Daily Essentials' },
    { name: 'Audio & Electronics', id: 'Audio & Electronics' },
    { name: 'Beauty & Personal Care', id: 'Beauty' },
  ];

  const slides = [
    {
      id: 'slide-1',
      title: 'মধু',
      subtitle: 'অর্ডার করুন AuraMart Bd থেকে',
      tag: 'Organic',
      bgGradient: 'from-amber-100 via-amber-50 to-orange-100',
      buttonText: 'ORDER NOW',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'slide-2',
      title: 'Excel Speaker Model ES-02',
      subtitle: 'Hi-Fi Stereo Sound & Bass Booster',
      tag: 'Mega Deal',
      bgGradient: 'from-orange-100 via-rose-50 to-amber-100',
      buttonText: 'SHOP NOW',
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const currentSlide = slides[activeSlide];

  return (
    <div className="auramart-container py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Categories Sidebar (3.5 cols on LG) */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-2 border-b border-slate-100 text-slate-800 font-extrabold text-xs uppercase tracking-wider">
              <Grid className="w-4 h-4 text-[#FF5500]" />
              <span>All Categories</span>
            </div>

            <div className="space-y-1">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#FF5500] hover:bg-orange-50/60 rounded-xl transition-all group"
                >
                  <span className="truncate">{cat.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#FF5500] transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setSelectedCategory('all')}
            className="w-full mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-[#FF5500] hover:underline flex items-center justify-between"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Hero Banner Slider (9 cols on LG) */}
        <div className="lg:col-span-9 relative bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-100 border border-amber-200/60 rounded-2xl p-6 sm:p-10 flex flex-col justify-between overflow-hidden shadow-2xs min-h-[340px]">
          {/* Background Decorative Element */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-200/30 to-transparent pointer-events-none" />

          {/* Left Arrow Control */}
          <button
            onClick={() => setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-slate-200 text-slate-700 hover:text-[#FF5500] flex items-center justify-center shadow-md hover:scale-105 transition-all z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Control */}
          <button
            onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border border-slate-200 text-slate-700 hover:text-[#FF5500] flex items-center justify-center shadow-md hover:scale-105 transition-all z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Content Grid */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto">
            <div className="md:col-span-7 space-y-3">
              <span className="inline-block px-3 py-1 bg-amber-200/70 text-amber-900 text-[10px] font-black uppercase rounded-full tracking-wider">
                {currentSlide.tag}
              </span>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
                {currentSlide.title}
              </h1>

              <div className="text-sm sm:text-lg font-bold text-slate-700 flex items-center gap-2">
                <span>{currentSlide.subtitle}</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const matched = products.find((p) => p.name.includes('Honey') || p.name.includes('Excel'));
                    if (matched) {
                      setSelectedProduct(matched);
                      setActiveModal('product_detail');
                    }
                  }}
                  className="px-8 py-3 bg-[#FF5500] hover:bg-[#e04b00] text-white font-black text-xs tracking-wider uppercase rounded-lg shadow-lg shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>{currentSlide.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Hero Image */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative group">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-56 sm:w-64 h-48 sm:h-56 object-cover rounded-2xl shadow-xl border-4 border-white/80 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Bottom Dots Indicator */}
          <div className="relative z-10 flex items-center justify-center gap-2 pt-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  activeSlide === idx ? 'w-6 bg-[#FF5500]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
