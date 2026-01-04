import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLiveDoc, useLiveCollection } from '../hooks/useLiveData';
import { 
  Account, Opportunity, Delivery, Contact, 
  Activity, SupportTicket, Subscription
} from '../types';
import { AutomationService } from '../services/automationService';
import { 
  Building2, ChevronRight, X, ShieldCheck, Heart, 
  TrendingUp, Rocket, CreditCard, MessageSquare, 
  Target, Zap, AlertTriangle, FileText, Globe, 
  Clock, Mail, Phone, Plus, ArrowUpRight,
  Briefcase, Users, History, ShieldAlert, CheckCircle2,
  Calendar, Layers, ClipboardList, Sparkles, ClipboardCheck
} from 'lucide-react';

export const AccountDetail: React.FC = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const { doc: acc, updateDoc } = useLiveDoc<Account>('accounts', accountId || '');
  const { data: allDeals } = useLiveCollection<Opportunity>('opportunities');
  const { data: allDeliveries } = useLiveCollection<Delivery>('deliveries');
  const { data: allContacts } = useLiveCollection<Contact>('contacts');
  const { data: allActivities } = useLiveCollection<Activity>('activities');
  const { data: allTickets } = useLiveCollection<SupportTicket>('tickets');
  const { data: allSubscriptions } = useLiveCollection<Subscription>('subscriptions');
  
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'deals' | 'deliveries' | 'playbooks' | 'support' | 'billing'>('overview');

  if (!acc) {
    return (
      <div className="p-12 text-center animate-pulse">
        <p className="text-lg font-medium text-slate-500">Syncing Entity 360...</p>
      </div>
    );
  }

  const deals = allDeals.filter(d => d.accountId === acc.id);
  const deliveries = allDeliveries.filter(d => d.accountId === acc.id);
  const contacts = allContacts.filter(c => c.accountId === acc.id);
  const activities = allActivities.filter(a => a.accountId === acc.id);
  const tickets = allTickets.filter(t => t.accountId === acc.id);
  const subscriptions = allSubscriptions.filter(s => s.accountId === acc.id);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 55) return 'text-amber-500';
    return 'text-rose-500';
  };

  const handleHealthRefresh = () => {
    AutomationService.runHealthAudit();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Entity Header Hub */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 bg-slate-50/20 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center space-x-8">
            <div className="h-24 w-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-2xl group-hover:rotate-3 transition-transform">
              {acc.name[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{acc.name}</h2>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] ${
                  acc.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {acc.status}
                </span>
              </div>
              <div className="flex items-center space-x-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center space-x-2"><Globe size={16} /><span>{acc.industry}</span></div>
                <div className="flex items-center space-x-2"><Target size={16} /><span>Tier {acc.icpTier}</span></div>
                <div className="flex items-center space-x-2"><ShieldCheck size={16} /><span>{acc.lifecycle}</span></div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-12">
            <div className="text-center cursor-pointer group" onClick={handleHealthRefresh}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 group-hover:text-indigo-600 transition-colors">Neural Health</p>
              <div className="flex items-center space-x-2">
                <Heart size={24} className={`${getHealthColor(acc.healthScore)} fill-current`} />
                <span className={`text-3xl font-black ${getHealthColor(acc.healthScore)}`}>{acc.healthScore}</span>
              </div>
            </div>
            <div className="h-16 w-px bg-slate-100"></div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Verified MRR</p>
              <p className="text-3xl font-black text-slate-900">${acc.currentMrr.toLocaleString()}</p>
            </div>
            <button className="bg-slate-900 text-white px-8 py-4 rounded-[1.25rem] font-black text-sm shadow-2xl hover:bg-indigo-600 transition-all flex items-center space-x-3 active:scale-95">
              <Zap size={20} className="text-blue-400" />
              <span>COMMAND</span>
            </button>
          </div>
        </div>

        <div className="px-10 py-4 bg-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <History size={20} className="text-blue-200" />
            <p className="text-sm font-bold tracking-tight">
              <span className="opacity-60 mr-2 uppercase text-[10px] tracking-widest">Last Activity:</span>
              {acc.lastActivityAt ? new Date(acc.lastActivityAt).toLocaleString() : 'System Initialized'}
            </p>
          </div>
          <div className="flex space-x-4">
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-lg">Fit Score: {acc.fitScore}%</span>
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-lg">Expansion: {acc.expansionPotential}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col min-h-[650px]">
            <div className="flex border-b border-slate-100 px-10 pt-2 overflow-x-auto scrollbar-hide">
              {[
                { id: 'overview', label: 'Summary', icon: <Layers size={20} /> },
                { id: 'contacts', label: 'Stakeholders', icon: <Users size={20} /> },
                { id: 'deals', label: 'Pipeline', icon: <Briefcase size={20} /> },
                { id: 'deliveries', label: 'Execution', icon: <Rocket size={20} /> },
                { id: 'playbooks', label: 'Playbooks', icon: <ClipboardList size={20} /> },
                { id: 'support', label: 'Support', icon: <ShieldAlert size={20} /> },
                { id: 'billing', label: 'Financial', icon: <CreditCard size={20} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-3 px-8 py-6 text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                    activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <div className="absolute bottom-0 left-6 right-6 h-1 bg-indigo-600 rounded-t-full"></div>}
                </button>
              ))}
            </div>

            <div className="flex-1 p-12">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 animate-in fade-in">
                  <div className="md:col-span-2 space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Internal Team</h4>
                        <div className="space-y-5">
                          <div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500">Sales Owner</span><span className="text-xs font-black text-slate-900">{acc.salesOwner || 'Unassigned'}</span></div>
                          <div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500">Delivery Lead</span><span className="text-xs font-black text-slate-900">{acc.deliveryOwner || 'Unassigned'}</span></div>
                          <div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500">CS Champion</span><span className="text-xs font-black text-indigo-600">{acc.csOwner || 'Unassigned'}</span></div>
                        </div>
                      </div>
                      <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Financial Specs</h4>
                        <div className="space-y-5">
                          <div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500">Renewal Date</span><span className="text-xs font-black text-slate-900">{acc.renewalDate || 'N/A'}</span></div>
                          <div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-500">Plan Tier</span><span className="text-xs font-black text-slate-900">{acc.plan || 'Standard'}</span></div>
                          <div className="flex items-center justify-between"><span className="text-xs font-black text-emerald-600">Active (Paid)</span></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl group">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Entity Strategy Brief</h4>
                        <Sparkles size={18} className="text-blue-400 group-hover:rotate-12 transition-transform" />
                      </div>
                      <p className="text-lg text-slate-300 leading-relaxed font-serif italic">
                        "{acc.name} represents a high-potential {acc.industry} account. Current focus is transitioning from Onboarding to {acc.lifecycle}. Expansion potential is {acc.expansionPotential} based on recent volume signals."
                      </p>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className={`p-8 rounded-[2rem] border ${acc.healthStatus === 'Red' ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                      <h4 className={`text-[10px] font-black uppercase tracking-widest mb-6 ${acc.healthStatus === 'Red' ? 'text-rose-600' : 'text-emerald-600'}`}>Real-time Pulse</h4>
                      <p className="text-sm font-bold text-slate-700 mb-6 leading-relaxed">
                        {acc.healthStatus === 'Red' ? 'Critical health alert triggered. Recovery Playbook mandatory.' : 'Account pulse is stable. Proactive QBR scheduled for next milestone.'}
                      </p>
                      {acc.healthStatus === 'Red' && (
                        <button className="w-full py-4 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-100">Deploy Recovery Protocol</button>
                      )}
                    </div>
                    <div className="p-8 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-100">
                      <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 text-blue-100">Next Strategic Best Action</h4>
                      <p className="text-sm font-black mb-4">Validate First Value Realization with Champion</p>
                      <button className="text-[10px] font-black uppercase bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all">Mark Done</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contacts' && (
                <div className="space-y-6 animate-in slide-in-from-right-4">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entity Stakeholders</h4>
                    <button className="flex items-center space-x-2 text-xs font-black text-indigo-600 hover:scale-105 transition-transform uppercase tracking-widest">
                      <Plus size={16}/><span>Register Stakeholder</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {contacts.length > 0 ? contacts.map(contact => (
                      <div key={contact.id} className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-indigo-400 hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-500 text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              {contact.firstName[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="text-lg font-black text-slate-900 leading-tight">{contact.firstName} {contact.lastName}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{contact.roleTitle}</p>
                            </div>
                          </div>
                          {contact.isPrimary && <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Primary Hub</span>}
                        </div>
                        <div className="flex flex-col space-y-3 pt-6 border-t border-slate-50">
                          <div className="flex items-center space-x-3 text-xs text-slate-600 font-bold"><Mail size={14} className="text-slate-300"/> <span>{contact.email}</span></div>
                          <div className="flex items-center space-x-3 text-xs text-slate-600 font-bold"><Phone size={14} className="text-slate-300"/> <span>{contact.phone || 'N/A'}</span></div>
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-2 p-12 text-center text-slate-400">
                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No contacts registered yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'playbooks' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Playbooks</h4>
                    <button className="flex items-center space-x-2 text-xs font-black text-slate-900 bg-slate-100 px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-slate-200">
                      <Plus size={16}/><span>Trigger Playbook</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                      <ClipboardCheck size={48} className="text-slate-200 mb-4" />
                      <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No active playbooks for this entity.</p>
                      <p className="text-[10px] text-slate-300 uppercase tracking-widest mt-2">Closed Won automation will deploy Onboarding automatically.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};