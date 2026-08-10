import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, POSCartItem } from '../../types';
import { printInvoiceHTML } from '../../services/invoiceService';
import { Store, Search, Plus, Minus, Trash2, Printer, CheckCircle2, User, X } from 'lucide-react';

export const POSCounter: React.FC = () => {
  const { products, placeOrder, activeModal, setActiveModal, setActiveInvoiceOrder } = useApp();

  const [posCart, setPosCart] = useState<POSCartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('01700000000');

  if (activeModal !== 'pos') return null;

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToPOSCart = (product: Product) => {
    setPosCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromPOSCart = (productId: string) => {
    setPosCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromPOSCart(productId);
      return;
    }
    setPosCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const posSubtotal = posCart.reduce(
    (sum, item) => sum + (item.customPrice ?? item.product.price) * item.quantity,
    0
  );

  const handleCompleteSale = () => {
    if (posCart.length === 0) {
      alert('Please add at least one product to the POS cart.');
      return;
    }

    const order = placeOrder({
      customerName,
      customerPhone,
      customerEmail: 'pos@alveshop.com',
      shippingAddress: {
        fullName: customerName,
        phone: customerPhone,
        email: 'pos@alveshop.com',
        district: 'Dhaka',
        cityZone: 'IDB Bhaban Store Counter',
        fullAddress: 'Alve Electronics Store #402, IDB Bhaban, Dhaka',
        deliveryType: 'inside_dhaka',
      },
      items: posCart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productThumbnail: item.product.thumbnail,
        unitPrice: item.customPrice ?? item.product.price,
        quantity: item.quantity,
        totalPrice: (item.customPrice ?? item.product.price) * item.quantity,
      })),
      subtotal: posSubtotal,
      shippingFee: 0,
      discountAmount: 0,
      totalAmount: posSubtotal,
      paymentMethod: 'pos_cash',
      paymentStatus: 'paid',
      notes: 'In-Store POS Quick Sale',
      channel: 'offline_pos',
    });

    setPosCart([]);
    setActiveInvoiceOrder(order);
    printInvoiceHTML(order);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col my-8">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">In-Store Point of Sale (POS) Counter</h2>
              <p className="text-xs text-slate-400">Fast cashier terminal for offline sales & instant receipt printing</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Product Search & Quick Add Grid (7 Cols) */}
          <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-slate-800 space-y-4 overflow-y-auto max-h-[65vh]">
            <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Scan barcode or type product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToPOSCart(product)}
                  className="bg-slate-950 border border-slate-800 hover:border-purple-500/50 rounded-xl p-3 cursor-pointer hover:scale-[1.02] transition-all group flex flex-col justify-between"
                >
                  <img src={product.thumbnail} alt="" className="w-full h-24 object-cover rounded-lg bg-slate-900 mb-2" />
                  <div className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-purple-400">
                    {product.name}
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className="font-black text-white">৳{product.price.toLocaleString('en-BD')}</span>
                    <span className="text-[10px] text-slate-500">{product.stock} in stock</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: POS Cart & Checkout Actions (5 Cols) */}
          <div className="lg:col-span-5 p-6 bg-slate-950 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="text-sm font-bold text-white border-b border-slate-800 pb-2">
                Current Receipt Cart ({posCart.length} items)
              </div>

              {/* Customer Quick Entry */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Customer Phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              {/* POS Cart Items List */}
              <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar pr-1">
                {posCart.map((item) => (
                  <div
                    key={item.product.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-white truncate">{item.product.name}</div>
                      <div className="text-purple-400 font-bold">
                        ৳{item.product.price.toLocaleString('en-BD')}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-white px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeFromPOSCart(item.product.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {posCart.length === 0 && (
                  <div className="text-center py-10 text-xs text-slate-500">
                    Click products on the left to add to POS counter.
                  </div>
                )}
              </div>
            </div>

            {/* Total & Instant Invoice Button */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div className="flex justify-between items-baseline text-white">
                <span className="text-xs font-semibold text-slate-400">Total Cash Due</span>
                <span className="text-2xl font-black text-purple-400">
                  ৳{posSubtotal.toLocaleString('en-BD')}
                </span>
              </div>

              <button
                onClick={handleCompleteSale}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-purple-500/25 transition-all"
              >
                <Printer className="w-4 h-4" /> Complete Sale & Print Cash Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
