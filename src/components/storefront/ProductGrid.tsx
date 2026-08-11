import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { ShieldCheck, Truck, CreditCard, RefreshCw, Headphones, Flame, ArrowRight } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory } = useApp();

  const newArrivals = products.filter((p) => p.isNewArrival || p.featured).slice(0, 4);
  const flashDeals = products.slice(0, 4);
  const displayProducts = selectedCategory === 'all' 
    ? products 
    : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-8 pb-12">
      {/* Category Filter active state view */}
      {selectedCategory !== 'all' ? (
        <section className="auramart-container pt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900">
              Category: <span className="text-[#FF5500]">{selectedCategory}</span>
            </h2>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-[#FF5500] hover:underline"
            >
              Back to All Products
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <>
          {/* Section 1: New Arrivals */}
          <section className="auramart-container">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Section 2: Trust & Seller Stats Banner (From Image 2) */}
          <section className="auramart-container">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
              <div className="col-span-2 sm:col-span-1 flex items-center gap-2 text-xs font-bold text-slate-800">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-slate-900 font-extrabold text-xs">Trusted by Housemarts</div>
                  <div className="text-[10px] text-slate-500 font-normal">Verified by AuraMart</div>
                </div>
              </div>

              <div className="text-center border-l border-slate-100 py-1">
                <div className="text-lg font-black text-[#FF5500]">3k+</div>
                <div className="text-[10px] text-slate-500 font-medium">Verified Sellers</div>
              </div>

              <div className="text-center border-l border-slate-100 py-1">
                <div className="text-lg font-black text-emerald-600">50k+</div>
                <div className="text-[10px] text-slate-500 font-medium">Customers Served</div>
              </div>

              <div className="text-center border-l border-slate-100 py-1">
                <div className="text-lg font-black text-amber-500">10k+</div>
                <div className="text-[10px] text-slate-500 font-medium">Active Listings</div>
              </div>

              <div className="text-center border-l border-slate-100 py-1">
                <div className="text-lg font-black text-rose-500">45k+</div>
                <div className="text-[10px] text-slate-500 font-medium">Deliveries Completed</div>
              </div>
            </div>
          </section>

          {/* Section 3: Flash Deals */}
          <section className="auramart-container">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {flashDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Section 4: 4 Value Proposition Cards */}
          <section className="auramart-container">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                <div className="p-3 rounded-xl bg-orange-50 text-[#FF5500]">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Free Shipping</div>
                  <div className="text-[10px] text-slate-500 font-medium">On order over ৳1500</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Secure Payment</div>
                  <div className="text-[10px] text-slate-500 font-medium">100% secure gateway</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Easy Returns</div>
                  <div className="text-[10px] text-slate-500 font-medium">7 days money back</div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
                <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">24/7 Support</div>
                  <div className="text-[10px] text-slate-500 font-medium">Dedicated helpline</div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Seller Center Dark Promo Callout Banner (From Image 2) */}
          <section className="auramart-container">
            <div className="bg-[#181818] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[10px] font-black tracking-widest text-[#FF5500] uppercase">
                  SELLER CENTER
                </span>
                <h3 className="text-2xl font-black tracking-tight">Sell on AuraMart</h3>
                <p className="text-xs text-slate-400 max-w-xl">
                  Grow your shop products and sell to millions of customers by becoming a verified merchant on AuraMart Bd.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert('Seller Registration Portal opened!')}
                  className="px-6 py-3 rounded-xl bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all"
                >
                  Start Selling
                </button>
                <button
                  onClick={() => alert('Seller Login opened!')}
                  className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
                >
                  Seller Log in
                </button>
              </div>
            </div>
          </section>

          {/* Section 6: Payment Methods Logos Bar (From Image 2) */}
          <section className="auramart-container">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Pay with
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-slate-600">
                <span className="px-2.5 py-1 bg-slate-100 rounded-md text-blue-700 border border-slate-200">VISA</span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-md text-red-600 border border-slate-200">MasterCard</span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-md text-blue-500 border border-slate-200">AMEX</span>
                <span className="px-2.5 py-1 bg-pink-100 text-pink-600 rounded-md border border-pink-200">bKash</span>
                <span className="px-2.5 py-1 bg-orange-100 text-orange-600 rounded-md border border-orange-200">Nagad</span>
                <span className="px-2.5 py-1 bg-[#8B2D88]/10 text-[#8B2D88] rounded-md border border-[#8B2D88]/20">Rocket</span>
                <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-md border border-amber-200">Upay</span>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-md border border-emerald-200">Cellfin</span>
                <span className="px-2.5 py-1 bg-sky-100 text-sky-700 rounded-md border border-sky-200">EPS</span>
                <span className="px-2 py-1 bg-emerald-600 text-white rounded-md text-[10px] font-black">
                  Verified by SSLCommerz
                </span>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};
