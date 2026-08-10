import type { Order } from '../types';

export function printInvoiceHTML(order: Order) {
  const printWindow = window.open('', '_blank', 'width=900,height=1000');
  if (!printWindow) return;

  const itemsRows = order.items
    .map(
      (item, idx) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px; text-align: center; color: #64748b;">${idx + 1}</td>
        <td style="padding: 12px; font-weight: 600; color: #0f172a;">${item.productName}</td>
        <td style="padding: 12px; text-align: right; color: #334155;">৳${item.unitPrice.toLocaleString('en-BD')}</td>
        <td style="padding: 12px; text-align: center; color: #334155;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right; font-weight: 700; color: #0f172a;">৳${item.totalPrice.toLocaleString('en-BD')}</td>
      </tr>
    `
    )
    .join('');

  const courierBadge = order.courierConsignment
    ? `<div style="display: inline-block; padding: 6px 14px; background: #eff6ff; border: 1px solid #3b82f6; border-radius: 9999px; font-size: 13px; font-weight: 700; color: #1d4ed8; text-transform: uppercase;">
        Dispatched via ${order.courierConsignment.provider} (${order.courierConsignment.trackingCode})
      </div>`
    : `<div style="display: inline-block; padding: 6px 14px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 9999px; font-size: 13px; font-weight: 700; color: #b45309; text-transform: uppercase;">
        Fulfillment Pending
      </div>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice #${order.id} - Alve Shop</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 35px; color: #1e293b; background: #fff; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 25px; }
          .logo { font-size: 28px; font-weight: 900; letter-spacing: -0.5px; color: #0f172a; text-transform: uppercase; }
          .logo span { color: #3b82f6; }
          .invoice-title { font-size: 24px; font-weight: 800; text-align: right; color: #0f172a; }
          .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
          .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; }
          .meta-box h3 { margin-top: 0; margin-bottom: 10px; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
          .meta-box p { margin: 4px 0; font-size: 14px; font-weight: 500; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #0f172a; color: #fff; padding: 12px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; }
          th.right { text-align: right; }
          th.center { text-align: center; }
          .totals-table { width: 320px; margin-left: auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
          .totals-row { display: flex; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
          .totals-row.grand { background: #0f172a; color: #fff; font-weight: 800; font-size: 16px; border: none; }
          .footer { margin-top: 50px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">ALVE <span>SHOP</span></div>
            <div style="font-size: 13px; color: #64748b; margin-top: 4px;">
              Premium Electronics & Technology Store<br/>
              IDB Bhaban, Level 4, Agargaon, Dhaka, Bangladesh<br/>
              Hotline: +880 1700-000000 | Support: help@alveshop.com
            </div>
          </div>
          <div>
            <div class="invoice-title">INVOICE</div>
            <div style="font-size: 14px; font-weight: 700; color: #3b82f6; text-align: right; margin-top: 4px;">
              #${order.id}
            </div>
            <div style="font-size: 13px; color: #64748b; text-align: right; margin-top: 4px;">
              Date: ${new Date(order.createdAt).toLocaleDateString('en-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style="text-align: right; margin-top: 12px;">
              ${courierBadge}
            </div>
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-box">
            <h3>Billed To (Customer)</h3>
            <p style="font-size: 16px; font-weight: 700; color: #0f172a;">${order.shippingAddress.fullName}</p>
            <p>Phone: <strong>${order.shippingAddress.phone}</strong></p>
            <p>Email: ${order.shippingAddress.email}</p>
            <p>Address: ${order.shippingAddress.fullAddress}</p>
            <p>City/Zone: ${order.shippingAddress.cityZone}, ${order.shippingAddress.district}</p>
          </div>
          <div class="meta-box">
            <h3>Payment & Order Status</h3>
            <p>Order Channel: <strong>${order.channel === 'offline_pos' ? 'POS Counter (In-Store)' : 'Online Store'}</strong></p>
            <p>Payment Method: <strong style="text-transform: uppercase;">${order.paymentMethod}</strong></p>
            <p>Payment Status: <strong style="color: ${order.paymentStatus === 'paid' ? '#16a34a' : '#d97706'}; text-transform: uppercase;">${order.paymentStatus}</strong></p>
            <p>Order Status: <strong style="color: #2563eb; text-transform: uppercase;">${order.status}</strong></p>
            ${order.notes ? `<p style="margin-top: 8px; font-style: italic; color: #475569;">Note: "${order.notes}"</p>` : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="center" style="width: 50px;">#</th>
              <th>Product Details</th>
              <th class="right" style="width: 130px;">Unit Price</th>
              <th class="center" style="width: 80px;">Qty</th>
              <th class="right" style="width: 140px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>

        <div class="totals-table">
          <div class="totals-row">
            <span>Subtotal</span>
            <span>৳${order.subtotal.toLocaleString('en-BD')}</span>
          </div>
          <div class="totals-row">
            <span>Shipping Charge (${order.shippingAddress.deliveryType === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
            <span>৳${order.shippingFee.toLocaleString('en-BD')}</span>
          </div>
          ${
            order.discountAmount > 0
              ? `
          <div class="totals-row" style="color: #16a34a;">
            <span>Discount Applied</span>
            <span>- ৳${order.discountAmount.toLocaleString('en-BD')}</span>
          </div>
          `
              : ''
          }
          <div class="totals-row grand">
            <span>Total Payable</span>
            <span>৳${order.totalAmount.toLocaleString('en-BD')}</span>
          </div>
        </div>

        <div class="footer">
          <p style="font-weight: 700; color: #0f172a; margin-bottom: 4px;">Thank you for shopping with Alve Shop!</p>
          <p>This is a computer-generated invoice and requires no physical signature. Keep this document for warranty claims.</p>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 400);
}
