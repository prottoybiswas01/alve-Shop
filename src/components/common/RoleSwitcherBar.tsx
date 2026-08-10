import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, ShieldAlert, ShoppingBag, Store } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { currentRole, setCurrentRole, setActiveModal } = useApp();

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
          Live Interactive Demo Mode
        </span>
        <span className="text-slate-400 hidden sm:inline">
          Switch roles anytime to explore Customer Storefront, Moderator Queue, or Admin POS/Courier settings.
        </span>
      </div>

      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
        <button
          onClick={() => setCurrentRole('customer')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
            currentRole === 'customer'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Customer View</span>
        </button>

        <button
          onClick={() => setCurrentRole('moderator')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
            currentRole === 'moderator'
              ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Moderator Panel</span>
        </button>

        <button
          onClick={() => setCurrentRole('admin')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
            currentRole === 'admin'
              ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Admin Center</span>
        </button>

        {currentRole === 'admin' && (
          <button
            onClick={() => setActiveModal('pos')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 hover:bg-emerald-900 transition-all ml-1"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Open POS Counter</span>
          </button>
        )}
      </div>
    </div>
  );
};
