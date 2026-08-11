import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateShippingFee } from '../../services/courierService';
import { X, Truck, CreditCard, ShieldCheck, CheckCircle2, ArrowRight, Tag } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartTotal,
    placeOrder,
    activeModal,
    setActiveModal,
    setActiveInvoiceOrder,
    currentUser,
    applyCoupon,
  } = useApp();

  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [deliveryType, setDeliveryType] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [district, setDistrict] = useState(currentUser?.city || 'Dhaka');
  const [cityZone, setCityZone] = useState('Dhanmondi');
  const [fullAddress, setFullAddress] = useState(currentUser?.address || '');
  const [paymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'card'>('cod');
  const [notes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.name);
      setPhone(currentUser.phone);
      setEmail(currentUser.email);
      if (currentUser.address) setFullAddress(currentUser.address);
      if (currentUser.city) setDistrict(currentUser.city);
    }
  }, [currentUser]);

  if (activeModal !== 'checkout' || cart.length === 0) return null;

  const shippingFee = calculateShippingFee(deliveryType);
  const totalPayable = Math.max(0, cartTotal + shippingFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = applyCoupon(couponCode, cartTotal);
    setCouponMsg(res.message);
    if (res.success) {
      setDiscountAmount(res.discountAmount);
    } else {
      setDiscountAmount(0);
    }
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !fullAddress) {
      alert('Please fill out all required customer name, phone, and delivery address fields.');
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
      paymentStatus: 'unpaid',
      notes,
      channel: 'online',
    });

    setActiveInvoiceOrder(newOrder);
    setActiveModal('invoice');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl my-8 text-slate-800">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-50 text-[#FF5500] border border-orange-200">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Express Checkout & Order Confirmation</h2>
              <p className="text-xs text-slate-500">Doorstep delivery with Cash on Delivery (ক্যাশ অন ডেলিভারি)</p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-2 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer & Delivery Address Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Contact */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#FF5500]" /> Customer Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Hasan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#FF5500]"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Location Zone */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" /> Delivery Zone & Shipping Fee
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
                      ? 'bg-orange-50 border-[#FF5500] text-slate-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">Inside Dhaka</div>
                  <div className="text-[11px] text-[#FF5500] font-black mt-1">৳80 Shipping</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Pathao / Steadfast 24h</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDeliveryType('outside_dhaka');
                    setDistrict('Chittagong');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    deliveryType === 'outside_dhaka'
                      ? 'bg-orange-50 border-[#FF5500] text-slate-900 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">Outside Dhaka</div>
                  <div className="text-[11px] text-[#FF5500] font-black mt-1">৳150 Shipping</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Steadfast / Pathao 48-72h</div>
                </button>
              </div>
            </div>

            {/* Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">District / City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka / Chittagong / Sylhet"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#FF5500]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Thana / Zone / Area *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhanmondi / Gulshan / Mirpur"
                  value={cityZone}
                  onChange={(e) => setCityZone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#FF5500]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1">Full Delivery Address *</label>
                <textarea
                  required
                  rows={2}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="House, Road, Block, Flat Number..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#FF5500]"
                />
              </div>
            </div>

            {/* Payment Option */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#FF5500]" /> Payment Method
              </h3>
              <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 text-slate-900 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-sm text-slate-900">Cash on Delivery (ক্যাশ অন ডেলিভারি)</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">Pay in cash when courier delivers parcel to your doorstep</div>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Confirm (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-200 pb-3">
                Order Summary ({cart.length} items)
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar pr-1 mb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <img src={item.product.thumbnail} alt="" className="w-9 h-9 rounded-lg object-cover bg-white border border-slate-200" />
                      <span className="text-slate-800 font-medium truncate">{item.quantity}x {item.product.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 whitespace-nowrap">
                      ৳{(item.product.price * item.quantity).toLocaleString('en-BD')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Box */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 uppercase placeholder-slate-400 focus:outline-none focus:border-[#FF5500]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMsg && (
                  <div className={`text-[11px] font-semibold ${discountAmount > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {couponMsg}
                  </div>
                )}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2 text-xs border-t border-slate-200 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">৳{cartTotal.toLocaleString('en-BD')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee ({deliveryType === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                  <span className="text-slate-900 font-bold">৳{shippingFee.toLocaleString('en-BD')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount Voucher</span>
                    <span>- ৳{discountAmount.toLocaleString('en-BD')}</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-black text-slate-900 border-t border-slate-200 pt-3">
                  <span>Total Payable</span>
                  <span className="text-[#FF5500]">৳{totalPayable.toLocaleString('en-BD')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
              >
                <span>Confirm Order (ক্যাশ অন ডেলিভারি)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pathao & Steadfast automated courier consignment generation</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
