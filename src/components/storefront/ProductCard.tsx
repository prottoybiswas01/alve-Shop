import React, { useState } from 'react';
import type { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, ShoppingBag, Check } from 'lucide-react';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, setSelectedProduct, setActiveModal } = useApp();
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
      className="group relative bg-white border border-slate-200/80 hover:border-orange-300 rounded-2xl p-3.5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Product Image Container */}
        <div className="relative bg-slate-50 rounded-xl aspect-square overflow-hidden mb-3 flex items-center justify-center">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="px-2 py-0.5 bg-[#00B8A9] text-white text-[10px] font-black uppercase rounded-md shadow-2xs">
                -{product.discountPercentage}%
              </span>
            )}
            {product.featured && (
              <span className="px-2 py-0.5 bg-[#FF5500] text-white text-[10px] font-black uppercase rounded-md shadow-2xs">
                HOT
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/90 border border-slate-200 shadow-2xs backdrop-blur transition-all z-10 ${
              isWishlisted ? 'text-rose-500 border-rose-300' : 'text-slate-400 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Product Info */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-bold text-slate-800 group-hover:text-[#FF5500] transition-colors line-clamp-2 leading-snug min-h-[32px]">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-1.5 pt-0.5">
            <span className="text-sm font-black text-[#FF5500]">
              ৳{product.price.toLocaleString('en-BD')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] font-medium text-slate-400 line-through">
                ৳{product.originalPrice.toLocaleString('en-BD')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Add to Cart Button (Solid Black Pill Button matching screenshot) */}
      <div className="pt-3 mt-2 border-t border-slate-100">
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
            addedAnimation
              ? 'bg-emerald-600 text-white'
              : 'bg-[#111111] hover:bg-slate-800 text-white shadow-2xs'
          }`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
