import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loginUser, currentRole } = useApp();

  const [email, setEmail] = useState('admin@alveshop.com');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in as admin or role is admin, show dashboard
  if (currentUser && currentUser.role === 'admin' && currentRole === 'admin') {
    return <>{children}</>;
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = loginUser(email, password);
    if (!success) {
      setErrorMsg('Access Denied. Invalid admin email or password.');
    }
  };

  const handleQuickDemoAdminLogin = () => {
    setEmail('admin@alveshop.com');
    setPassword('admin');
    loginUser('admin@alveshop.com', 'admin');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative bg-slate-900 border border-purple-500/30 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-8 space-y-6">
        {/* Top Lock Icon */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-purple-500/30">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase tracking-wider mb-2">
              <Lock className="w-3 h-3" /> Restricted Executive Access
            </div>
            <h2 className="text-2xl font-black text-white">Admin Authentication</h2>
            <p className="text-xs text-slate-400 mt-1">
              Please enter your merchant administrator credentials to access the Executive Control Hub.
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Admin Email Address</label>
            <input
              type="email"
              required
              placeholder="admin@alveshop.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Admin Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-purple-500/25 hover:scale-[1.01] transition-all"
          >
            <span>Unlock Admin Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Admin Access Option */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <div className="text-[11px] text-slate-400 font-semibold mb-2 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo One-Touch Admin Login:
          </div>
          <button
            onClick={handleQuickDemoAdminLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center justify-between"
          >
            <span className="font-mono">Email: admin@alveshop.com</span>
            <span className="text-purple-400 font-sans text-[11px]">Pass: admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};
