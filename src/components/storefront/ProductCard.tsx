import React, { useState } from 'react';
import type { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, ShoppingBag, Eye, Heart, ShieldCheck, Check } from 'lucide-react';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, setSelectedProduct, setActiveModal } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div
      onClick={() => {
        setSelectedProduct(product);
        setActiveModal('product_detail');
      }}
      className="group relative bg-slate-900 border border-slate-800/80 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Box */}
      <div
        className="relative bg-slate-950 aspect-square overflow-hidden flex items-center justify-center p-4"
        onMouseEnter={() => {
          if (product.images.length > 1) setCurrentImageIndex(1);
        }}
        onMouseLeave={() => setCurrentImageIndex(0)}
      >
        <img
          src={product.images[currentImageIndex] || product.thumbnail}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-black uppercase rounded-lg shadow-md">
              -{product.discountPercentage}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2.5 py-1 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg shadow-md">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Floating Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur transition-all z-10 ${
            isWishlisted
              ? 'bg-rose-500/20 text-rose-500 border border-rose-500/40'
              : 'bg-slate-900/80 text-slate-400 border border-slate-700 hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
              setActiveModal('product_detail');
            }}
            className="px-4 py-2 bg-slate-900/90 text-white text-xs font-bold rounded-xl border border-slate-700 hover:bg-slate-800 flex items-center gap-1.5 shadow-xl"
          >
            <Eye className="w-4 h-4" /> Quick Specs
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
            <span className="uppercase tracking-wider text-blue-400 font-bold">{product.brand}</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-500">({product.reviewCount})</span>
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Stock Status & Warranty */}
        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Warranty
          </span>
          <span className={`font-semibold ${product.stock < 5 ? 'text-amber-400' : 'text-slate-400'}`}>
            {product.stock} units left
          </span>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-lg font-black text-white">
              ৳{product.price.toLocaleString('en-BD')}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-slate-500 line-through -mt-1">
                ৳{product.originalPrice.toLocaleString('en-BD')}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center ${
              addedAnimation
                ? 'bg-emerald-600 text-white scale-110 shadow-emerald-500/30'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
            }`}
            title="Add to Cart"
          >
            {addedAnimation ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
