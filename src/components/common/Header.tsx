import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  ShoppingBag,
  Heart,
  Zap,
  X,
  Menu,
  User as UserIcon,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cartCount,
    cartTotal,
    wishlist,
    currentUser,
    setActiveModal,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    products,
    setSelectedProduct,
  } = useApp();

  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: 'all', name: 'All Electronics' },
    { id: 'laptops', name: 'Laptops & Mac' },
    { id: 'smartphones', name: 'Smartphones' },
    { id: 'smartwatches', name: 'Smartwatches' },
    { id: 'audio', name: 'Audio & Sound' },
    { id: 'gaming', name: 'Gaming Consoles' },
    { id: 'components', name: 'PC Components' },
  ];

  // Search Results preview
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <header className="bg-slate-950/95 border-b border-slate-800 text-slate-100 sticky top-0 z-40 backdrop-blur-md">
      {/* Top E-Commerce Announcement Ticker */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-slate-800/80 px-4 py-1.5 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-400 font-bold">
              <Truck className="w-3.5 h-3.5" />
              <span>Express Delivery in Dhaka (Pathao & Steadfast)</span>
            </span>
            <span className="hidden md:inline-block text-slate-700">|</span>
            <span className="hidden md:flex items-center gap-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine Official Warranty
            </span>
          </div>

          <div className="flex items-center gap-4 font-medium text-slate-400">
            <span className="hidden sm:inline-block text-amber-400 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Cash on Delivery Available Nationwide
            </span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-bold text-slate-200 uppercase">
              BDT (৳)
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 sm:gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 md:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all">
              <Zap className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                <span>Alve</span>
                <span className="text-blue-500">Shop</span>
              </div>
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold -mt-1">
                Flagship Electronics
              </div>
            </div>
          </a>
        </div>

        {/* Global Search Bar (Daraz & Amazon Style) */}
        <div className="relative flex-1 max-w-2xl hidden md:block">
          <div
            className={`flex items-center bg-slate-900 border rounded-2xl overflow-hidden transition-all ${
              searchFocused
                ? 'border-blue-500 shadow-lg shadow-blue-500/10 bg-slate-900'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="pl-4 pr-2 text-slate-400">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              placeholder="Search laptops, smartphones, headphones, gaming accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full py-2.5 px-2 bg-transparent text-slate-100 text-xs placeholder-slate-500 focus:outline-none"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-white mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1 transition-all">
              <span>Search</span>
            </button>
          </div>

          {/* Search Results Dropdown Preview */}
          {searchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
              {searchResults.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setSelectedProduct(prod);
                    setActiveModal('product_detail');
                    setSearchFocused(false);
                  }}
                  className="p-3 flex items-center gap-3 hover:bg-slate-800/60 cursor-pointer transition-colors"
                >
                  <img
                    src={prod.thumbnail}
                    alt={prod.name}
                    className="w-10 h-10 object-cover rounded-lg bg-slate-950"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{prod.name}</div>
                    <div className="text-[10px] text-blue-400 font-semibold">{prod.brand}</div>
                  </div>
                  <div className="text-xs font-black text-white">
                    ৳{prod.price.toLocaleString('en-BD')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Wishlist */}
          <button
            onClick={() => {
              if (wishlist.length === 0) {
                alert('Your Wishlist is currently empty! Click the heart icon on any product to save items.');
              }
            }}
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all hidden sm:flex items-center gap-2"
            title="Wishlist"
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-slate-950">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setActiveModal('cart')}
            className="relative p-2.5 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-[10px] text-blue-200 uppercase font-semibold">My Cart</div>
              <div className="font-black text-xs leading-none">৳{cartTotal.toLocaleString('en-BD')}</div>
            </div>
          </button>

          {/* User Account Button (Daraz Style Customer Portal) */}
          {currentUser ? (
            <button
              onClick={() => setActiveModal('user_profile')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all text-xs"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center text-xs shadow">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-white font-bold text-xs line-clamp-1">{currentUser.name}</div>
                <div className="text-[10px] text-purple-400 font-semibold uppercase">My Account</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>
          ) : (
            <button
              onClick={() => setActiveModal('auth')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white font-bold text-xs transition-all"
            >
              <UserIcon className="w-4 h-4 text-blue-400" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Navigation Pills Bar */}
      <div className="bg-slate-900/80 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
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
