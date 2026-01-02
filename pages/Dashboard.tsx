
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useLiveCollection } from '../hooks/useLiveData';
import { Opportunity, Account, Subscription } from '../types';
import { 
  TrendingUp, Users, Briefcase, 
  Clock, AlertTriangle, ShieldCheck, 
  Zap, ArrowUpRight, DollarSign 
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: accounts } = useLiveCollection<Account>('accounts');
  const { data: deals } = useLiveCollection<Opportunity>('opportunities');
  const { data: subs } = useLiveCollection<Subscription>('subscriptions');

  const totalMrr = subs.reduce((sum, s) => s.status === 'Active' ? sum + s.mrr : sum, 0);
  const totalPipeline = deals.reduce((sum, d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost' ? sum + d.mrr : sum, 0);
  const atRiskCount = accounts.filter(a => a.healthStatus === 'Red').length;
  const staleDealsCount = deals.filter(d => {
    if (!d.lastActivityAt) return true;
    const diff = Date.now() - new Date(d.lastActivityAt).getTime();
    return diff > 14 * 24 * 60 * 60 * 1000;
  }).length;

  const funnelData = [
    { stage: 'Discovery', value: deals.filter(d => d.stage === 'Discovery').length },
    { stage: 'Qualified', value: deals.filter(d => d.stage === 'Qualified').length },
    { stage: 'Proposal', value: deals.filter(d => d.stage === 'Proposal').length },
    { stage: 'Negotiation', value: deals.filter(d => d.stage === 'Negotiation').length },
    { stage: 'Won', value: deals.filter(d => d.stage === 'Closed Won').length }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Executive Summary</h2>
          <p className="text-slate-500">Voxmation Global Health & Growth Metrics.</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-400 uppercase tracking-widest">
          Last Neural Refresh: Just Now
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign size={20}/></div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+14%</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">${totalMrr.toLocaleString()}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Current Active MRR</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp size={20}/></div>
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Forecast: $120k</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">${totalPipeline.toLocaleString()}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Weighted Pipeline</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><AlertTriangle size={20}/></div>
            <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Critical</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{atRiskCount}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Accounts At Risk</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Clock size={20}/></div>
            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Needs Re-engage</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">{staleDealsCount}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Stale Deals (>14d)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Sales Funnel Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="stage" type="category" width={100} axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={120} /></div>
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Priority Command Log</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">New MRR expansion detected from Acme Corp</span>
                </div>
                <ArrowUpRight size={16} className="text-emerald-500" />
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-rose-500 rounded-full"></div>
                  <span className="text-sm font-medium">Subscription Past Due: TechFlow Solutions</span>
                </div>
                <AlertTriangle size={16} className="text-rose-500" />
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">3 Onboarding Playbooks nearing go-live SLA</span>
                </div>
                <Clock size={16} className="text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
