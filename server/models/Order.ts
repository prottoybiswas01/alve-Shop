import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  productName: string;
  productThumbnail: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface ICourierConsignment {
  provider: 'pathao' | 'steadfast';
  consignmentId: string;
  trackingCode: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'returned';
  createdAt: string;
  estimatedDelivery?: string;
  charge: number;
}

export interface IOrder extends Document {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    email: string;
    district: string;
    cityZone: string;
    fullAddress: string;
    deliveryType: 'inside_dhaka' | 'outside_dhaka';
  };
  items: IOrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card' | 'pos_cash';
  paymentStatus: 'unpaid' | 'paid';
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  courierConsignment?: ICourierConsignment;
  notes?: string;
  channel: 'online' | 'offline_pos';
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productThumbnail: { type: String, required: true },
  unitPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
});

const CourierConsignmentSchema = new Schema<ICourierConsignment>({
  provider: { type: String, enum: ['pathao', 'steadfast'], required: true },
  consignmentId: { type: String, required: true },
  trackingCode: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in_transit', 'delivered', 'returned'], default: 'pending' },
  createdAt: { type: String, required: true },
  estimatedDelivery: { type: String },
  charge: { type: Number, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, required: true, unique: true },
    createdAt: { type: String, required: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      district: { type: String, required: true },
      cityZone: { type: String, required: true },
      fullAddress: { type: String, required: true },
      deliveryType: { type: String, enum: ['inside_dhaka', 'outside_dhaka'], required: true },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cod', 'bkash', 'nagad', 'card', 'pos_cash'], required: true },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    status: { type: String, enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    courierConsignment: CourierConsignmentSchema,
    notes: { type: String },
    channel: { type: String, enum: ['online', 'offline_pos'], default: 'online' },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
