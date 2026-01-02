
import React from 'react';
import { useLiveCollection } from '../hooks/useLiveData';
import { Contact, Account } from '../types';
import { Users, Search, Plus, Mail, Phone, ExternalLink, MoreHorizontal, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Contacts: React.FC = () => {
  const { data: contacts } = useLiveCollection<Contact>('contacts');
  const { data: accounts } = useLiveCollection<Account>('accounts');
  const navigate = useNavigate();

  const getAccountName = (accountId: string) => accounts.find(a => a.id === accountId)?.name || 'Unknown Account';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Stakeholders & Contacts</h2>
          <p className="text-slate-500">People driving decisions within your accounts.</p>
        </div>
        <button className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-lg">
          <Plus size={18} />
          <span>New Contact</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search people, roles, accounts..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm font-medium"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Name & Role</th>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {contacts.map((con) => (
                <tr key={con.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold mr-3 border border-slate-200">
                        {con.firstName[0]}{con.lastName[0]}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{con.firstName} {con.lastName}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{con.roleTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div 
                        onClick={() => navigate(`/dashboard/accounts/${con.accountId}`)}
                        className="flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-indigo-600 cursor-pointer transition-colors"
                    >
                        <Building2 size={14} className="text-slate-400" />
                        <span>{getAccountName(con.accountId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">{con.email}</td>
                  <td className="px-6 py-4 text-xs text-slate-600">{con.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        con.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                        {con.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 text-slate-300 hover:text-slate-600 rounded-lg transition-all"><Mail size={16}/></button>
                      <button className="p-2 text-slate-300 hover:text-slate-600 rounded-lg transition-all"><MoreHorizontal size={16}/></button>
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
