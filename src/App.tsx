import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
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
import { AuthModal } from './components/storefront/AuthModal';
import { UserProfileModal } from './components/storefront/UserProfileModal';
import { POSCounter } from './components/admin/POSCounter';
import { Sparkles, ArrowLeft } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentRole, setCurrentRole, toastMessage } = useApp();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const isAdminRoute = currentPath.toLowerCase().startsWith('/admin') || currentRole === 'admin';
  const isModeratorRoute = currentPath.toLowerCase().startsWith('/moderator') || currentRole === 'moderator';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-blue-500/40 text-slate-100 text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Route Header Bar for returning to Storefront */}
      {isAdminRoute && (
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 text-xs flex justify-between items-center z-40 sticky top-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30 uppercase text-[10px]">
              Admin Control Panel (/admin)
            </span>
          </div>
          <button
            onClick={() => {
              window.history.pushState({}, '', '/');
              setCurrentPath('/');
              setCurrentRole('customer');
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront (হোমপেজে ফিরুন)</span>
          </button>
        </div>
      )}

      {/* Dynamic View based on Route / Role */}
      {isAdminRoute ? (
        <div className="flex-1">
          <AdminDashboard />
        </div>
      ) : isModeratorRoute ? (
        <div className="flex-1">
          <ModeratorDashboard />
        </div>
      ) : (
        <>
          <Header />
          <main className="flex-1">
            <HeroBanner />
            <ProductGrid />
          </main>
          <Footer />
        </>
      )}

      {/* Interactive Modals */}
      <CartDrawer />
      <CheckoutModal />
      <ProductDetailModal />
      <InvoiceModal />
      <OrderTrackingModal />
      <AuthModal />
      <UserProfileModal />
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
