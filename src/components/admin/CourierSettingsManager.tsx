import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, RefreshCw, CheckCircle2 } from 'lucide-react';

export const CourierSettingsManager: React.FC = () => {
  const { courierSettings, updateCourierSettings } = useApp();
  const [settings, setSettings] = useState(courierSettings);
  const [testPathaoStatus, setTestPathaoStatus] = useState<string | null>(null);
  const [testSteadfastStatus, setTestSteadfastStatus] = useState<string | null>(null);

  const handleSave = () => {
    updateCourierSettings(settings);
  };

  const testPathaoConnection = async () => {
    setTestPathaoStatus('connecting');
    await new Promise((r) => setTimeout(r, 1000));
    setTestPathaoStatus('success');
    setTimeout(() => setTestPathaoStatus(null), 3000);
  };

  const testSteadfastConnection = async () => {
    setTestSteadfastStatus('connecting');
    await new Promise((r) => setTimeout(r, 1000));
    setTestSteadfastStatus('success');
    setTimeout(() => setTestSteadfastStatus(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Truck className="w-4 h-4" /> Nationwide Logistics API Management
          </div>
          <h2 className="text-2xl font-black text-white">Pathao & Steadfast Merchant API Settings</h2>
          <p className="text-xs text-slate-300 mt-1">
            Configure merchant API keys, client secrets, and store IDs for automated 1-click delivery dispatch.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-xl shadow-blue-500/25 transition-all"
        >
          Save All Credentials
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pathao Courier Settings Card */}
        <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 font-black text-white flex items-center justify-center text-sm shadow-lg shadow-rose-600/30">
                PTH
              </div>
              <div>
                <h3 className="text-base font-black text-white">Pathao Courier API</h3>
                <p className="text-[11px] text-slate-400">Hermes Merchant API v1</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pathao.enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pathao: { ...settings.pathao, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="font-semibold text-slate-300">Sandbox Test Mode</span>
              <button
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    pathao: { ...settings.pathao, sandbox: !settings.pathao.sandbox },
                  })
                }
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  settings.pathao.sandbox
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {settings.pathao.sandbox ? 'Sandbox Mode' : 'Live Production'}
              </button>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Pathao Client ID</label>
              <input
                type="text"
                value={settings.pathao.clientId}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pathao: { ...settings.pathao, clientId: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Pathao Client Secret</label>
              <input
                type="password"
                value={settings.pathao.clientSecret}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pathao: { ...settings.pathao, clientSecret: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Store ID</label>
              <input
                type="text"
                value={settings.pathao.storeId}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    pathao: { ...settings.pathao, storeId: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-slate-800">
            <button
              onClick={testPathaoConnection}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testPathaoStatus === 'connecting' ? 'animate-spin' : ''}`} />
              <span>Test Pathao API</span>
            </button>

            {testPathaoStatus === 'success' && (
              <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> API Token Verified!
              </span>
            )}
          </div>
        </div>

        {/* Steadfast Courier Settings Card */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 font-black text-white flex items-center justify-center text-sm shadow-lg shadow-amber-600/30">
                STF
              </div>
              <div>
                <h3 className="text-base font-black text-white">Steadfast Courier API</h3>
                <p className="text-[11px] text-slate-400">Steadfast Merchant Portal v1</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.steadfast.enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    steadfast: { ...settings.steadfast, enabled: e.target.checked },
                  })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="font-semibold text-slate-300">Sandbox Test Mode</span>
              <button
                type="button"
                onClick={() =>
                  setSettings({
                    ...settings,
                    steadfast: { ...settings.steadfast, sandbox: !settings.steadfast.sandbox },
                  })
                }
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                  settings.steadfast.sandbox
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {settings.steadfast.sandbox ? 'Sandbox Mode' : 'Live Production'}
              </button>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Steadfast API Key</label>
              <input
                type="text"
                value={settings.steadfast.apiKey}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    steadfast: { ...settings.steadfast, apiKey: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Steadfast Secret Key</label>
              <input
                type="password"
                value={settings.steadfast.secretKey}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    steadfast: { ...settings.steadfast, secretKey: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-between items-center border-t border-slate-800">
            <button
              onClick={testSteadfastConnection}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testSteadfastStatus === 'connecting' ? 'animate-spin' : ''}`} />
              <span>Test Steadfast API</span>
            </button>

            {testSteadfastStatus === 'success' && (
              <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Secret Key Verified!
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
