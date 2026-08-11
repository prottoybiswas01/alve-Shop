import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  ChevronDown,
  X,
  Menu,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    cartCount,
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
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const categoriesList = [
    { id: 'all', name: 'All Categories' },
    { id: 'Honey & Spices', name: 'Honey & Spices' },
    { id: 'Pickles & Preserves', name: 'Pickles & Preserves' },
    { id: 'Audio & Electronics', name: 'Audio & Electronics' },
    { id: 'Laptops & Computers', name: 'Laptops & Computers' },
    { id: 'Smartphones', name: 'Smartphones' },
    { id: 'Daily Essentials', name: 'Daily Essentials' },
  ];

  const navItems = [
    { label: 'Home', catId: 'all' },
    { label: 'Honey & Spices', catId: 'Honey & Spices' },
    { label: 'Pickles & Preserves', catId: 'Pickles & Preserves' },
    { label: 'Audio & Electronics', catId: 'Audio & Electronics' },
    { label: 'Laptops & Computers', catId: 'Laptops & Computers' },
    { label: 'Smartphones', catId: 'Smartphones' },
    { label: 'Daily Essentials', catId: 'Daily Essentials' },
  ];

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

  const currentCategoryLabel =
    categoriesList.find((c) => c.id === selectedCategory)?.name || 'All Categories';

  return (
    <header className="bg-white border-b border-neutral-200 text-slate-800 sticky top-0 z-40 shadow-xs">
      {/* Main Upper Header */}
      <div className="auramart-container py-3.5 flex items-center justify-between gap-4">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-100 border border-neutral-200 text-slate-700 md:hidden"
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
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FF5500] flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <svg
                className="w-7 h-7 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" />
              </svg>
            </div>
            <div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  Aura<span className="text-[#FF5500]">Mart</span>
                </span>
                <span className="text-[10px] font-bold text-slate-600">®</span>
              </div>
              <div className="text-[10px] text-slate-600 font-semibold tracking-tight -mt-1">
                Shop More, Sell More, Together
              </div>
            </div>
          </a>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-2xl hidden md:block">
          <div
            className={`flex items-center bg-white border rounded-full overflow-hidden transition-all ${
              searchFocused
                ? 'border-[#FF5500] ring-2 ring-orange-500/10 shadow-md'
                : 'border-slate-300 hover:border-slate-400'
            }`}
          >
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search for laptops, smartphones, pickles, honey..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full py-2.5 px-5 bg-transparent text-slate-800 text-xs placeholder-slate-400 focus:outline-none"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 text-slate-400 hover:text-slate-600 mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Category Dropdown Button */}
            <div className="relative border-l border-slate-200">
              <button
                type="button"
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>{currentCategoryLabel}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 text-xs font-semibold">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-orange-50 hover:text-[#FF5500] transition-colors ${
                        selectedCategory === cat.id ? 'text-[#FF5500] font-bold bg-orange-50/50' : 'text-slate-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Orange Search Action Button */}
            <button className="px-6 py-3 bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-xs flex items-center justify-center transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Search Preview Dropdown */}
          {searchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-100">
              {searchResults.map((prod) => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setSelectedProduct(prod);
                    setActiveModal('product_detail');
                    setSearchFocused(false);
                  }}
                  className="p-3 flex items-center gap-3 hover:bg-orange-50/40 cursor-pointer transition-colors"
                >
                  <img
                    src={prod.thumbnail}
                    alt={prod.name}
                    className="w-10 h-10 object-cover rounded-lg bg-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">{prod.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{prod.brand}</div>
                  </div>
                  <div className="text-xs font-black text-[#FF5500]">
                    ৳{prod.price.toLocaleString('en-BD')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Sign In / Account */}
          {currentUser ? (
            <button
              onClick={() => setActiveModal('user_profile')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 text-[#FF5500] font-bold flex items-center justify-center text-xs">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 font-medium">My Account</div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setActiveModal('auth')}
              className="flex items-center gap-2 text-slate-700 hover:text-[#FF5500] font-bold text-xs transition-colors"
            >
              <UserIcon className="w-5 h-5 text-[#FF5500]" />
              <span className="hidden sm:inline">Sign In / My Account</span>
            </button>
          )}

          {/* Wishlist */}
          <button
            onClick={() => {
              if (wishlist.length === 0) {
                alert('Your Wishlist is empty! Click the heart icon on any product to save items.');
              }
            }}
            className="relative flex items-center gap-1.5 text-slate-700 hover:text-[#FF5500] font-bold text-xs transition-colors"
          >
            <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : 'text-[#FF5500]'}`} />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer */}
          <button
            onClick={() => setActiveModal('cart')}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 hover:border-[#FF5500] transition-all group"
          >
            <div className="relative w-8 h-8 rounded-full bg-[#FF5500] text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 text-white rounded-full text-[9px] font-black flex items-center justify-center border border-white">
                {cartCount}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-black text-slate-900 group-hover:text-[#FF5500] transition-colors leading-tight">
                My Cart
              </div>
              <div className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                {cartCount} items
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Dynamic Sub Navigation Links Bar */}
      <div className="bg-[#FAF5EE] border-t border-b border-orange-100/70">
        <div className="auramart-container flex items-center justify-between gap-6 overflow-x-auto no-scrollbar py-2 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-6 sm:gap-8 min-w-max">
            {navItems.map((item) => (
              <button
                key={item.catId}
                onClick={() => {
                  setSelectedCategory(item.catId);
                  setSearchQuery('');
                }}
                className={`relative py-1 transition-colors ${
                  selectedCategory === item.catId
                    ? 'text-[#FF5500] font-black'
                    : 'hover:text-[#FF5500]'
                }`}
              >
                <span>{item.label}</span>
                {selectedCategory === item.catId && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF5500] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
