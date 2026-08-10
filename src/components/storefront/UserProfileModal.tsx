import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  User,
  ShoppingBag,
  Clock,
  Truck,
  FileText,
  LogOut,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Package,
} from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    currentUser,
    logoutUser,
    orders,
    setActiveInvoiceOrder,
    setActiveTrackingOrder,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'details'>('orders');

  if (activeModal !== 'user_profile' || !currentUser) return null;

  // Filter orders belonging to this user (by email or phone)
  const userOrders = orders.filter(
    (o) =>
      (currentUser.email && o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
      (currentUser.phone && o.customerPhone === currentUser.phone)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase">Pending</span>;
      case 'processing':
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase">Processing</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold uppercase">Shipped</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">Delivered</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold uppercase">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl my-6">
        {/* Header Profile Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                currentUser.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{currentUser.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {currentUser.role}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {currentUser.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {currentUser.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logoutUser();
                setActiveModal(null);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white text-xs font-bold transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>

            <button
              onClick={() => setActiveModal(null)}
              className="p-2 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders (আমার অর্ডারসমূহ) ({userOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'orders' ? (
            <div className="space-y-4">
              {userOrders.length === 0 ? (
                <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-800">
                  <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-300">No Orders Found Yet</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    You haven't placed any orders with this account yet.
                  </p>
                </div>
              ) : (
                userOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4"
                  >
                    {/* Order Top Summary */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-white">Order #{order.id}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(order.createdAt).toLocaleDateString('en-BD', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span>•</span>
                          <span className="capitalize text-slate-300 font-medium">
                            Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveTrackingOrder(order);
                            setActiveModal('tracking');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Track Live Status</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveInvoiceOrder(order);
                            setActiveModal('invoice');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Invoice</span>
                        </button>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-slate-900/60 p-2.5 rounded-xl">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.productThumbnail}
                              alt=""
                              className="w-10 h-10 object-cover rounded-lg bg-slate-950 border border-slate-800"
                            />
                            <div>
                              <div className="font-semibold text-slate-200">{item.productName}</div>
                              <div className="text-[10px] text-slate-400">
                                ৳{item.unitPrice.toLocaleString('en-BD')} × {item.quantity}
                              </div>
                            </div>
                          </div>
                          <div className="font-bold text-white">
                            ৳{item.totalPrice.toLocaleString('en-BD')}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer Total */}
                    <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800/80">
                      <div className="text-slate-400">
                        Shipping: <span className="text-slate-200 font-semibold">৳{order.shippingFee}</span>
                      </div>
                      <div className="text-sm font-black text-white flex items-center gap-2">
                        <span>Total Paid:</span>
                        <span className="text-blue-400">৳{order.totalAmount.toLocaleString('en-BD')}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 text-xs">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Account & Shipping Address Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">Full Name</div>
                  <div className="text-sm font-bold text-white">{currentUser.name}</div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">Email Address</div>
                  <div className="text-sm font-bold text-white">{currentUser.email}</div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">Phone Number</div>
                  <div className="text-sm font-bold text-white">{currentUser.phone}</div>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1">Default City</div>
                  <div className="text-sm font-bold text-white">{currentUser.city || 'Dhaka'}</div>
                </div>

                <div className="md:col-span-2 bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-400 font-semibold mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" /> Shipping Address
                  </div>
                  <div className="text-sm font-medium text-slate-200">
                    {currentUser.address || 'No address provided yet.'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
