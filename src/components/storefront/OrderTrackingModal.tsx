import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Truck, CheckCircle2, Clock, PackageCheck, MapPin } from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const { activeTrackingOrder, setActiveTrackingOrder, activeModal, setActiveModal } = useApp();

  if (activeModal !== 'tracking' || !activeTrackingOrder) return null;

  const steps = [
    { key: 'pending', title: 'Order Placed', desc: 'Received & Pending Verification' },
    { key: 'confirmed', title: 'Order Confirmed', desc: 'Verified by Moderator' },
    { key: 'shipped', title: 'Handed to Courier', desc: 'Assigned to Pathao / Steadfast' },
    { key: 'delivered', title: 'Delivered', desc: 'Successfully Delivered to Customer' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'processing': return 1;
      case 'shipped': return 2;
      case 'delivered': return 3;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(activeTrackingOrder.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-y-auto shadow-2xl my-8">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Live Shipment Tracking</h2>
              <p className="text-xs text-blue-400 font-mono">Order #{activeTrackingOrder.id}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveModal(null);
              setActiveTrackingOrder(null);
            }}
            className="p-2 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Courier Banner */}
          {activeTrackingOrder.courierConsignment ? (
            <div className="bg-slate-950 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between text-xs">
              <div>
                <div className="text-slate-400">Courier Partner</div>
                <div className="font-black text-white text-sm uppercase text-blue-400">
                  {activeTrackingOrder.courierConsignment.provider} Courier
                </div>
              </div>
              <div>
                <div className="text-slate-400">Consignment Tracking Code</div>
                <div className="font-mono font-bold text-white text-sm">
                  {activeTrackingOrder.courierConsignment.trackingCode}
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-slate-400">Est. Delivery</div>
                <div className="font-semibold text-emerald-400">
                  {activeTrackingOrder.courierConsignment.estimatedDelivery || '24-48 Hours'}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-4 text-xs text-amber-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Order is currently being processed by our store team before courier pickup.</span>
            </div>
          )}

          {/* Timeline Steps */}
          <div className="relative pl-6 border-l-2 border-slate-800 space-y-8">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={step.key} className="relative flex items-start gap-4">
                  {/* Step Icon Node */}
                  <div
                    className={`absolute -left-[31px] w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/40'
                        : 'bg-slate-900 border-slate-800 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className={`text-sm font-bold ${isCurrent ? 'text-blue-400' : isCompleted ? 'text-white' : 'text-slate-500'}`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-slate-400">{step.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Destination Info */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs space-y-1">
            <div className="font-bold text-slate-300 flex items-center gap-1.5 mb-2">
              <MapPin className="w-4 h-4 text-emerald-400" /> Delivery Destination
            </div>
            <div className="text-slate-200 font-semibold">{activeTrackingOrder.shippingAddress.fullName} ({activeTrackingOrder.shippingAddress.phone})</div>
            <div className="text-slate-400">{activeTrackingOrder.shippingAddress.fullAddress}</div>
            <div className="text-slate-400">{activeTrackingOrder.shippingAddress.cityZone}, {activeTrackingOrder.shippingAddress.district}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
