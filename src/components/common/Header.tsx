import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  ShoppingBag,
  Heart,
  Truck,
  Zap,
  X,
  Sparkles,
  PhoneCall,
  Menu,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cartCount,
    wishlist,
    setActiveModal,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    products,
    setSelectedProduct,
    orders,
    setActiveTrackingOrder,
  } = useApp();

  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trackingIdInput, setTrackingIdInput] = useState('');

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'laptops', name: 'Laptops & Mac' },
    { id: 'smartphones', name: 'Smartphones' },
    { id: 'smartwatches', name: 'Smartwatches' },
    { id: 'audio', name: 'Audio & Sound' },
    { id: 'gaming', name: 'Gaming Consoles' },
    { id: 'components', name: 'PC Components' },
  ];

  // Search auto-suggestions
  const filteredSuggestions = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingIdInput.trim()) return;
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === trackingIdInput.trim().toLowerCase() ||
        o.courierConsignment?.trackingCode.toLowerCase() === trackingIdInput.trim().toLowerCase()
    );

    if (found) {
      setActiveTrackingOrder(found);
      setActiveModal('tracking');
    } else {
      alert(`No order found matching ID or Tracking Code: "${trackingIdInput}"`);
    }
  };

  return (
    <header className="bg-slate-950 border-b border-slate-800 text-slate-100 sticky top-[37px] z-40">
      {/* Top Hotline Bar */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-400 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-blue-400 font-medium">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Sales Hotline: +880 1700-000000</span>
          </span>
          <span className="hidden md:inline-block text-slate-600">|</span>
          <span className="hidden md:inline-block text-emerald-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Same Day Delivery in Dhaka Available
          </span>
        </div>

        {/* Quick Order Tracking Search */}
        <form onSubmit={handleQuickTrack} className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-md px-2 py-0.5">
          <Truck className="w-3 h-3 text-slate-400" />
          <input
            type="text"
            placeholder="Track Order (e.g. ALV-98401)..."
            value={trackingIdInput}
            onChange={(e) => setTrackingIdInput(e.target.value)}
            className="bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-36 sm:w-48"
          />
          <button type="submit" className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-0.5 rounded font-bold transition-all">
            Track
          </button>
        </form>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Menu className="w-6 h-6" />
          </button>

          <a href="#" onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }} className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                ALVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">SHOP</span>
              </div>
              <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-1">
                Electronics & Gadgets
              </div>
            </div>
          </a>
        </div>

        {/* Realtime Search Bar */}
        <div className="flex-1 max-w-2xl relative hidden md:block">
          <div className={`relative flex items-center bg-slate-900 border rounded-xl overflow-hidden transition-all ${
            searchFocused ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-slate-800'
          }`}>
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search laptops, smartphones, headphones, gaming gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full px-3 py-2.5 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="pr-3 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Auto Suggestions Popup */}
          {searchFocused && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-2 text-xs font-semibold text-slate-400 bg-slate-950/60 border-b border-slate-800">
                Matching Electronics ({filteredSuggestions.length})
              </div>
              {filteredSuggestions.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setActiveModal('product_detail');
                    setSearchQuery('');
                  }}
                  className="flex items-center gap-3 p-2.5 hover:bg-slate-800/80 cursor-pointer border-b border-slate-800/40 last:border-none transition-all"
                >
                  <img src={product.thumbnail} alt={product.name} className="w-10 h-10 object-cover rounded-md bg-slate-950" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-200 truncate">{product.name}</div>
                    <div className="text-[11px] text-blue-400 font-bold">৳{product.price.toLocaleString('en-BD')}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-bold">
                    {product.brand}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Wishlist */}
          <button
            onClick={() => alert(`You have ${wishlist.length} item(s) in your wishlist.`)}
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-rose-400 hover:border-slate-700 transition-all hidden sm:flex items-center justify-center"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Toggle */}
          <button
            onClick={() => setActiveModal('cart')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-semibold text-sm">Cart</span>
          </button>
        </div>
      </div>

      {/* Category Navigation Pills Bar */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 py-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
