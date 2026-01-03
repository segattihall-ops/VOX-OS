import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveCollection } from '../hooks/useLiveData.ts';
import { Lead } from '../types.ts';
import { generateAutomatedFollowUp } from '../services/geminiService.ts';
import { calculateLeadScore } from '../hooks/useLeadScoring.ts';
import { 
  Plus, Search, X, Sparkles, 
  Users, Flame, Loader2, Zap, Send, BrainCircuit, Clock
} from 'lucide-react';

export const Leads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'stale' | 'hot'>('all');
  const { data: leads, addDoc } = useLiveCollection<Lead>('leads');
  const navigate = useNavigate();

  const [activeFollowUp, setActiveFollowUp] = useState<Lead | null>(null);
  const [followUpDraft, setFollowUpDraft] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      hot: leads.filter(l => l.temperature === 'Hot').length,
      stale: leads.filter(l => l.dnaScore > 70 && l.status === 'New').length
    };
  }, [leads]);

  const initiateFollowUp = async (lead: Lead) => {
    setActiveFollowUp(lead);
    setLoadingAI(true);
    try {
      const draft = await generateAutomatedFollowUp(lead.name, lead.company || 'Direct', lead.status, lead.lastInteraction || lead.createdAt, lead.painPoints || []);
      setFollowUpDraft(draft);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
            Neural Inbox
            <div className="ml-3 h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </h2>
          <p className="text-slate-500 font-medium italic">Gemini is currently scoring {leads.length} active prospects.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-[1.25rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center space-x-2 active:scale-95 transition-all"
        >
          <Plus size={18} />
          <span>New Prospect</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex space-x-2">
              <button onClick={() => setFilterMode('all')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${filterMode === 'all' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}>All</button>
              <button onClick={() => setFilterMode('hot')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${filterMode === 'hot' ? 'bg-white shadow text-rose-600' : 'text-slate-400'}`}>High-Intent ({stats.hot})</button>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Search neural records..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">Lead Identity</th>
                  <th className="px-8 py-5">Neural Score</th>
                  <th className="px-8 py-5">Operational Status</th>
                  <th className="px-8 py-5 text-right">Neural Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase())).map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 cursor-pointer group transition-colors" onClick={() => navigate(`/dashboard/leads/${lead.id}`)}>
                    <td className="px-8 py-6">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 mr-4 group-hover:bg-blue-600 group-hover:text-white transition-all">{lead.name[0]}</div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{lead.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black mt-1 tracking-tighter">{lead.company || 'Direct Entry'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className={`h-2 w-2 rounded-full ${lead.dnaScore > 80 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-400'}`}></div>
                        <span className="font-black text-lg text-slate-900">{lead.dnaScore}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase bg-slate-100 text-slate-500 tracking-widest">{lead.status}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={(e) => { e.stopPropagation(); initiateFollowUp(lead); }} className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        <Sparkles size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><BrainCircuit size={100} /></div>
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">Real-time Metrics</h3>
            <div className="space-y-4">
              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                <p className="text-3xl font-black mb-1">{stats.hot}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">High Intensity</p>
              </div>
              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all">
                <p className="text-3xl font-black text-rose-400 mb-1">{stats.stale}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Signal</p>
              </div>
            </div>
            <button className="w-full mt-8 py-5 bg-blue-600 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-500 active:scale-95 transition-all">Process Queue</button>
          </div>
        </div>
      </div>

      {activeFollowUp && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center space-x-6">
                <div className="p-4 bg-blue-600 text-white rounded-[1.25rem] shadow-lg"><Sparkles size={28} /></div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Neural Outreach</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Contextual Draft for {activeFollowUp.name}</p>
                </div>
              </div>
              <button onClick={() => setActiveFollowUp(null)} className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"><X size={28}/></button>
            </div>
            <div className="p-10">
              {loadingAI ? (
                <div className="flex flex-col items-center py-24">
                  <Loader2 className="animate-spin text-blue-600 mb-6" size={56} />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Synthesizing Strategy...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="relative">
                    <div className="absolute top-4 left-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Gemini 3 Pro Output</div>
                    <textarea className="w-full h-72 p-10 pt-12 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-sm font-serif leading-relaxed outline-none focus:ring-2 focus:ring-blue-500" value={followUpDraft} onChange={e => setFollowUpDraft(e.target.value)} />
                  </div>
                  <button className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-3">
                    <Send size={20} />
                    <span>Execute Send & Log</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};