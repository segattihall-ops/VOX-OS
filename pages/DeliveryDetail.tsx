
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLiveDoc } from '../hooks/useLiveData';
import { Delivery, DeliveryStatus } from '../types';
import { 
  Rocket, ChevronRight, X, CheckCircle2, AlertCircle, 
  ShieldCheck, MessageSquare, Instagram, Globe, 
  Database, Zap, Target, ListChecks, Activity, 
  HardDrive, FileText, Save, Layout, Clock, ExternalLink,
  ChevronDown, Phone, Bot, Check, Info, Settings, Calendar
} from 'lucide-react';

export const DeliveryDetail: React.FC = () => {
  const { deliveryId } = useParams();
  const { doc: del, updateDoc } = useLiveDoc<Delivery>('deliveries', deliveryId);
  const [activeTab, setActiveTab] = useState<'intake' | 'build' | 'test' | 'monitor'>('intake');

  if (!del) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      <p className="mt-4 text-slate-500 font-medium">Loading project board...</p>
    </div>
  );

  const getStageColor = (stage: DeliveryStatus) => {
    switch (stage) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      case 'Live': return 'bg-indigo-100 text-indigo-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'QA': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const updateStage = (newStage: DeliveryStatus) => {
    updateDoc({ stage: newStage });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Strategic Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard/delivery" className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <X size={20} />
            </Link>
            <div className="h-10 w-px bg-slate-100"></div>
            <div>
               <div className="flex items-center space-x-2">
                 <h2 className="text-xl font-bold text-slate-900">{del.accountName}</h2>
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStageColor(del.stage)}`}>
                   {del.stage}
                 </span>
               </div>
               <p className="text-xs text-slate-500 mt-0.5">Project #{del.id} • {del.packageTier} Package</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timeline</p>
                <div className="flex items-center space-x-2 text-sm font-bold">
                   <Clock size={14} className="text-blue-500" />
                   <span>Promised {del.promisedTimeline}</span>
                </div>
             </div>
             <div className="h-10 w-px bg-slate-100"></div>
             <div className="flex flex-col w-32">
                <div className="flex justify-between items-center mb-1">
                   <span className="text-[10px] font-bold text-slate-400 uppercase">Progress</span>
                   <span className="text-[10px] font-bold text-emerald-600">{del.checklistProgress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${del.checklistProgress}%` }}></div>
                </div>
             </div>
             <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg">
                Complete Project
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Workspace Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col min-h-[600px]">
            {/* Tabs */}
            <div className="flex border-b border-slate-100 px-6 pt-2 overflow-x-auto scrollbar-hide">
                {[
                  { id: 'intake', label: '1) Intake & Access', icon: <Target size={18} /> },
                  { id: 'build', label: '2) Build & Prompt', icon: <Bot size={18} /> },
                  { id: 'test', label: '3) Test & QA', icon: <ListChecks size={18} /> },
                  { id: 'monitor', label: '4) Monitor & Hypercare', icon: <Activity size={18} /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-6 py-5 text-sm font-bold transition-all relative whitespace-nowrap ${
                      activeTab === tab.id ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {activeTab === tab.id && <div className="absolute bottom-0 left-4 right-4 h-1 bg-emerald-600 rounded-t-full"></div>}
                  </button>
                ))}
            </div>

            <div className="flex-1 p-8">
               {activeTab === 'intake' && (
                  <div className="space-y-8 animate-in fade-in">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Kickoff Section */}
                        <div className="space-y-4">
                           <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Kickoff Checklist</h4>
                           <div className="space-y-2">
                              {[
                                'Kickoff call scheduled',
                                'Measurable outcome target defined',
                                'Included channels confirmed',
                                'Business rules & hours confirmed',
                                'FAQ & Objections list received',
                                'Tone of voice defined (PT/EN)'
                              ].map(item => (
                                <div key={item} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                   <span className="text-xs font-medium text-slate-600">{item}</span>
                                   <div className="h-5 w-5 rounded-full border-2 border-emerald-200 flex items-center justify-center text-emerald-500">
                                      <Check size={12} />
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>

                        {/* Access Section */}
                        <div className="space-y-4">
                           <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Access Status</h4>
                           <div className="grid grid-cols-1 gap-2">
                              {[
                                { id: 'waAccess', label: 'WhatsApp', icon: <MessageSquare size={14}/> },
                                { id: 'igAccess', label: 'Instagram', icon: <Instagram size={14}/> },
                                { id: 'twilioAccess', label: 'Twilio/Voice', icon: <Phone size={14}/> },
                                { id: 'crmAccess', label: 'CRM Access', icon: <Database size={14}/> },
                                { id: 'gCalAccess', label: 'Google Calendar', icon: <Clock size={14}/> }
                              ].map(item => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                                   <div className="flex items-center space-x-3">
                                      <div className="text-slate-400">{item.icon}</div>
                                      <span className="text-xs font-bold text-slate-700">{item.label}</span>
                                   </div>
                                   <select 
                                      value={del[item.id as keyof Delivery] as string}
                                      onChange={(e) => updateDoc({ [item.id]: e.target.value })}
                                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg outline-none border ${
                                        del[item.id as keyof Delivery] === 'Received' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                        del[item.id as keyof Delivery] === 'Needed' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                                      }`}
                                   >
                                      <option value="Needed">Needed</option>
                                      <option value="Received">Received</option>
                                      <option value="N/A">N/A</option>
                                   </select>
                                </div>
                              ))}
                           </div>
                           <div className="p-4 bg-slate-900 rounded-2xl text-white">
                              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Credentials Vault</p>
                              <div className="flex items-center justify-between">
                                 <p className="text-xs font-mono opacity-60">Locked in 1Password...</p>
                                 <ExternalLink size={14} className="text-blue-400" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'build' && (
                  <div className="space-y-8 animate-in slide-in-from-right-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                           <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">AI Prompt System (The Brain)</h4>
                           <div className="space-y-4">
                              <div>
                                 <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Business Summary</label>
                                 <textarea 
                                    className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-serif outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Brief describe what the company does..."
                                    defaultValue={del.businessSummary}
                                    onBlur={(e) => updateDoc({ businessSummary: e.target.value })}
                                 ></textarea>
                              </div>
                              <div>
                                 <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Offer Summary</label>
                                 <textarea 
                                    className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-serif outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="The main conversion offer..."
                                    defaultValue={del.offerSummary}
                                    onBlur={(e) => updateDoc({ offerSummary: e.target.value })}
                                 ></textarea>
                              </div>
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                              <h4 className="text-sm font-bold text-emerald-800 mb-4 flex items-center">
                                 <Zap size={18} className="mr-2" />
                                 Build Checklist
                              </h4>
                              <div className="space-y-3">
                                 {[
                                    'Main flow drawn',
                                    'Prompt System configured',
                                    'Tags + intents defined',
                                    'Bot scope defined',
                                    'Fallback to human enabled',
                                    'Logs & reporting active'
                                 ].map(item => (
                                    <div key={item} className="flex items-center space-x-3 text-xs text-emerald-900 font-medium">
                                       <div className="h-4 w-4 rounded bg-white border border-emerald-200 flex items-center justify-center">
                                          <Check size={10} />
                                       </div>
                                       <span>{item}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'test' && (
                  <div className="space-y-8 animate-in slide-in-from-right-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">QA Checklist (Mandatory)</h4>
                           <div className="space-y-2">
                              {[
                                'Entry test per channel (WA/IG/Site)',
                                'Q1-Q4 qualification flow test',
                                'DNA Score accuracy test',
                                'Follow-up cadence (1h/24h) test',
                                'Human handoff trigger test',
                                'CRM record sync test',
                                'Error handling (fallback) test'
                              ].map(item => (
                                <div key={item} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
                                   <span className="text-xs font-medium text-slate-600">{item}</span>
                                   <div className="h-5 w-5 rounded-full border-2 border-emerald-200 flex items-center justify-center text-emerald-500">
                                      <Check size={12} />
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                        <div className="space-y-6">
                           <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={100} /></div>
                              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6">QA Intelligence Report</h4>
                              <div className="space-y-8">
                                 <div>
                                    <div className="flex justify-between items-end mb-2">
                                       <span className="text-xs font-bold uppercase opacity-60">Pass Rate</span>
                                       <span className="text-2xl font-bold">{del.qaPassRate || 0}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                       <div className="h-full bg-emerald-400" style={{ width: `${del.qaPassRate || 0}%` }}></div>
                                    </div>
                                 </div>
                                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-[10px] font-bold text-white/40 uppercase mb-2">Top Issues Found</p>
                                    <ul className="text-xs space-y-1 opacity-80">
                                       <li>• Niche mismatch in complex edge cases</li>
                                       <li>• Delay in WA Cloud API (fixed)</li>
                                    </ul>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'monitor' && (
                  <div className="space-y-8 animate-in slide-in-from-bottom-4">
                     <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100 flex items-center space-x-4">
                        <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-lg"><Activity size={20} /></div>
                        <div>
                          <h4 className="font-bold text-rose-900 uppercase text-xs tracking-widest">Hypercare Phase (30 Days)</h4>
                          <p className="text-xs text-rose-700 font-medium">Monitoring conversations daily to refine prompt accuracy.</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { label: 'Avg SLA Response', val: del.kpiSlaResponse || '0.8 min', icon: <Clock className="text-blue-500"/> },
                          { label: 'Qualified Rate', val: del.kpiQualifiedRate || '74%', icon: <Target className="text-emerald-500"/> },
                          { label: 'Meeting Booked', val: del.kpiMeetingRate || '12%', icon: <Calendar className="text-purple-500"/> }
                        ].map((kpi, i) => (
                           <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
                              <div className="p-3 bg-slate-50 rounded-2xl w-fit mx-auto mb-4">{kpi.icon}</div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                              <p className="text-2xl font-black text-slate-900">{kpi.val}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
          </div>
        </div>

        {/* Info Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-6">Kickoff Summary</h4>
              <div className="space-y-6">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Outcome Target</p>
                    <p className="text-sm font-bold text-slate-900 leading-relaxed">{del.outcomeTarget || 'Not defined'}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Primary Channel</p>
                       <p className="text-sm font-bold text-slate-900">{del.primaryChannel}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Success Metric</p>
                       <p className="text-sm font-bold text-slate-900">{del.successMetric}</p>
                    </div>
                 </div>
                 <div className="pt-6 border-t border-slate-50">
                    <button onClick={() => updateDoc({ checklistProgress: 100 })} className="w-full py-3 bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold hover:bg-slate-100 transition-all">
                       Edit Kickoff Notes
                    </button>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-emerald-600 rounded-3xl text-white shadow-xl shadow-emerald-100">
              <h4 className="font-bold text-sm mb-4 flex items-center">
                 <ShieldCheck size={18} className="mr-2" />
                 Definition of Done
              </h4>
              <ul className="space-y-3">
                 {[
                   'Flow working in production',
                   'Logs & reports active',
                   'Client trained (20 min sync)',
                   'Handover docs delivered',
                   'Optimization call scheduled'
                 ].map(item => (
                   <li key={item} className="flex items-start space-x-3 text-xs opacity-90">
                      <div className="h-4 w-4 bg-white/20 rounded flex items-center justify-center mt-0.5"><Check size={10} /></div>
                      <span>{item}</span>
                   </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};
