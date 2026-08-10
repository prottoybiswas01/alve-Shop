import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, ArrowUpDown, X, Filter } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(500000);

  // Extract unique brands for filter dropdown
  const availableBrands = useMemo(() => {
    const brandsSet = new Set(products.map((p) => p.brand));
    return Array.from(brandsSet);
  }, [products]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;
        const matchesPrice = p.price <= maxPrice;
        const matchesSearch =
          !searchQuery.trim() ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesBrand && matchesPrice && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedBrand, maxPrice, searchQuery, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedBrand !== 'all' || maxPrice < 500000 || searchQuery !== '';

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMaxPrice(500000);
    setSearchQuery('');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Control Bar: Results count, Filters, Sorting */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Section Header & Count */}
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span>Electronics Catalog</span>
            <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full font-bold">
              {filteredProducts.length} Products Found
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Original laptops, smartphones, audio & gaming gear with express nationwide shipping
          </p>
        </div>

        {/* Right: Brand Filter, Price Slider, Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Brand Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Brands</option>
              {availableBrands.map((b) => (
                <option key={b} value={b} className="bg-slate-900">{b}</option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-slate-900">Sort: Featured First</option>
              <option value="price_low" className="bg-slate-900">Price: Low to High</option>
              <option value="price_high" className="bg-slate-900">Price: High to Low</option>
              <option value="rating" className="bg-slate-900">Top Rated</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-3 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-semibold hover:bg-rose-500/20 transition-all"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid Display */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center my-8 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-slate-800 text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">No products match your criteria</h3>
          <p className="text-xs text-slate-400 mb-6">
            Try adjusting your search query, brand selection, or price range filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
