
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveCollection } from '../hooks/useLiveData';
import { Account } from '../types';
import { Building2, Plus, Search, MoreHorizontal, Heart, Globe, Sparkles, X, Loader2, ArrowRight, ShieldCheck, Target } from 'lucide-react';

export const Accounts: React.FC = () => {
  const { data: accounts } = useLiveCollection<Account>('accounts');
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Accounts</h2>
          <p className="text-slate-500">Manage client source of truth, health, and expansion.</p>
        </div>
        <button className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-lg">
          <Plus size={18} />
          <span>New Account</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by company, domain..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm font-medium"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Account & Industry</th>
                <th className="px-6 py-4">Lifecycle & Status</th>
                <th className="px-6 py-4 text-center">Health</th>
                <th className="px-6 py-4">Current MRR</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map((acc) => (
                <tr 
                  key={acc.id} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer group" 
                  onClick={() => navigate(`/dashboard/accounts/${acc.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-indigo-600 font-bold mr-3 border border-slate-200">
                        {acc.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{acc.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{acc.industry}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Target size={12} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-900">{acc.lifecycle}</span>
                      </div>
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        acc.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {acc.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                       <span className={`text-sm font-black ${
                          acc.healthStatus === 'Green' ? 'text-emerald-500' : 
                          acc.healthStatus === 'Yellow' ? 'text-amber-500' : 'text-rose-500'
                       }`}>
                          {acc.healthScore}
                       </span>
                       <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden mt-1">
                          <div className={`h-full ${
                             acc.healthStatus === 'Green' ? 'bg-emerald-500' : 
                             acc.healthStatus === 'Yellow' ? 'bg-amber-500' : 'bg-rose-500'
                          }`} style={{ width: `${acc.healthScore}%` }}></div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">${acc.mrr.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{acc.plan.split(' ')[0]}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all">
                        <ArrowRight size={18} />
                      </button>
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
