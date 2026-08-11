import React from 'react';
import { ShieldCheck, Tag, Layers, Award, Phone, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12">
      {/* Top Features Ribbon Bar (Vibrant Orange Bar from Image 2) */}
      <div className="bg-[#FF5500] text-white py-4">
        <div className="auramart-container grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2.5">
            <ShieldCheck className="w-5 h-5" />
            <div className="text-left">
              <div className="font-extrabold text-xs">100% Authentic</div>
              <div className="text-[10px] opacity-90">Verified sellers & genuine products</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5">
            <Tag className="w-5 h-5" />
            <div className="text-left">
              <div className="font-extrabold text-xs">Best Price</div>
              <div className="text-[10px] opacity-90">Unbeatable deals every day</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5">
            <Layers className="w-5 h-5" />
            <div className="text-left">
              <div className="font-extrabold text-xs">Wide Range</div>
              <div className="text-[10px] opacity-90">Thousands of categories & items</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2.5">
            <Award className="w-5 h-5" />
            <div className="text-left">
              <div className="font-extrabold text-xs">Trusted Sellers</div>
              <div className="text-[10px] opacity-90">100% Verified merchant stores</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-[#141210] text-slate-300 py-10 text-xs">
        <div className="auramart-container grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FF5500] flex items-center justify-center text-white">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" />
                </svg>
              </div>
              <span className="text-xl font-black text-white">AuraMart</span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Shop More, Sell More, Together. Bangladesh’s leading multi-vendor marketplace connecting verified local sellers with millions of happy buyers.
            </p>

            <div className="space-y-1.5 pt-2 text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF5500]" />
                <span>Hotline: +880 16-11223344</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF5500]" />
                <span>Support: support@auramart.bd</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column 1 */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-[#FF5500] transition-colors">Shop</a></li>
              <li><a href="#" className="hover:text-[#FF5500] transition-colors">Deals</a></li>
              <li><a href="#" className="hover:text-[#FF5500] transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-[#FF5500] transition-colors">New Arrival</a></li>
              <li><a href="#" className="hover:text-[#FF5500] transition-colors">Brands</a></li>
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Support & Account</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-[#FF5500] transition-colors">Trace Order</a></li>
              <li><a href="#" className="hover:text-[#FF5500] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#FF5500] transition-colors">My Account</a></li>
              <li><a href="#" className="hover:text-[#FF5500] transition-colors">Wishlist</a></li>
              <li>
                <a
                  href="/admin"
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, '', '/admin');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="text-purple-400 hover:text-purple-300 font-bold underline"
                >
                  Admin Control Panel (/admin)
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Orange Ribbon Copyright Bar */}
      <div className="bg-[#FF5500] text-white py-2.5 text-[11px] font-bold">
        <div className="auramart-container flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Welcome to AuraMart Bd - Shop More, Sell More, Together</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">Trace Order</a>
            <a href="#" className="hover:underline">Help Center</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
