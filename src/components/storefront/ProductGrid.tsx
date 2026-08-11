import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { ShieldCheck, Truck, CreditCard, RefreshCw, Headphones, Flame, ArrowRight, X } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useApp();

  const newArrivals = products.filter((p) => p.isNewArrival || p.featured).slice(0, 4);
  const flashDeals = products.slice(0, 4);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* Category or Search active state view */}
      {selectedCategory !== 'all' || searchQuery ? (
        <section className="auramart-container pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <span>
                {selectedCategory !== 'all' ? selectedCategory : 'Search Results'}
              </span>
              <span className="text-xs bg-orange-100 text-[#FF5500] font-bold px-2.5 py-0.5 rounded-full">
                {filteredProducts.length} items
              </span>
            </h2>
            <button
              onClick={clearFilters}
              className="text-xs font-bold text-[#FF5500] hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center my-6">
              <h3 className="text-base font-bold text-slate-800 mb-1">No products found</h3>
              <p className="text-xs text-slate-500 mb-4">Try clearing your filters or searching for something else.</p>
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 rounded-xl bg-[#FF5500] text-white font-bold text-xs"
              >
                View All Products
              </button>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Section 1: New Arrivals */}
          <section className="auramart-container">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <span>New Arrivals</span>
              </h2>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-[#FF5500] hover:underline flex items-center gap-1"
              >
                <span>View all items</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Section 2: Trust & Seller Stats Banner */}
          <section className="auramart-container">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
              <div className="col-span-2 sm:col-span-1 flex items-center gap-2 text-xs font-bold text-slate-800">
                <div className="p-2 rounded-xl bg-orange-50 text-[#FF5500]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-slate-900 font-extrabold text-xs">Verified Quality</div>
                  <div className="text-[10px] text-slate-500 font-normal">Official Brand Warranty</div>
                </div>
              </div>

              <div className="text-center border-l border-slate-100 py-1">
                <div className="text-base sm:text-lg font-black text-[#FF5500]">3k+</div>
                <div className="text-[10px] text-slate-500 font-medium">Verified Sellers</div>
              </div>

              <div className="text-center border-l border-slate-100 py-1">
                <div className="text-base sm:text-lg font-black text-emerald-600">50k+</div>
                <div className="text-[10px] text-slate-500 font-medium">Happy Buyers</div>
              </div>

              <div className="text-center border-l border-slate-100 py-1">
                <div className="text-base sm:text-lg font-black text-amber-500">10k+</div>
                <div className="text-[10px] text-slate-500 font-medium">Active Products</div>
              </div>

              <div className="text-center border-l border-slate-100 py-1">
                <div className="text-base sm:text-lg font-black text-rose-500">45k+</div>
                <div className="text-[10px] text-slate-500 font-medium">Orders Delivered</div>
              </div>
            </div>
          </section>

          {/* Section 3: Flash Deals */}
          <section className="auramart-container">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#FF5500] fill-[#FF5500]" />
                <span>Flash Deals</span>
              </h2>
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-[#FF5500] hover:underline flex items-center gap-1"
              >
                <span>View All Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
              {flashDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Section 4: 4 Value Proposition Cards */}
          <section className="auramart-container">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                <div className="p-3 rounded-xl bg-orange-50 text-[#FF5500]">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Fast Shipping</div>
                  <div className="text-[10px] text-slate-500 font-medium">Express delivery inside Dhaka</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Cash on Delivery</div>
                  <div className="text-[10px] text-slate-500 font-medium">Pay doorstep nationwide</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Easy Returns</div>
                  <div className="text-[10px] text-slate-500 font-medium">7 days replacement policy</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">24/7 Customer Care</div>
                  <div className="text-[10px] text-slate-500 font-medium">Dedicated support team</div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Seller Center Dark Promo Callout Banner */}
          <section className="auramart-container">
            <div className="bg-[#181818] rounded-2xl p-5 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[10px] font-black tracking-widest text-[#FF5500] uppercase">
                  SELLER CENTER
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">Sell on AuraMart</h3>
                <p className="text-xs text-slate-400 max-w-xl">
                  Grow your business and showcase your products to thousands of customers by registering as a merchant store.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert('Merchant registration is open! Contact support to apply.')}
                  className="px-6 py-3 rounded-xl bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all"
                >
                  Start Selling
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
