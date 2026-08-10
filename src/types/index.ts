export type UserRole = 'customer' | 'moderator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password?: string;
  avatar?: string;
  address?: string;
  city?: string;
  createdAt?: string;
}

export interface Specification {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: 'laptops' | 'smartphones' | 'smartwatches' | 'audio' | 'gaming' | 'components';
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  isNewArrival?: boolean;
  images: string[];
  thumbnail: string;
  shortDescription: string;
  description: string;
  specifications: Specification[];
  warranty: string;
  inBox: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type CourierProvider = 'pathao' | 'steadfast';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  district: string; // e.g. 'Dhaka', 'Chittagong', 'Sylhet'
  cityZone: string; // e.g. 'Dhanmondi', 'Gulshan', 'Uttara'
  fullAddress: string;
  deliveryType: 'inside_dhaka' | 'outside_dhaka';
}

export interface CourierConsignment {
  provider: CourierProvider;
  consignmentId: string;
  trackingCode: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'returned';
  createdAt: string;
  estimatedDelivery?: string;
  charge: number;
}

export interface Order {
  id: string; // e.g. ALV-89421
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: {
    productId: string;
    productName: string;
    productThumbnail: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad' | 'card' | 'pos_cash';
  paymentStatus: 'unpaid' | 'paid';
  status: OrderStatus;
  courierConsignment?: CourierConsignment;
  notes?: string;
  channel: 'online' | 'offline_pos';
}

export interface CourierSettings {
  pathao: {
    enabled: boolean;
    sandbox: boolean;
    clientId: string;
    clientSecret: string;
    username: string;
    password: string;
    storeId: string;
  };
  steadfast: {
    enabled: boolean;
    sandbox: boolean;
    apiKey: string;
    secretKey: string;
  };
}

export interface POSCartItem {
  product: Product;
  quantity: number;
  customPrice?: number;
}
