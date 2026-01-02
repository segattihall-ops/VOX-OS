
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveCollection } from '../hooks/useLiveData';
import { Lead, LeadStatus, LeadChannel, LeadTemperature, Account, Contact, Opportunity } from '../types';
import { generateAutomatedFollowUp } from '../services/geminiService';
import { AutomationService } from '../services/automationService';
import { 
  Plus, Search, Mail, Phone, 
  X, Sparkles, AlertCircle, 
  Zap, Globe, MessageSquare, Flame,
  Users, Instagram, Linkedin, ChevronRight,
  MailCheck, Loader2, Copy, Check, Save, User, Building2, Calendar, FileText, Briefcase, Link2
} from 'lucide-react';

export const Leads: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: leads, addDoc, updateDoc } = useLiveCollection<Lead>('leads');
  const { data: accounts } = useLiveCollection<Account>('accounts');
  const { data: contacts } = useLiveCollection<Contact>('contacts');
  const { data: deals } = useLiveCollection<Opportunity>('opportunities');

  const [activeFollowUp, setActiveFollowUp] = useState<Lead | null>(null);
  const [followUpDraft, setFollowUpDraft] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // New Lead Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: '',
    email: '',
    phone: '',
    source: 'Inbound',
    channel: 'Email',
    campaignUTM: '',
    status: 'New',
    temperature: 'Warm',
    notes: '',
    createdAt: new Date().toISOString().split('T')[0],
    linkedAccountId: '',
    linkedContactId: '',
    convertedDealId: '',
    ownerId: 'usr-1',
    dnaScore: 50,
    icpFit: 'B',
    urgency: 'Standard',
    painPoints: []
  });

  const navigate = useNavigate();

  const filteredLeads = useMemo(() => {
    return leads.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      l.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [leads, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      hot: leads.filter(l => l.temperature === 'Hot').length,
      stale: leads.filter(l => {
        if (!l.lastInteraction) return true;
        const days = (Date.now() - new Date(l.lastInteraction).getTime()) / (1000 * 60 * 60 * 24);
        return days > 3;
      }).length
    };
  }, [leads]);

  const handleQualify = async (leadId: string) => {
    await updateDoc(leadId, { status: 'Qualified' });
    AutomationService.convertLeadToDeal(leadId);
  };

  const handleAddLead = async () => {
    // Validation: Full Name is required
    if (!newLead.name) {
      alert("Full Name is mandatory for neural registration.");
      return;
    }
    // Validation: At least Email or Phone
    if (!newLead.email && !newLead.phone) {
      alert("Communication Error: Please provide at least an Email or Phone number.");
      return;
    }

    const docToAdd = {
      ...newLead,
      lastInteraction: new Date().toISOString()
    } as Omit<Lead, 'id'>;
    
    await addDoc(docToAdd);
    setIsAddModalOpen(false);
    
    // Reset form to baseline
    setNewLead({
      name: '', email: '', phone: '', source: 'Inbound', channel: 'Email',
      campaignUTM: '', status: 'New', temperature: 'Warm', notes: '',
      createdAt: new Date().toISOString().split('T')[0],
      linkedAccountId: '', linkedContactId: '', convertedDealId: '',
      ownerId: 'usr-1', dnaScore: 50, icpFit: 'B', urgency: 'Standard', painPoints: []
    });
  };

  const initiateFollowUp = async (lead: Lead) => {
    setActiveFollowUp(lead);
    setLoadingAI(true);
    setFollowUpDraft('');
    try {
      const draft = await generateAutomatedFollowUp(
        lead.name,
        lead.company || 'their company',
        lead.status,
        lead.lastInteraction || lead.createdAt,
        lead.painPoints
      );
      setFollowUpDraft(draft);
    } catch (error) {
      setFollowUpDraft("Error generating personalized follow-up. Please try again.");
    } finally {
      setLoadingAI(false);
    }
  };

  const sendFollowUp = () => {
    if (!activeFollowUp) return;
    AutomationService.logFollowUpActivity(activeFollowUp, followUpDraft);
    setActiveFollowUp(null);
    setFollowUpDraft('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(followUpDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getChannelIcon = (channel: Lead['channel']) => {
    switch (channel) {
      case 'Instagram': return <Instagram size={14} />;
      case 'WhatsApp': return <MessageSquare size={14} />;
      case 'LinkedIn': return <Linkedin size={14} />;
      case 'Webchat': return <Globe size={14} />;
      default: return <Mail size={14} />;
    }
  };

  const getTempColor = (temp: Lead['temperature']) => {
    switch (temp) {
      case 'Hot': return 'text-rose-500 bg-rose-50';
      case 'Warm': return 'text-amber-500 bg-amber-50';
      default: return 'text-blue-500 bg-blue-50';
    }
  };

  const isStale = (lastInteraction?: string) => {
    if (!lastInteraction) return true;
    const days = (Date.now() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60 * 24);
    return days > 3;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Neural Inbox</h2>
          <p className="text-slate-500 italic">Capturing high-intent buying signals from multi-channel flows.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-4 mr-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-r pr-6 border-slate-200 h-10">
             <div className="flex items-center space-x-2"><Users size={14} className="text-blue-500" /><span>{stats.total} INFLOW</span></div>
             <div className="flex items-center space-x-2"><Flame size={14} className="text-rose-500" /><span>{stats.hot} HOT</span></div>
             <div className="flex items-center space-x-2"><AlertCircle size={14} className="text-amber-500" /><span>{stats.stale} STALE</span></div>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            <Plus size={18} />
            <span>NEW LEAD</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search identity or source..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-8 py-5">Prospect & DNA Score</th>
                <th className="px-8 py-5">Status / Last Touch</th>
                <th className="px-8 py-5">Channel Engagement</th>
                <th className="px-8 py-5 text-right">Strategic Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => navigate(`/dashboard/leads/${lead.id}`)}>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-[1rem] bg-slate-100 flex items-center justify-center text-slate-600 font-black mr-4 border border-slate-200 relative group-hover:scale-110 transition-transform">
                        {lead.name[0]}
                        <div className={`absolute -top-1 -right-1 h-5 w-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-black ${getTempColor(lead.temperature)}`}>
                          {lead.dnaScore}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{lead.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{lead.company || 'Unknown Entity'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-[0.1em] ${
                          lead.status === 'Qualified' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {lead.status}
                        </span>
                        {isStale(lead.lastInteraction) && (
                          <span className="text-[8px] font-black bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded animate-pulse">STALE</span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase italic">
                        {lead.lastInteraction ? `Active ${new Date(lead.lastInteraction).toLocaleDateString()}` : 'No activity logged'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                        {getChannelIcon(lead.channel)}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{lead.channel}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); initiateFollowUp(lead); }}
                        className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="Neural Follow-up"
                      >
                        <Sparkles size={16} />
                      </button>
                      
                      {lead.status !== 'Qualified' ? (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleQualify(lead.id); }}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                        >
                          Qualify
                        </button>
                      ) : (
                        <div className="text-emerald-600 flex items-center justify-end space-x-1 font-black text-[10px] uppercase tracking-widest px-4 py-2">
                          <span>Won</span>
                          <ChevronRight size={14} />
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Lead Intake Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-xl tracking-tight">Neural Intake Form</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Minimum Required Properties</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-3 hover:bg-slate-200 rounded-2xl transition-all text-slate-400">
                <X size={24}/>
              </button>
            </div>
            
            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* 1. Identity & Contact */}
                <div className="col-span-full space-y-4">
                  <div className="flex items-center space-x-2">
                    <User size={16} className="text-blue-500" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">1. Identity & Contact</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Full Name *</label>
                      <input 
                        type="text" 
                        value={newLead.name}
                        onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold transition-all"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Email</label>
                      <input 
                        type="email" 
                        value={newLead.email}
                        onChange={(e) => setNewLead({...newLead, email: e.target.value})}
                        placeholder="john@voxmation.io"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold transition-all"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Phone</label>
                      <input 
                        type="text" 
                        value={newLead.phone}
                        onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                        placeholder="+1 555-0000"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Source & Attribution */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Globe size={16} className="text-emerald-500" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">2. Source & Attribution</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Source</label>
                      <select 
                        value={newLead.source}
                        onChange={(e) => setNewLead({...newLead, source: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold appearance-none cursor-pointer"
                      >
                        <option value="Inbound">Inbound (Organic)</option>
                        <option value="Paid Ads">Paid Advertising</option>
                        <option value="Outbound">Outbound (Cold)</option>
                        <option value="Referral">Referral / Partner</option>
                        <option value="Manual Entry">Manual Neural Entry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">First Touch Channel</label>
                      <select 
                        value={newLead.channel}
                        onChange={(e) => setNewLead({...newLead, channel: e.target.value as LeadChannel})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold appearance-none cursor-pointer"
                      >
                        <option value="Email">Email</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Webchat">Webchat</option>
                        <option value="Phone">Phone</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Campaign / UTM</label>
                      <input 
                        type="text" 
                        value={newLead.campaignUTM}
                        onChange={(e) => setNewLead({...newLead, campaignUTM: e.target.value})}
                        placeholder="google_search_jan_2024"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Status & Record */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Zap size={16} className="text-amber-500" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">3. Status & Record</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Lead Status</label>
                      <select 
                        value={newLead.status}
                        onChange={(e) => setNewLead({...newLead, status: e.target.value as LeadStatus})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold appearance-none cursor-pointer"
                      >
                        <option value="New">New Intake</option>
                        <option value="Engaged">Engaged / Active</option>
                        <option value="Qualified">Qualified / SDR Approved</option>
                        <option value="Disqualified">Disqualified / No Fit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Temperature</label>
                      <select 
                        value={newLead.temperature}
                        onChange={(e) => setNewLead({...newLead, temperature: e.target.value as LeadTemperature})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold appearance-none cursor-pointer"
                      >
                        <option value="Hot">Hot (High Intent)</option>
                        <option value="Warm">Warm (Exploring)</option>
                        <option value="Cold">Cold (Passive)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Created At (System Date)</label>
                      <div className="relative">
                        <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="date" 
                          value={newLead.createdAt}
                          onChange={(e) => setNewLead({...newLead, createdAt: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Notes & Content */}
                <div className="col-span-full space-y-4">
                  <div className="flex items-center space-x-2">
                    <FileText size={16} className="text-slate-400" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">4. Tactical Notes</h4>
                  </div>
                  <textarea 
                    value={newLead.notes}
                    onChange={(e) => setNewLead({...newLead, notes: e.target.value})}
                    placeholder="Capture initial pain points, goals, or critical context here..."
                    className="w-full h-32 px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all resize-none"
                  />
                </div>

                {/* 5. Neural Relationships */}
                <div className="col-span-full space-y-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center space-x-2">
                    <Link2 size={16} className="text-indigo-500" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">5. Neural Relationships (Optional)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Linked Account</label>
                      <select 
                        value={newLead.linkedAccountId}
                        onChange={(e) => setNewLead({...newLead, linkedAccountId: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold appearance-none cursor-pointer"
                      >
                        <option value="">-- No Account --</option>
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Linked Contact</label>
                      <select 
                        value={newLead.linkedContactId}
                        onChange={(e) => setNewLead({...newLead, linkedContactId: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold appearance-none cursor-pointer"
                      >
                        <option value="">-- No Contact --</option>
                        {contacts.map(con => <option key={con.id} value={con.id}>{con.firstName} {con.lastName}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Converted Deal</label>
                      <select 
                        value={newLead.convertedDealId}
                        onChange={(e) => setNewLead({...newLead, convertedDealId: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold appearance-none cursor-pointer"
                      >
                        <option value="">-- No Deal --</option>
                        {deals.map(deal => <option key={deal.id} value={deal.id}>{deal.name}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-white flex space-x-4">
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button 
                  onClick={handleAddLead}
                  className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center space-x-3 active:scale-[0.98]"
              >
                <Save size={18} />
                <span>Save Lead Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Neural Follow-up Modal */}
      {activeFollowUp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Neural Follow-up</h3>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Synthesizing personalized outreach for {activeFollowUp.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveFollowUp(null)}
                className="p-2 hover:bg-slate-200 text-slate-400 rounded-xl transition-all"
              >
                <X size={24}/>
              </button>
            </div>
            
            <div className="p-8">
              {loadingAI ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-4">
                  <Loader2 size={48} className="animate-spin text-blue-600" />
                  <p className="text-sm font-bold text-slate-500 animate-pulse uppercase tracking-[0.2em]">Crafting high-intent response...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative group">
                    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={handleCopy}
                        className="p-2 bg-white rounded-lg shadow-sm hover:text-blue-600 border border-slate-200"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">AI Draft (Personalized Context)</label>
                    <textarea 
                      className="w-full h-48 bg-transparent text-slate-700 text-sm font-serif leading-relaxed outline-none resize-none"
                      value={followUpDraft}
                      onChange={(e) => setFollowUpDraft(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
                    <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase">
                      Strategic Note: This message mentions their specific pain points to bypass standard gatekeeper filters.
                    </p>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button 
                      onClick={() => setActiveFollowUp(null)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                    >
                      Dismiss
                    </button>
                    <button 
                      onClick={sendFollowUp}
                      className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 flex items-center justify-center space-x-2 transition-all active:scale-95"
                    >
                      <MailCheck size={18} />
                      <span>Log & Simulate Send</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
