import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateShippingFee } from '../../services/courierService';
import { X, Truck, CreditCard, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { cart, cartTotal, placeOrder, activeModal, setActiveModal, setActiveInvoiceOrder } = useApp();

  const [fullName, setFullName] = useState('Tanvir Ahmed');
  const [phone, setPhone] = useState('01712345678');
  const [email, setEmail] = useState('tanvir@example.com');
  const [deliveryType, setDeliveryType] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [district, setDistrict] = useState('Dhaka');
  const [cityZone, setCityZone] = useState('Dhanmondi');
  const [fullAddress, setFullAddress] = useState('House 45, Road 27, Dhanmondi R/A, Dhaka');
  const [preferredCourier, setPreferredCourier] = useState<'pathao' | 'steadfast'>('pathao');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');
  const [notes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  if (activeModal !== 'checkout' || cart.length === 0) return null;

  const shippingFee = calculateShippingFee(deliveryType);
  const totalPayable = cartTotal + shippingFee - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'ALVE10' || couponCode.toUpperCase() === 'PROMO500') {
      setDiscountAmount(500);
      alert('Coupon applied! ৳500 discount added.');
    } else {
      alert('Invalid coupon code. Try "ALVE10"');
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !fullAddress) {
      alert('Please fill out all required shipping fields.');
      return;
    }

    const newOrder = placeOrder({
      customerName: fullName,
      customerPhone: phone,
      customerEmail: email,
      shippingAddress: {
        fullName,
        phone,
        email,
        district,
        cityZone,
        fullAddress,
        deliveryType,
      },
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productThumbnail: item.product.thumbnail,
        unitPrice: item.product.price,
        quantity: item.quantity,
        totalPrice: item.product.price * item.quantity,
      })),
      subtotal: cartTotal,
      shippingFee,
      discountAmount,
      totalAmount: totalPayable,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'paid',
      notes,
      channel: 'online',
    });

    setActiveInvoiceOrder(newOrder);
    setActiveModal('invoice');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Complete Order & Checkout</h2>
              <p className="text-xs text-slate-400">Insured express delivery via Pathao & Steadfast Courier</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-2 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer & Delivery Address Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Contact */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-400" /> Customer Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Location Type */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" /> Delivery Zone & Shipping Fee
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryType('inside_dhaka');
                    setDistrict('Dhaka');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    deliveryType === 'inside_dhaka'
                      ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-200">Inside Dhaka</div>
                  <div className="text-[11px] text-blue-400 font-bold mt-1">৳80 Shipping</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Delivered within 24 Hours</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeliveryType('outside_dhaka');
                    setDistrict('Chittagong');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    deliveryType === 'outside_dhaka'
                      ? 'bg-blue-600/10 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-slate-200">Outside Dhaka</div>
                  <div className="text-[11px] text-blue-400 font-bold mt-1">৳150 Shipping</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Delivered in 48-72 Hours</div>
                </button>
              </div>
            </div>

            {/* Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">District / City *</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Area / Thana / Zone *</label>
                <input
                  type="text"
                  required
                  value={cityZone}
                  onChange={(e) => setCityZone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1">Full Delivery Address *</label>
                <textarea
                  required
                  rows={2}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="House, Road, Apartment number..."
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Courier Preference */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Preferred Courier Logistics Partner
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setPreferredCourier('pathao')}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    preferredCourier === 'pathao'
                      ? 'bg-rose-500/10 border-rose-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-600 font-black text-white flex items-center justify-center text-xs">
                    PTH
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-200">Pathao Courier</div>
                    <div className="text-[10px] text-slate-400">Live API Dispatch</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredCourier('steadfast')}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    preferredCourier === 'steadfast'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-600 font-black text-white flex items-center justify-center text-xs">
                    STF
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-200">Steadfast Courier</div>
                    <div className="text-[10px] text-slate-400">Live API Dispatch</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-purple-400" /> Payment Method
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-2.5 rounded-xl border font-semibold text-center transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Cash on Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-2.5 rounded-xl border font-semibold text-center transition-all ${
                    paymentMethod === 'bkash'
                      ? 'bg-pink-600 text-white border-pink-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  bKash Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-2.5 rounded-xl border font-semibold text-center transition-all ${
                    paymentMethod === 'nagad'
                      ? 'bg-orange-600 text-white border-orange-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Nagad Wallet
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border font-semibold text-center transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Debit/Credit Card
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Confirm (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-4 border-b border-slate-800 pb-3">
                Order Summary ({cart.length} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar pr-1 mb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <img src={item.product.thumbnail} alt="" className="w-8 h-8 rounded object-cover bg-slate-900" />
                      <span className="text-slate-300 truncate">{item.quantity}x {item.product.name}</span>
                    </div>
                    <span className="font-semibold text-white whitespace-nowrap">
                      ৳{(item.product.price * item.quantity).toLocaleString('en-BD')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Box */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Coupon Code (e.g. ALVE10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
                >
                  Apply
                </button>
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2 text-xs border-t border-slate-800 pt-4">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-slate-200 font-semibold">৳{cartTotal.toLocaleString('en-BD')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping Fee ({deliveryType === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                  <span className="text-slate-200 font-semibold">৳{shippingFee.toLocaleString('en-BD')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>- ৳{discountAmount.toLocaleString('en-BD')}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-black text-white border-t border-slate-800 pt-3">
                  <span>Total Payable</span>
                  <span className="text-blue-400">৳{totalPayable.toLocaleString('en-BD')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] transition-all"
              >
                <span>Confirm & Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant automated invoice will be generated upon confirmation</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
