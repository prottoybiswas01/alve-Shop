import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Star,
  ShieldCheck,
  Package,
  Truck,
  ShoppingBag,
  Zap,
  Plus,
  Minus,
  CheckCircle2,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, activeModal, setActiveModal, addToCart } = useApp();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (activeModal !== 'product_detail' || !selectedProduct) return null;

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setActiveModal('checkout');
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={() => {
            setActiveModal(null);
            setSelectedProduct(null);
          }}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Gallery (Col 5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2 aspect-square overflow-hidden flex items-center justify-center">
              <img
                src={selectedProduct.images[activeImageIndex] || selectedProduct.thumbnail}
                alt={selectedProduct.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            {/* Thumbnail Selectors */}
            {selectedProduct.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-slate-950 flex-shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-blue-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 text-xs space-y-2 text-slate-300">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Truck className="w-4 h-4" />
                <span>Express Pathao / Steadfast Dispatch</span>
              </div>
              <p className="text-slate-400 leading-normal">
                Inside Dhaka delivery within 24 hours. Outside Dhaka 48-72 hours via insured courier.
              </p>
            </div>
          </div>

          {/* Right: Spec Info & Purchase (Col 7) */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
                <span>{selectedProduct.brand}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">{selectedProduct.category}</span>
              </div>

              <h2 className="text-2xl font-black text-white leading-tight">
                {selectedProduct.name}
              </h2>

              <div className="flex items-center gap-4 mt-2 text-xs">
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{selectedProduct.rating}</span>
                  <span className="text-slate-500">({selectedProduct.reviewCount} customer reviews)</span>
                </span>

                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({selectedProduct.stock} units)
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-medium">Price (VAT Included)</div>
                <div className="text-3xl font-black text-white">
                  ৳{selectedProduct.price.toLocaleString('en-BD')}
                </div>
              </div>
              {selectedProduct.originalPrice && (
                <div className="text-right">
                  <div className="text-xs text-slate-500 line-through">
                    ৳{selectedProduct.originalPrice.toLocaleString('en-BD')}
                  </div>
                  <span className="inline-block bg-rose-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded mt-1">
                    Save ৳{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString('en-BD')}
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Technical Specifications Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-400" /> Technical Specifications
              </h4>
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-xs">
                {selectedProduct.specifications.map((spec, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 px-3.5 py-2 border-b border-slate-800/60 last:border-none hover:bg-slate-900/50"
                  >
                    <div className="col-span-4 font-semibold text-slate-400">{spec.key}</div>
                    <div className="col-span-8 text-slate-200 font-medium">{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warranty & In-Box */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl">
                <div className="font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Warranty
                </div>
                <div className="text-slate-400">{selectedProduct.warranty}</div>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl">
                <div className="font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                  <Package className="w-4 h-4 text-blue-400" /> Package Includes
                </div>
                <div className="text-slate-400 truncate">
                  {selectedProduct.inBox.join(', ')}
                </div>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 w-full sm:w-auto justify-between">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-sm text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(selectedProduct.stock, q + 1))}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/25"
              >
                <Zap className="w-4 h-4 fill-white" /> Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
