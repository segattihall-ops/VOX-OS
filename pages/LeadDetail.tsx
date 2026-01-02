
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLiveDoc } from '../hooks/useLiveData';
import { Lead, LeadStatus, LeadTemperature } from '../types';
import { 
  generateLeadInsights, 
  generateObjectionHandling, 
  generateSalesInsights 
} from '../services/geminiService';
import { 
  Phone, Mail, Globe, MapPin, Sparkles, Send, 
  MessageSquare, History, PhoneCall, Mic, MicOff, 
  Volume2, X, ShieldAlert, TrendingUp, Save, BrainCircuit,
  Copy, Check, Target, Clock, DollarSign, Briefcase, Zap, Loader2,
  Tag, Info, Languages, CreditCard, ChevronRight, FileText, AlertCircle, Edit2, User, Building2,
  CheckCircle2, ListChecks, MessageSquareText, Ban
} from 'lucide-react';

export const LeadDetail: React.FC = () => {
  const { leadId } = useParams();
  const { doc: lead, updateDoc } = useLiveDoc<Lead>('leads', leadId);
  const [activeTab, setActiveTab] = useState<'intel' | 'checklist' | 'library' | 'ai' | 'handoff'>('intel');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiToolLabel, setAiToolLabel] = useState<string>("AI Intelligence Area");
  const [copied, setCopied] = useState<string | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});

  useEffect(() => {
    if (lead) {
      setEditForm({
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        company: lead.company,
        website: lead.website,
        language: lead.language,
        status: lead.status,
        temperature: lead.temperature,
        dnaScore: lead.dnaScore,
        nextAction: lead.nextAction
      });
    }
  }, [lead, isEditModalOpen]);

  if (!lead) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-slate-500 font-medium">Synchronizing lead data...</p>
    </div>
  );

  const handleSaveContact = async () => {
    await updateDoc(editForm);
    setIsEditModalOpen(false);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAiNeuroDraft = async () => {
    setLoadingAi(true);
    setAiToolLabel("Neuro-Draft Outreach Email");
    const result = await generateLeadInsights(lead.name, lead.company || '', lead.painPoints || []);
    setAiResponse(result);
    setLoadingAi(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header Strategy Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard/leads" className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
            <X size={20} />
          </Link>
          <div className="h-12 w-px bg-slate-100 hidden sm:block"></div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
              <button onClick={() => setIsEditModalOpen(true)} className="p-1 text-slate-300 hover:text-blue-600 transition-colors">
                <Edit2 size={14} />
              </button>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                lead.temperature === 'Hot' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {lead.temperature}
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-0.5">
              <span className="text-xs text-slate-500">{lead.company || 'Private Entity'}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-blue-600">{lead.status}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right mr-4 hidden md:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Action</p>
            <p className="text-sm font-bold text-slate-900">{lead.nextAction}</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center space-x-2">
            <Zap size={16} />
            <span>Convert Lead</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Profile & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Identity Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-3xl font-bold shadow-xl">
                  {lead.name[0]}
                </div>
                <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                  {lead.dnaScore}
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-xl">{lead.name}</h3>
              <p className="text-sm text-slate-500 mb-6">{lead.company || 'Private Entity'}</p>
              
              <div className="grid grid-cols-2 gap-2 w-full">
                <button 
                  onClick={() => handleCopy(lead.phone || '', 'phone')}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group"
                >
                  <Phone size={18} className="text-slate-400 group-hover:text-blue-600 mb-1" />
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-900">{copied === 'phone' ? 'Copied!' : 'Call'}</span>
                </button>
                <button 
                  onClick={() => handleCopy(lead.email || '', 'email')}
                  className="flex flex-col items-center justify-center p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group"
                >
                  <Mail size={18} className="text-slate-400 group-hover:text-blue-600 mb-1" />
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-900">{copied === 'email' ? 'Copied!' : 'Email'}</span>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Channel</span>
                  <span className="text-xs font-bold text-slate-900">{lead.channel}</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Source</span>
                  <span className="text-xs font-bold text-slate-500 truncate ml-4" title={lead.sourceDetail}>{lead.sourceDetail}</span>
               </div>
               <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <span className="text-xs font-bold text-slate-400 uppercase">Urgency</span>
                  <span className={`text-xs font-bold ${lead.urgency.includes('Now') ? 'text-rose-600' : 'text-slate-900'}`}>{lead.urgency}</span>
               </div>
               <div className="pt-2">
                 <button onClick={() => setIsEditModalOpen(true)} className="w-full py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
                    Edit Identity & Details
                 </button>
               </div>
            </div>
          </div>

          {/* Quick Qualification Summary Card */}
          <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><Target size={80} /></div>
             <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Qualification Snapshot</h4>
             <div className="space-y-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                   <p className="text-[10px] font-bold text-white/40 uppercase mb-1">One-line Summary</p>
                   <p className="text-xs font-medium italic">"Lead is {lead.niche}, has {lead.mainPain} pain, wants to solve in {lead.urgency}."</p>
                </div>
                <div className="flex items-center justify-between text-xs">
                   <span className="text-white/40">DNA Score</span>
                   <span className="font-bold text-rose-400">{lead.dnaScore}/100</span>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column - Work Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col min-h-[700px]">
             {/* Navigation Tabs */}
             <div className="flex border-b border-slate-100 px-6 pt-2 overflow-x-auto scrollbar-hide">
                {[
                  { id: 'intel', label: 'Lead Intel', icon: <Target size={18} /> },
                  { id: 'checklist', label: 'Checklist', icon: <ListChecks size={18} /> },
                  { id: 'library', label: 'Library', icon: <MessageSquareText size={18} /> },
                  { id: 'ai', label: 'AI Strategy', icon: <BrainCircuit size={18} /> },
                  { id: 'handoff', label: 'Handoff Card', icon: <FileText size={18} /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-5 text-sm font-bold transition-all relative whitespace-nowrap ${
                      activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {activeTab === tab.id && <div className="absolute bottom-0 left-4 right-4 h-1 bg-blue-600 rounded-t-full"></div>}
                  </button>
                ))}
             </div>

             <div className="flex-1 p-8">
                {activeTab === 'intel' && (
                   <div className="space-y-8 animate-in fade-in">
                      {/* Section 1: Quick Qualification */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="col-span-full">
                            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">1) Quick Qualification (4 Questions)</h4>
                         </div>
                         <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                            <button onClick={() => setIsEditModalOpen(true)} className="absolute top-4 right-4 text-slate-300 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"><Edit2 size={12} /></button>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Q1 — Niche / Segment</p>
                            <p className="font-bold text-slate-900">{lead.niche}</p>
                         </div>
                         <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Q2 — Main Pain Point</p>
                            <p className="font-bold text-slate-900 capitalize">{lead.mainPain}</p>
                         </div>
                         <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Q3 — Urgency</p>
                            <p className="font-bold text-slate-900">{lead.urgency}</p>
                         </div>
                         <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Q4 — Authority</p>
                            <p className="font-bold text-slate-900">{lead.authority}</p>
                         </div>
                      </div>

                      {/* Section 2: Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="col-span-full">
                            <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">2) Details (Account Context)</h4>
                         </div>
                         <div className="p-5 border border-slate-100 rounded-2xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Company Size</p>
                            <p className="font-bold text-slate-900">{lead.companySize || '—'}</p>
                         </div>
                         <div className="p-5 border border-slate-100 rounded-2xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Lead Volume</p>
                            <p className="font-bold text-slate-900">{lead.leadVolume || '—'}</p>
                         </div>
                         <div className="col-span-full p-5 border border-slate-100 rounded-2xl">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Current Stack</p>
                            <div className="flex flex-wrap gap-2">
                               {lead.currentStack?.map(s => (
                                  <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-100">{s}</span>
                               ))}
                            </div>
                         </div>
                      </div>

                      {/* Section 3: Conversation Summary */}
                      <div className="space-y-4">
                         <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">3) Conversation Summary</h4>
                         <textarea 
                            className="w-full h-32 p-4 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-serif"
                            placeholder="Brief context: They want [result], currently losing [X] because of [Y]..."
                            defaultValue={lead.conversationSummary}
                            onBlur={(e) => updateDoc({ conversationSummary: e.target.value })}
                         ></textarea>
                      </div>
                   </div>
                )}

                {activeTab === 'checklist' && (
                   <div className="space-y-8 animate-in slide-in-from-right-4">
                      <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                         <h4 className="text-sm font-bold text-emerald-800 mb-4 flex items-center">
                            <CheckCircle2 size={18} className="mr-2" />
                            Qualified Checklist (Required for Conversion)
                         </h4>
                         <div className="space-y-4">
                            {[
                               { label: 'Niche Defined', status: !!lead.niche },
                               { label: 'Clear Pain Defined', status: !!lead.mainPain },
                               { label: 'Urgency Defined', status: lead.urgency !== 'Research only' },
                               { label: 'Authority (DM or path to DM)', status: lead.authority === 'Decision maker' || lead.authority === 'Influencer' },
                               { label: 'Next Action Scheduled', status: !!lead.nextAction },
                               { label: 'Score Updated (min 80)', status: lead.dnaScore >= 80 }
                            ].map((item, i) => (
                               <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-emerald-100">
                                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                                  {item.status ? <Check className="text-emerald-500" size={18} /> : <div className="h-5 w-5 rounded-full border-2 border-slate-200"></div>}
                               </div>
                            ))}
                         </div>
                      </div>
                      
                      <button 
                        disabled={lead.dnaScore < 80}
                        className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-emerald-100"
                      >
                         <Zap size={20} />
                         <span>Checklist Complete — Ready to Sell</span>
                      </button>
                   </div>
                )}

                {activeTab === 'library' && (
                   <div className="space-y-6 animate-in slide-in-from-right-4">
                      <div className="flex items-center justify-between mb-4">
                         <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Message Library (Voxmation Standard)</h4>
                         <Languages size={18} className="text-slate-400" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {[
                            { label: 'Standard Greeting (EN)', text: `Hi! 👋 This is Voxmation. We noticed your interest in AI automation. What's your current biggest bottleneck: support, sales, or calls?` },
                            { label: 'Discovery Invitation (EN)', text: `Based on your setup, we can definitely automate your inbound flow to improve response times. Would you like to schedule a 15-minute sync?` },
                            { label: 'Proposal Follow-up (EN)', text: `Just checking in if you were able to review the proposal. Happy to hop on a call to clarify any technical points.` },
                            { label: 'Budget Objection (EN)', text: `I understand price is a factor. We have two routes: a core lean version or the full voice + automation stack. Which fits your current priority?` },
                            { label: 'Integrations Note (EN)', text: `Yes, we can sync directly with your existing CRM. We've handled similar stacks before without downtime.` }
                         ].map((msg, i) => (
                            <div key={i} className="group p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-400 transition-all cursor-pointer relative" onClick={() => handleCopy(msg.text, `msg-${i}`)}>
                               <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">{msg.label}</p>
                               <p className="text-xs text-slate-700 leading-relaxed italic pr-8 line-clamp-2">"{msg.text}"</p>
                               <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all">
                                  {copied === `msg-${i}` ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-blue-500" />}
                                </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}

                {activeTab === 'ai' && (
                   <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                      <div className="flex space-x-2">
                        <button onClick={handleAiNeuroDraft} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-blue-700 shadow-lg shadow-blue-100">
                          <Sparkles size={18} />
                          <span>Neuro-Draft Outreach</span>
                        </button>
                        <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-slate-800">
                          <ShieldAlert size={18} />
                          <span>Objection Rebuttals</span>
                        </button>
                      </div>
                      
                      {loadingAi && (
                        <div className="flex flex-col items-center justify-center p-12 space-y-4">
                          <Loader2 size={40} className="animate-spin text-blue-500" />
                          <p className="text-slate-500 font-medium italic">Gemini is synthesizing high-intent strategies...</p>
                        </div>
                      )}

                      {aiResponse && !loadingAi && (
                        <div className="p-8 bg-slate-900 rounded-3xl text-slate-100 font-serif text-lg leading-relaxed shadow-2xl relative group">
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleCopy(aiResponse || '', 'ai-res')} className="p-2 bg-white/10 rounded-lg hover:bg-white/20">
                              {copied === 'ai-res' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                            </button>
                          </div>
                          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">{aiToolLabel}</p>
                          {aiResponse}
                        </div>
                      )}
                   </div>
                )}

                {activeTab === 'handoff' && (
                  <div className="space-y-6 animate-in fade-in">
                    <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 flex items-center space-x-4">
                      <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-lg"><FileText size={20} /></div>
                      <div>
                        <h4 className="font-bold text-rose-900">Mandatory Handoff Card</h4>
                        <p className="text-xs text-rose-700/60 uppercase font-bold">Fill before closing the deal to ensure delivery success.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Target Outcome (The "Win")</label>
                          <textarea className="w-full h-32 p-4 border border-slate-200 rounded-2xl text-sm" placeholder="e.g. Reduce support response time by 80% and scale WhatsApp sales..."></textarea>
                       </div>
                       <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Scope & Deadlines</label>
                          <textarea className="w-full h-32 p-4 border border-slate-200 rounded-2xl text-sm" placeholder="e.g. Voice AI implementation for inbound calls, go-live in 14 days..."></textarea>
                       </div>
                    </div>
                    <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl">
                       Confirm Handoff & Commit
                    </button>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Modern Edit Contact Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Edit Contact Profile</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Identification</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl transition-all text-slate-400"><X size={20}/></button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Phone</label>
                  <input 
                    type="text" 
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
                  <input 
                    type="email" 
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Company</label>
                  <input 
                    type="text" 
                    value={editForm.company || ''}
                    onChange={(e) => setEditForm({...editForm, company: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                  />
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Language</label>
                   <select 
                      value={editForm.language}
                      onChange={(e) => setEditForm({...editForm, language: e.target.value as any})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                   >
                      <option value="PT">Portuguese (PT)</option>
                      <option value="EN">English (EN)</option>
                   </select>
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status</label>
                   <select 
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value as LeadStatus})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                   >
                      <option value="New">New</option>
                      <option value="Engaged">Engaged</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Disqualified">Disqualified</option>
                   </select>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white">
                <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all">Cancel</button>
                <button onClick={handleSaveContact} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center space-x-2">
                  <Save size={18} />
                  <span>Update Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
