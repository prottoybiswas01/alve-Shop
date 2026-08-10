import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  CartItem,
  CourierConsignment,
  CourierSettings,
  Coupon,
  Order,
  OrderStatus,
  Product,
  User,
  UserRole,
} from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';
import { INITIAL_ORDERS } from '../data/mockOrders';
import { DEFAULT_COURIER_SETTINGS, dispatchToPathao, dispatchToSteadfast } from '../services/courierService';

interface AppContextType {
  // Role & Auth
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User | null;
  users: User[];
  loginUser: (emailOrPhone: string, password?: string) => boolean;
  registerUser: (userData: Omit<User, 'id' | 'role' | 'createdAt'>) => User;
  logoutUser: () => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart & Wishlist
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  dispatchOrderToCourier: (orderId: string, provider: 'pathao' | 'steadfast') => Promise<CourierConsignment | null>;

  // Courier Settings
  courierSettings: CourierSettings;
  updateCourierSettings: (newSettings: CourierSettings) => void;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  deleteCoupon: (id: string) => void;
  toggleCouponActive: (id: string) => void;
  applyCoupon: (code: string, cartTotalAmount: number) => { success: boolean; discountAmount: number; message: string };

  // Modals & Active State
  activeModal: 'cart' | 'checkout' | 'product_detail' | 'invoice' | 'tracking' | 'pos' | 'auth' | 'user_profile' | null;
  setActiveModal: (modal: 'cart' | 'checkout' | 'product_detail' | 'invoice' | 'tracking' | 'pos' | 'auth' | 'user_profile' | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  activeInvoiceOrder: Order | null;
  setActiveInvoiceOrder: (order: Order | null) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedBrand: string;
  setSelectedBrand: (brand: string) => void;

  // Toast notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_USERS: User[] = [
  {
    id: 'usr-customer-1',
    name: 'Tanvir Ahmed',
    email: 'tanvir@example.com',
    phone: '01712345678',
    role: 'customer',
    password: '123456',
    address: 'House 45, Road 27, Dhanmondi R/A',
    city: 'Dhaka',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'usr-admin-1',
    name: 'Alve Merchant',
    email: 'admin@alveshop.com',
    phone: '+880 1700-000000',
    role: 'admin',
    password: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    createdAt: new Date().toISOString(),
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  
  // Registered Users list
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('alve_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  useEffect(() => {
    localStorage.setItem('alve_users', JSON.stringify(users));
  }, [users]);

  // Current Logged-in User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('alve_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0]; // Default logged in as Tanvir Ahmed
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('alve_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('alve_current_user');
    }
  }, [currentUser]);

  const loginUser = (emailOrPhone: string, password?: string): boolean => {
    const found = users.find(
      (u) =>
        (u.email.toLowerCase() === emailOrPhone.trim().toLowerCase() ||
          u.phone.trim() === emailOrPhone.trim()) &&
        (!password || u.password === password)
    );

    if (found) {
      setCurrentUser(found);
      if (found.role === 'admin') setCurrentRole('admin');
      showToast(`Welcome back, ${found.name}!`);
      return true;
    }
    return false;
  };

  const registerUser = (userData: Omit<User, 'id' | 'role' | 'createdAt'>): User => {
    const newUser: User = {
      ...userData,
      id: 'usr-' + Date.now(),
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    showToast(`Account created! Welcome, ${newUser.name}!`);
    return newUser;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCurrentRole('customer');
    showToast('Logged out successfully.');
  };

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('alve_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('alve_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...newProdData,
      id: 'prod-' + Date.now(),
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Product "${newProd.name.slice(0, 25)}..." added successfully!`);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    showToast('Product updated successfully.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed.');
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('alve_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('alve_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name.slice(0, 25)}..." to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>([]);
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    showToast('Wishlist updated.');
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('alve_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('alve_orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Order => {
    const newOrder: Order = {
      ...orderData,
      id: 'ALV-' + Math.floor(10000 + Math.random() * 90000),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    setOrders((prev) => [newOrder, ...prev]);
    if (orderData.channel === 'online') {
      clearCart();
    }
    showToast(`Order #${newOrder.id} placed successfully!`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Order #${orderId} status updated to ${status.toUpperCase()}`);
  };

  // Courier Settings
  const [courierSettings, setCourierSettings] = useState<CourierSettings>(() => {
    const saved = localStorage.getItem('alve_courier_settings');
    return saved ? JSON.parse(saved) : DEFAULT_COURIER_SETTINGS;
  });

  const updateCourierSettings = (newSettings: CourierSettings) => {
    setCourierSettings(newSettings);
    localStorage.setItem('alve_courier_settings', JSON.stringify(newSettings));
    showToast('Courier API credentials updated.');
  };

  // Coupons System
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('alve_coupons');
    return saved
      ? JSON.parse(saved)
      : [
          { id: 'c-1', code: 'ALVE500', type: 'fixed', discountValue: 500, minOrderAmount: 1000, active: true },
          { id: 'c-2', code: 'PROMO10', type: 'percentage', discountValue: 10, minOrderAmount: 2000, active: true },
        ];
  });

  useEffect(() => {
    localStorage.setItem('alve_coupons', JSON.stringify(coupons));
  }, [coupons]);

  const addCoupon = (newCoupon: Omit<Coupon, 'id'>) => {
    const created: Coupon = { ...newCoupon, id: 'c-' + Date.now() };
    setCoupons((prev) => [created, ...prev]);
    showToast(`Coupon "${created.code}" created!`);
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('Coupon deleted.');
  };

  const toggleCouponActive = (id: string) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const applyCoupon = (codeInput: string, cartTotalAmount: number) => {
    const found = coupons.find(
      (c) => c.code.toLowerCase() === codeInput.trim().toLowerCase() && c.active
    );

    if (!found) {
      return { success: false, discountAmount: 0, message: 'Invalid or expired coupon code.' };
    }

    if (found.minOrderAmount && cartTotalAmount < found.minOrderAmount) {
      return {
        success: false,
        discountAmount: 0,
        message: `Minimum order amount of ৳${found.minOrderAmount} required for coupon ${found.code}.`,
      };
    }

    let discountAmount = 0;
    if (found.type === 'fixed') {
      discountAmount = found.discountValue;
    } else {
      discountAmount = Math.round((cartTotalAmount * found.discountValue) / 100);
    }

    return {
      success: true,
      discountAmount,
      message: `Coupon "${found.code}" applied successfully!`,
    };
  };

  const dispatchOrderToCourier = async (
    orderId: string,
    provider: 'pathao' | 'steadfast'
  ): Promise<CourierConsignment | null> => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return null;

    showToast(`Dispatching #${orderId} via ${provider.toUpperCase()} API...`);

    let consignment: CourierConsignment;
    if (provider === 'pathao') {
      consignment = await dispatchToPathao(targetOrder, courierSettings);
    } else {
      consignment = await dispatchToSteadfast(targetOrder, courierSettings);
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'shipped',
              courierConsignment: consignment,
            }
          : o
      )
    );

    showToast(`Order #${orderId} successfully dispatched! Tracking Code: ${consignment.trackingCode}`);
    return consignment;
  };

  // Modals
  const [activeModal, setActiveModal] = useState<'cart' | 'checkout' | 'product_detail' | 'invoice' | 'tracking' | 'pos' | 'auth' | 'user_profile' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Toasts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        users,
        loginUser,
        registerUser,
        logoutUser,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        wishlist,
        toggleWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        dispatchOrderToCourier,
        courierSettings,
        updateCourierSettings,
        coupons,
        addCoupon,
        deleteCoupon,
        toggleCouponActive,
        applyCoupon,
        activeModal,
        setActiveModal,
        selectedProduct,
        setSelectedProduct,
        activeInvoiceOrder,
        setActiveInvoiceOrder,
        activeTrackingOrder,
        setActiveTrackingOrder,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedBrand,
        setSelectedBrand,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
