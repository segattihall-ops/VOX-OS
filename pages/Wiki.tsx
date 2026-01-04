import React, { useState } from 'react';
import { Search, ChevronRight, Zap, Play, X, Info } from 'lucide-react';

interface WikiPage {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const Wiki: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState<WikiPage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const pages: WikiPage[] = [
    {
      id: 'au-01',
      category: 'Automation',
      title: 'NEURAL AUTOMATION MAP (A1-A10)',
      icon: <Zap className="text-yellow-500" />,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            {[
              { id: 'A1', name: 'Lead Created → Dedupe + Link', desc: 'Auto-links leads to Accounts via domain match.' },
              { id: 'A2', name: 'Lead Qualified → Create Deal', desc: 'Converts Lead to Opportunity automatically.' },
              { id: 'A3', name: 'Deal Stage Change → Activity log', desc: 'Mirrors deal progress in Account feed.' },
              { id: 'A4', name: 'Closed Won → Delivery + Onboarding', desc: 'Spawns Delivery instance + standard Milestones.' },
              { id: 'A5', name: 'Delivery Live → Account Active', desc: 'Flips Account lifecycle to "Customer—Active".' },
              { id: 'A6', name: 'Critical Ticket → Health Penalty', desc: 'Drops health score by 25 points immediately.' },
              { id: 'A7', name: 'Billing Past Due → Block Delivery', desc: 'Flags Delivery as "Blocked" on payment failure.' },
              { id: 'A8', name: 'Health Engine Audit', desc: 'Global hourly recalculation of all entity scores.' },
              { id: 'A9', name: 'Renewal Proximity', desc: 'Creates "Renewal" Deal 60 days before contract end.' },
              { id: 'A10', name: 'Universal Pulse', desc: 'Every activity updates "Last Interaction" globally.' }
            ].map(auto => (
              <div key={auto.id} className="flex space-x-4 p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all">
                <div className="font-black text-slate-300 text-lg w-10">{auto.id}</div>
                <div>
                  <h5 className="font-bold text-slate-900">{auto.name}</h5>
                  <p className="text-xs text-slate-500 mt-0.5">{auto.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'ts-01',
      category: 'Validation',
      title: 'TEST SCENARIOS (SYSTEM INTEGRITY)',
      icon: <Play className="text-emerald-500" />,
      content: (
        <div className="space-y-8">
          <section className="space-y-6">
            <div className="p-6 bg-slate-900 rounded-3xl text-white">
              <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-4">
                Scenario 1: Lead-to-Cash (The Happy Path)
              </h4>
              <ol className="text-xs space-y-3 opacity-90 list-decimal list-inside">
                <li><strong>Intake</strong>: Create a Lead with "alex@acme.com". A1 should link it to Acme Corp.</li>
                <li><strong>Qualify</strong>: Change Lead status to "Qualified". A2 should spawn a Discovery Deal.</li>
                <li><strong>Win</strong>: Move Deal to "Closed Won". A4 should create a Delivery project + 3 Milestones.</li>
                <li><strong>Go-Live</strong>: Move Delivery to "Live". A5 should set Account lifecycle to "Active".</li>
              </ol>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl">
              <h4 className="text-sm font-black text-rose-600 uppercase tracking-widest mb-4">
                Scenario 2: Critical Risk Handling
              </h4>
              <ol className="text-xs space-y-3 text-slate-700 list-decimal list-inside">
                <li><strong>Issue</strong>: Open a Support Ticket with severity "Critical".</li>
                <li><strong>Reaction</strong>: A6 triggers. Go to Account page. Health score should drop (e.g. 90 → 65).</li>
                <li><strong>Status</strong>: Lifecycle should flip to "At Risk" if score {'<'} 50.</li>
              </ol>
            </div>

            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl">
              <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4">
                Scenario 3: Financial Blockage
              </h4>
              <ol className="text-xs space-y-3 text-indigo-800 list-decimal list-inside">
                <li><strong>Failure</strong>: Set a Subscription status to "Past Due".</li>
                <li><strong>Intervention</strong>: A7 triggers. Check Delivery list. The account's project is now "Blocked".</li>
                <li><strong>Health</strong>: A8 recalculates audit. Score takes a massive -40 hit.</li>
              </ol>
            </div>
          </section>
        </div>
      )
    }
  ];

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">System WIKI</h2>
          <p className="text-slate-500">Operational Standards & Automations</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search standard protocols..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPages.map((page) => (
          <div
            key={page.id}
            onClick={() => setSelectedPage(page)}
            className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-2xl hover:border-blue-400 transition-all cursor-pointer flex flex-col h-full active:scale-[0.98]"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                {page.icon}
              </div>
              <span className="text-[10px] font-black text-slate-300 group-hover:text-blue-300 tracking-tighter uppercase">
                {page.category}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
              {page.title}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
              Protocol ID: {page.id.toUpperCase()}
            </p>
            <div className="flex items-center text-blue-600 text-xs font-black uppercase tracking-widest">
              <span>View Protocol</span>
              <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {selectedPage && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-8 sm:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-white rounded-[1.25rem] shadow-xl text-blue-600">
                  {selectedPage.icon}
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{selectedPage.title}</h3>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mt-1">
                    {selectedPage.category} Standard
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPage(null)}
                className="p-3 hover:bg-slate-200 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 sm:p-12 custom-scrollbar text-slate-700 leading-relaxed">
              <div className="max-w-3xl mx-auto">
                {selectedPage.content}
              </div>
            </div>

            <div className="p-8 sm:p-10 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                <Info size={14} className="mr-2" />
                Protocol Version 2.1 (2025 Standard)
              </div>
              <button
                onClick={() => setSelectedPage(null)}
                className="px-8 sm:px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all shadow-xl"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};