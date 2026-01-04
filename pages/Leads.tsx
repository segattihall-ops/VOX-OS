import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveCollection } from '../hooks/useLiveData';
import { Lead, LeadChannel, LeadStatus, LeadTemperature } from '../types';
import { generateAutomatedFollowUp } from '../services/groqService';
import { 
  Plus, Search, X, Sparkles, 
  Loader2, BrainCircuit, Send, Check 
} from 'lucide-react';

export const Leads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFollowUp, setActiveFollowUp] = useState<Lead | null>(null);
  const [followUpDraft, setFollowUpDraft] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [showNewLead, setShowNewLead] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    channel: 'Email' as LeadChannel,
    temperature: 'Warm' as LeadTemperature,
    status: 'New' as LeadStatus,
    source: 'Inbound'
  });
  const [painPointInput, setPainPointInput] = useState('');

  const { data: leads = [], addDoc } = useLiveCollection<Lead>('leads');
  const navigate = useNavigate();

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
      const draft = await generateAutomatedFollowUp(
        lead.name,
        lead.company || 'Direct',
        lead.status,
        lead.lastInteraction || lead.createdAt,
        lead.painPoints || []
      );
      setFollowUpDraft(draft);
    } catch (error) {
      console.error("AI follow-up failed:", error);
      setFollowUpDraft("AI generation temporarily unavailable. Please try again later.");
    } finally {
      setLoadingAI(false);
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetNewLead = () => {
    setNewLead({
      name: '',
      company: '',
      email: '',
      phone: '',
      channel: 'Email',
      temperature: 'Warm',
      status: 'New',
      source: 'Inbound'
    });
    setPainPointInput('');
  };

  const handleCreateLead = async () => {
    if (!newLead.name.trim()) return;
    const now = new Date().toISOString();
    const painPoints = painPointInput
      .split(',')
      .map(point => point.trim())
      .filter(Boolean);

    await addDoc({
      name: newLead.name.trim(),
      company: newLead.company.trim() || undefined,
      email: newLead.email.trim() || undefined,
      phone: newLead.phone.trim() || undefined,
      source: newLead.source,
      channel: newLead.channel,
      status: newLead.status,
      temperature: newLead.temperature,
      createdAt: now,
      dnaScore: Math.floor(60 + Math.random() * 35),
      icpFit: 'B',
      urgency: 'Normal',
      painPoints,
      ownerId: 'you',
      lastInteraction: now,
      notes: ''
    });
    setShowNewLead(false);
    resetNewLead();
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Neural Inbox
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </h2>
          <p className="text-slate-500 font-medium italic">
            AI is currently scoring {leads.length} active prospects.
          </p>
        </div>
        <button 
          onClick={() => setShowNewLead(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-[1.25rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center gap-2 active:scale-95 transition-all hover:bg-blue-500"
        >
          <Plus size={18} />
          <span>New Prospect</span>
        </button>
      </div>

      {/* Rest of your beautiful UI — unchanged */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase bg-white shadow text-blue-600">
                All
              </button>
              <button className="px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-slate-600">
                High-Intent ({stats.hot})
              </button>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search neural records..." 
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
              />
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
                {filteredLeads.length > 0 ? (
                  filteredLeads.map(lead => (
                    <tr 
                      key={lead.id} 
                      className="hover:bg-slate-50/50 cursor-pointer group transition-colors" 
                      onClick={() => navigate(`/dashboard/leads/${lead.id}`)}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                            {lead.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{lead.name || 'Unnamed Lead'}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter mt-1">
                              {lead.company || 'Direct Entry'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${lead.dnaScore > 80 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-400'}`}></div>
                          <span className="font-black text-lg text-slate-900">{lead.dnaScore ?? '—'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase bg-slate-100 text-slate-500 tracking-widest">
                          {lead.status || 'New'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            initiateFollowUp(lead); 
                          }} 
                          className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          <Sparkles size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-slate-400">
                      <div className="max-w-xs mx-auto">
                        <Search size={48} className="mx-auto mb-4 opacity-30" />
                        <p>No leads found matching your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <BrainCircuit size={100} />
            </div>
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">
              Real-time Metrics
            </h3>
            <div className="space-y-4">
              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                <p className="text-3xl font-black mb-1">{stats.hot}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">High Intensity</p>
              </div>
              <div className="p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-all">
                <p className="text-3xl font-black text-rose-400 mb-1">{stats.stale}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Signal</p>
              </div>
            </div>
            <button className="w-full mt-8 py-5 bg-blue-600 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-500 active:scale-95 transition-all">
              Process Queue
            </button>
          </div>
        </div>
      </div>

      {/* AI Follow-Up Modal */}
      {activeFollowUp && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-blue-600 text-white rounded-[1.25rem] shadow-lg">
                  <Sparkles size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Neural Outreach</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Contextual Draft for {activeFollowUp.name}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveFollowUp(null)} 
                className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={28}/>
              </button>
            </div>
            <div className="p-10">
              {loadingAI ? (
                <div className="flex flex-col items-center py-24">
                  <Loader2 className="animate-spin text-blue-600 mb-6" size={56} />
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
                    Synthesizing Strategy...
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="relative">
                    <div className="absolute top-4 left-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      AI Draft Output
                    </div>
                    <textarea 
                      className="w-full h-72 p-10 pt-12 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-sm font-serif leading-relaxed outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                      value={followUpDraft} 
                      onChange={e => setFollowUpDraft(e.target.value)} 
                    />
                  </div>
                  <button className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                    <Send size={20} />
                    <span>Execute Send & Log</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showNewLead && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-blue-600 text-white rounded-[1.25rem] shadow-lg">
                  <Plus size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Create Prospect</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Capture new lead details
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowNewLead(false);
                  resetNewLead();
                }} 
                className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={28}/>
              </button>
            </div>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="space-y-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  Full Name
                  <input 
                    type="text"
                    value={newLead.name}
                    onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="Lead name"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </label>
                <label className="space-y-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  Company
                  <input 
                    type="text"
                    value={newLead.company}
                    onChange={e => setNewLead({ ...newLead, company: e.target.value })}
                    placeholder="Company or brand"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </label>
                <label className="space-y-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  Email
                  <input 
                    type="email"
                    value={newLead.email}
                    onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="email@company.com"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </label>
                <label className="space-y-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  Phone
                  <input 
                    type="tel"
                    value={newLead.phone}
                    onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="+1 555 0100"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </label>
                <label className="space-y-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  Channel
                  <select
                    value={newLead.channel}
                    onChange={e => setNewLead({ ...newLead, channel: e.target.value as LeadChannel })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Email">Email</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Phone">Phone</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Webchat">Webchat</option>
                    <option value="Referral">Referral</option>
                  </select>
                </label>
                <label className="space-y-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  Temperature
                  <select
                    value={newLead.temperature}
                    onChange={e => setNewLead({ ...newLead, temperature: e.target.value as LeadTemperature })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Hot">Hot</option>
                    <option value="Warm">Warm</option>
                    <option value="Cold">Cold</option>
                  </select>
                </label>
                <label className="space-y-2 text-xs font-black uppercase tracking-widest text-slate-400">
                  Status
                  <select
                    value={newLead.status}
                    onChange={e => setNewLead({ ...newLead, status: e.target.value as LeadStatus })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="New">New</option>
                    <option value="Engaged">Engaged</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Nurture">Nurture</option>
                    <option value="Disqualified">Disqualified</option>
                  </select>
                </label>
              </div>
              <label className="space-y-2 text-xs font-black uppercase tracking-widest text-slate-400 block">
                Pain Points (comma separated)
                <input 
                  type="text"
                  value={painPointInput}
                  onChange={e => setPainPointInput(e.target.value)}
                  placeholder="Hiring, onboarding, lead follow-up"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </label>
              <div className="flex justify-between items-center pt-4">
                <p className="text-xs text-slate-400 font-semibold">
                  We will auto-generate the neural score and ownership metadata.
                </p>
                <button 
                  onClick={handleCreateLead}
                  disabled={!newLead.name.trim()}
                  className="inline-flex items-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-blue-500 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check size={18} />
                  Create Prospect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
