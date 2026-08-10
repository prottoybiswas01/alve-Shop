import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherBar } from './components/common/RoleSwitcherBar';
import { Header } from './components/common/Header';
import { HeroBanner } from './components/storefront/HeroBanner';
import { ProductGrid } from './components/storefront/ProductGrid';
import { Footer } from './components/common/Footer';
import { ModeratorDashboard } from './components/moderator/ModeratorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CartDrawer } from './components/storefront/CartDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { InvoiceModal } from './components/storefront/InvoiceModal';
import { OrderTrackingModal } from './components/storefront/OrderTrackingModal';
import { POSCounter } from './components/admin/POSCounter';
import { Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentRole, toastMessage } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col">
      {/* Floating Demo Role Switcher Toolbar */}
      <RoleSwitcherBar />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-blue-500/40 text-slate-100 text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Dynamic View based on Active Role */}
      {currentRole === 'customer' && (
        <>
          <Header />
          <main className="flex-1">
            <HeroBanner />
            <ProductGrid />
          </main>
          <Footer />
        </>
      )}

      {currentRole === 'moderator' && (
        <div className="flex-1">
          <ModeratorDashboard />
        </div>
      )}

      {currentRole === 'admin' && (
        <div className="flex-1">
          <AdminDashboard />
        </div>
      )}

      {/* Interactive Modals */}
      <CartDrawer />
      <CheckoutModal />
      <ProductDetailModal />
      <InvoiceModal />
      <OrderTrackingModal />
      <POSCounter />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
