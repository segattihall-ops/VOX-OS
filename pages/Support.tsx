
import React from 'react';
import { useLiveCollection } from '../hooks/useLiveData';
import { SupportTicket, Account } from '../types';
import { ShieldAlert, Search, Plus, Clock, AlertTriangle, ChevronRight, Building2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Support: React.FC = () => {
  const { data: tickets } = useLiveCollection<SupportTicket>('tickets');
  const { data: accounts } = useLiveCollection<Account>('accounts');
  const navigate = useNavigate();

  const getAccountName = (accountId: string) => accounts.find(a => a.id === accountId)?.name || 'Unknown Account';

  const getSeverityStyles = (severity: SupportTicket['severity']) => {
    switch (severity) {
      case 'Critical': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Support Command</h2>
          <p className="text-slate-500">Managing technical issues and customer success blockers.</p>
        </div>
        <button className="flex items-center space-x-2 bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-all shadow-lg">
          <Plus size={18} />
          <span>New Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Tickets</p>
              <p className="text-2xl font-black text-slate-900">{tickets.filter(t => t.status !== 'Resolved').length}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Critical Priority</p>
              <p className="text-2xl font-black text-rose-600">{tickets.filter(t => t.severity === 'Critical' && t.status !== 'Resolved').length}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Resolved (7d)</p>
              <p className="text-2xl font-black text-emerald-600">{tickets.filter(t => t.status === 'Resolved').length}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Avg Resolution</p>
              <p className="text-2xl font-black text-blue-600">4.2h</p>
          </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-4">
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                type="text" 
                placeholder="Search tickets..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500 outline-none w-64 shadow-sm font-medium"
                />
            </div>
            <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">All Categories</button>
                <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">My Tickets</button>
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl"><Filter size={18}/></button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Summary & Category</th>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4 text-center">Severity</th>
                <th className="px-6 py-4">SLA Target</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => navigate(`/dashboard/support/${t.id}`)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center mr-3 border ${getSeverityStyles(t.severity)}`}>
                        <ShieldAlert size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-1">{t.summary}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
                        <Building2 size={14} className="text-slate-400" />
                        <span>{getAccountName(t.accountId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${getSeverityStyles(t.severity)}`}>
                        {t.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
                        <Clock size={14} className="text-slate-300" />
                        <span>{new Date(t.slaDueAt).toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        t.status === 'Open' ? 'bg-amber-100 text-amber-700' :
                        t.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                        {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-slate-300 hover:text-rose-600 rounded-lg transition-all"><ChevronRight size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
