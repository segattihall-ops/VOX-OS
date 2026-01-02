
import React, { useState } from 'react';
import { scanNewLeads } from '../services/geminiService';
import { Zap, Search, Radar, ListFilter, Target, Rocket, Sparkles, AlertCircle } from 'lucide-react';

export const RevenueCommand: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'scan' | 'ledger' | 'inspect'>('scan');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [industry, setIndustry] = useState('SaaS Technology');

  const handleScan = async () => {
    setScanning(true);
    const leads = await scanNewLeads(industry);
    setResults(leads);
    setScanning(false);
    setActiveTab('ledger');
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 skew-x-12 transform translate-x-20"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-blue-500/30">
            <Zap size={14} />
            <span>AI Command Center</span>
          </div>
          <h2 className="text-4xl font-bold mb-4 tracking-tight">Revenue Command</h2>
          <p className="text-slate-400 text-lg">
            Scan the market for high-intent signals and identify your next enterprise accounts using Voxmation's proprietary Gemini-powered engine.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-2 flex flex-col h-fit">
          {[
            { id: 'scan', label: 'Market Scan', icon: <Radar size={18} />, desc: 'Detect new signals' },
            { id: 'ledger', label: 'Signals Ledger', icon: <ListFilter size={18} />, desc: 'Manage generated leads' },
            { id: 'inspect', label: 'AI Inspector', icon: <Target size={18} />, desc: 'Deep firmographic audit' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-start p-4 rounded-lg transition-all text-left mb-1 ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className={`mt-1 mr-3 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`}>
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-sm">{item.label}</p>
                <p className="text-xs opacity-70">{item.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'scan' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center space-y-8 animate-in zoom-in-95 duration-300">
              <div className="max-w-md mx-auto space-y-6">
                <div className="h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 relative">
                  <Radar size={48} className={scanning ? 'animate-ping opacity-25' : ''} />
                  <Search size={24} className="absolute" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Define your hunting ground</h3>
                <p className="text-slate-500">Enter an industry or niche to scan for buying signals.</p>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Fintech Series B startups"
                    className="w-full px-6 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none text-lg font-medium"
                  />
                  <button 
                    onClick={handleScan}
                    disabled={scanning}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
                  >
                    {scanning ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Scanning Neural Web...</span>
                      </>
                    ) : (
                      <>
                        <Rocket size={20} />
                        <span>Initiate Market Scan</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-center space-x-4 text-xs text-slate-400 uppercase tracking-widest font-bold">
                  <span>Powered by Gemini 3</span>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <span>Real-time Signal Analysis</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ledger' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-lg">AI Generated Leads</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase">{results.length} Signals Detected</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Signal Detected</th>
                      <th className="px-6 py-4">DNA Score</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.length > 0 ? results.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900">{item.company}</td>
                        <td className="px-6 py-4 text-slate-600">{item.contact}</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center text-xs text-slate-500 italic max-w-xs leading-relaxed">
                            <Sparkles size={12} className="mr-2 text-blue-500 flex-shrink-0" />
                            {item.signal}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className={`font-mono font-bold text-sm ${item.dnaScore > 80 ? 'text-emerald-600' : 'text-slate-600'}`}>
                              {item.dnaScore}
                            </span>
                            <div className="ml-2 w-16 h-1 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                              <div className="h-full bg-blue-500" style={{ width: `${item.dnaScore}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-blue-600 font-bold text-sm hover:underline">Import</button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <div className="max-w-xs mx-auto space-y-3">
                            <AlertCircle size={40} className="mx-auto text-slate-300" />
                            <p className="text-slate-500">No signals found yet. Try running a Market Scan.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'inspect' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-20 text-center space-y-4 animate-in slide-in-from-right-4 duration-300">
              <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                <Target size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">AI Inspector Placeholder</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Upload a list of domains to perform deep firmographic analysis and uncover hidden technical pain points.</p>
              <button className="mt-4 px-6 py-3 bg-white border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-slate-50">Upload Domain List</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
