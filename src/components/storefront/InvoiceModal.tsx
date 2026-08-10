import React from 'react';
import { useApp } from '../../context/AppContext';
import { printInvoiceHTML } from '../../services/invoiceService';
import { X, Printer, CheckCircle2, Truck, QrCode } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { activeInvoiceOrder, setActiveInvoiceOrder, activeModal, setActiveModal } = useApp();

  if (activeModal !== 'invoice' || !activeInvoiceOrder) return null;

  const handlePrint = () => {
    printInvoiceHTML(activeInvoiceOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl my-8">
        {/* Top Header Actions */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Order #{activeInvoiceOrder.id} Placed & Invoice Generated!</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition-all"
            >
              <Printer className="w-4 h-4" /> Print / Download Invoice PDF
            </button>
            <button
              onClick={() => {
                setActiveModal(null);
                setActiveInvoiceOrder(null);
              }}
              className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Preview Container */}
        <div className="p-6 sm:p-8 bg-white text-slate-900 rounded-b-3xl space-y-6">
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <div className="text-2xl font-black tracking-tight text-slate-900 uppercase">
                ALVE <span className="text-blue-600">SHOP</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">
                Premium Electronics Store • IDB Bhaban, Dhaka<br />
                Hotline: +880 1700-000000 | Support: help@alveshop.com
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-extrabold text-slate-900">INVOICE</div>
              <div className="text-sm font-bold text-blue-600">#{activeInvoiceOrder.id}</div>
              <div className="text-xs text-slate-500">
                Date: {new Date(activeInvoiceOrder.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Courier Status Pill */}
          {activeInvoiceOrder.courierConsignment ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-blue-800 font-bold uppercase">
                <Truck className="w-4 h-4" />
                <span>Dispatched via {activeInvoiceOrder.courierConsignment.provider}</span>
              </div>
              <div className="font-semibold text-blue-900">
                Tracking: {activeInvoiceOrder.courierConsignment.trackingCode}
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-800 font-bold uppercase">
                <Truck className="w-4 h-4" />
                <span>Ready for Pathao / Steadfast Dispatch</span>
              </div>
              <div className="font-semibold text-amber-900">Pending Courier Label</div>
            </div>
          )}

          {/* Customer & Address Details */}
          <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl text-xs border border-slate-200">
            <div>
              <div className="font-bold text-slate-500 uppercase tracking-wider mb-1">Customer Info</div>
              <div className="font-bold text-slate-900 text-sm">{activeInvoiceOrder.shippingAddress.fullName}</div>
              <div>Phone: <strong>{activeInvoiceOrder.shippingAddress.phone}</strong></div>
              <div>Email: {activeInvoiceOrder.shippingAddress.email}</div>
              <div className="mt-1">Address: {activeInvoiceOrder.shippingAddress.fullAddress}</div>
            </div>
            <div>
              <div className="font-bold text-slate-500 uppercase tracking-wider mb-1">Payment & Dispatch</div>
              <div>Payment Method: <strong className="uppercase">{activeInvoiceOrder.paymentMethod}</strong></div>
              <div>Payment Status: <strong className="uppercase text-emerald-600">{activeInvoiceOrder.paymentStatus}</strong></div>
              <div>Delivery Area: <strong>{activeInvoiceOrder.shippingAddress.deliveryType === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'}</strong></div>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-2.5 rounded-l">Item Description</th>
                <th className="p-2.5 text-right">Price</th>
                <th className="p-2.5 text-center">Qty</th>
                <th className="p-2.5 text-right rounded-r">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {activeInvoiceOrder.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="p-2.5 font-semibold text-slate-900">{item.productName}</td>
                  <td className="p-2.5 text-right">৳{item.unitPrice.toLocaleString('en-BD')}</td>
                  <td className="p-2.5 text-center">{item.quantity}</td>
                  <td className="p-2.5 text-right font-bold">৳{item.totalPrice.toLocaleString('en-BD')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Totals */}
          <div className="flex justify-between items-end pt-2 border-t border-slate-200">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <QrCode className="w-10 h-10 text-slate-800" />
              <div>Scan QR Code to verify warranty authenticity</div>
            </div>

            <div className="w-64 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>৳{activeInvoiceOrder.subtotal.toLocaleString('en-BD')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping Fee:</span>
                <span>৳{activeInvoiceOrder.shippingFee.toLocaleString('en-BD')}</span>
              </div>
              {activeInvoiceOrder.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount:</span>
                  <span>- ৳{activeInvoiceOrder.discountAmount.toLocaleString('en-BD')}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-900 pt-1">
                <span>Total Amount:</span>
                <span className="text-blue-600">৳{activeInvoiceOrder.totalAmount.toLocaleString('en-BD')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
