import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  CartItem,
  CourierConsignment,
  CourierSettings,
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
  currentUser: User;
  
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

  // Modals & Active State
  activeModal: 'cart' | 'checkout' | 'product_detail' | 'invoice' | 'tracking' | 'pos' | null;
  setActiveModal: (modal: 'cart' | 'checkout' | 'product_detail' | 'invoice' | 'tracking' | 'pos' | null) => void;
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

const DEMO_USER: User = {
  id: 'usr-9921',
  name: 'Alve Merchant',
  email: 'admin@alveshop.com',
  phone: '+880 1700-000000',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [currentUser] = useState<User>(DEMO_USER);

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
  const [activeModal, setActiveModal] = useState<'cart' | 'checkout' | 'product_detail' | 'invoice' | 'tracking' | 'pos' | null>(null);
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
