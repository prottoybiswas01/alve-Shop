import React from 'react';
import { Zap, ShieldCheck, Truck, PhoneCall, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-16">
      {/* Top Features Bar */}
      <div className="border-b border-slate-800/80 py-8 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white">100% Genuine Electronics</div>
              <div className="text-slate-500 text-[11px]">Official Brand Warranty</div>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white">Pathao & Steadfast Dispatch</div>
              <div className="text-slate-500 text-[11px]">24-48 Hours Express Delivery</div>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white">24/7 Customer Care</div>
              <div className="text-slate-500 text-[11px]">Hotline: +880 1700-000000</div>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white">Automated PDF Invoices</div>
              <div className="text-slate-500 text-[11px]">Instant Warranty Receipts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand info (Col 5) */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <span className="text-xl font-black text-white">ALVE SHOP</span>
          </div>

          <p className="text-slate-400 leading-relaxed max-w-sm">
            Bangladesh’s premier destination for original laptops, flagship smartphones, gaming consoles, smartwatches, and high-performance PC components.
          </p>

          <div className="space-y-1.5 text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>IDB Bhaban, Level 4, Agargaon, Dhaka</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>help@alveshop.com</span>
            </div>
          </div>
        </div>

        {/* Categories (Col 3) */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top Categories</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Laptops & MacBooks</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Flagship Smartphones</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sony PlayStation & Gaming</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Smartwatches & Fitness Trackers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">NVIDIA & PC Components</a></li>
          </ul>
        </div>

        {/* Delivery Logistics Partners (Col 4) */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Logistics & Payment Partners</h4>
          <p className="text-slate-400">
            Integrated with automated API endpoints for fast tracking and secure delivery.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 font-bold text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Pathao Courier
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 font-bold text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Steadfast Courier
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-pink-400 font-bold text-xs">
              bKash / Nagad
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-bold text-xs">
              Cash on Delivery
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-slate-900/60 border-t border-slate-800/80 py-4 text-center text-slate-500">
        © {new Date().getFullYear()} Alve Shop Electronics. All Rights Reserved. Built with React & Tailwind CSS.
      </div>
    </footer>
  );
};
