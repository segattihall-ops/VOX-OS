
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, Legend, 
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { useLiveCollection } from '../hooks/useLiveData';
import { Lead, Opportunity, Account, Delivery } from '../types';
import { 
  TrendingUp, TrendingDown, Users, Briefcase, 
  Zap, Clock, Target, AlertTriangle, ShieldCheck,
  ChevronDown, Filter, Download, LayoutDashboard, Rocket
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Reports: React.FC = () => {
  const [activeView, setActiveView] = useState<'ceo' | 'sales' | 'delivery' | 'cs'>('ceo');
  const { data: accounts } = useLiveCollection<Account>('accounts');
  const { data: leads } = useLiveCollection<Lead>('leads');
  const { data: opportunities } = useLiveCollection<Opportunity>('opportunities');
  const { data: deliveries } = useLiveCollection<Delivery>('deliveries');

  // CEO View KPIs
  const totalMRR = accounts.reduce((sum, acc) => sum + (acc.mrr || 0), 0);
  const avgHealth = accounts.reduce((sum, acc) => sum + acc.healthScore, 0) / (accounts.length || 1);
  const onTimeRate = (deliveries.filter(d => d.onTime).length / (deliveries.length || 1)) * 100;

  const funnelData = [
    { name: 'Leads', val: leads.length, fill: '#3b82f6' },
    { name: 'Qualified', val: leads.filter(l => l.status === 'Qualified').length, fill: '#10b981' },
    { name: 'Deals', val: opportunities.length, fill: '#8b5cf6' },
    { name: 'Won', val: opportunities.filter(o => o.stage === 'Closed Won').length, fill: '#f59e0b' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Intelligence Hub</h2>
          <p className="text-slate-500">Transforming operation into actionable numbers.</p>
        </div>
        <div className="flex space-x-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {[
            { id: 'ceo', label: 'Executive', icon: <LayoutDashboard size={16}/> },
            { id: 'sales', label: 'Sales', icon: <TrendingUp size={16}/> },
            { id: 'delivery', label: 'Delivery', icon: <Rocket size={16}/> },
            { id: 'cs', label: 'Success', icon: <ShieldCheck size={16}/> }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeView === view.id ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {view.icon}
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeView === 'ceo' && (
        <div className="space-y-8">
          {/* Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Monthly Revenue (MRR)', val: `$${totalMRR.toLocaleString()}`, change: '+12.5%', up: true, icon: <TrendingUp className="text-emerald-500"/> },
              { label: 'Avg Health Score', val: `${avgHealth.toFixed(0)}%`, change: '-2.1%', up: false, icon: <ShieldCheck className="text-blue-500"/> },
              { label: 'Active Pipeline', val: `$${(opportunities.reduce((s,o) => s+o.mrr, 0) / 1000).toFixed(1)}k`, change: '+8%', up: true, icon: <Briefcase className="text-purple-500"/> },
              { label: 'Delivery On-Time', val: `${onTimeRate.toFixed(0)}%`, change: 'Stable', up: true, icon: <Clock className="text-orange-500"/> }
            ].map((kpi, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-slate-50 rounded-lg">{kpi.icon}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${kpi.up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {kpi.change}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-slate-900">{kpi.val}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Conversion Funnel */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Global Conversion Funnel</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px'}} />
                    <Bar dataKey="val" radius={[0, 8, 8, 0]} barSize={40}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Critical Alerts */}
            <div className="space-y-4">
               <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest px-2">Action Required (Neural Detection)</h3>
               {[
                 { title: 'Deals stalled > 14 days', val: '4 Opportunities', icon: <Clock className="text-amber-500"/>, color: 'border-amber-100 bg-amber-50/30' },
                 { title: 'Accounts At Risk (Health < 40)', val: accounts.filter(a => a.healthScore < 40).length + ' Accounts', icon: <AlertTriangle className="text-rose-500"/>, color: 'border-rose-100 bg-rose-50/30' },
                 { title: 'Deliveries Overdue', val: deliveries.filter(d => !d.onTime).length + ' Instances', icon: <Rocket className="text-indigo-500"/>, color: 'border-indigo-100 bg-indigo-50/30' }
               ].map((alert, i) => (
                 <div key={i} className={`p-6 rounded-2xl border ${alert.color} flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all`}>
                    <div className="flex items-center space-x-4">
                       <div className="p-3 bg-white rounded-xl shadow-sm">{alert.icon}</div>
                       <div>
                          <p className="text-xs font-bold text-slate-900">{alert.title}</p>
                          <p className="text-sm font-black text-slate-900">{alert.val}</p>
                       </div>
                    </div>
                    <ChevronDown size={20} className="-rotate-90 text-slate-400 group-hover:text-slate-900" />
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'sales' && (
        <div className="animate-in fade-in">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-[500px] flex flex-col items-center justify-center text-center">
             <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl mb-4"><TrendingUp size={48} /></div>
             <h3 className="text-xl font-bold">Sales Intelligence Deck</h3>
             <p className="text-slate-500 max-w-sm">Deeper Win/Loss analysis and Source ROI reports are being synthesized from your recent activity.</p>
          </div>
        </div>
      )}
      
      {activeView === 'delivery' && (
        <div className="animate-in fade-in">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-[500px] flex flex-col items-center justify-center text-center">
             <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl mb-4"><Rocket size={48} /></div>
             <h3 className="text-xl font-bold">Delivery SLA Analytics</h3>
             <p className="text-slate-500 max-w-sm">Project throughput and team capacity metrics are currently calculating based on your active instance logs.</p>
          </div>
        </div>
      )}
    </div>
  );
};
