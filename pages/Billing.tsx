
import React, { useState } from 'react';
import { CreditCard, ArrowDownCircle, ArrowUpCircle, Filter, Download } from 'lucide-react';

export const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ar' | 'ap'>('ar');

  const arInvoices = [
    { id: 'INV-001', account: 'Acme Corp', amount: 5000, due: '2023-11-05', status: 'Unpaid' },
    { id: 'INV-002', account: 'Global Inc', amount: 1250, due: '2023-10-20', status: 'Overdue' },
    { id: 'INV-003', account: 'TechFlow', amount: 3500, due: '2023-11-15', status: 'Paid' }
  ];

  const apBills = [
    { id: 'BILL-101', vendor: 'AWS Cloud', amount: 840.50, due: '2023-11-01', status: 'Unpaid' },
    { id: 'BILL-102', vendor: 'Google Workspace', amount: 120, due: '2023-10-25', status: 'Paid' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Billing & Finance</h2>
          <p className="text-slate-500">Track receivables, payables, and financial health.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">
            <Download size={16} />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <CreditCard size={16} />
            <span>Process Payments</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Receivables</p>
          <h3 className="text-3xl font-bold text-emerald-600">$9,750.00</h3>
          <p className="text-xs text-slate-500 mt-2">Next payout in 3 days</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Accounts Payable</p>
          <h3 className="text-3xl font-bold text-rose-600">$960.50</h3>
          <p className="text-xs text-slate-500 mt-2">Due this week</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cash on Hand</p>
          <h3 className="text-3xl font-bold text-slate-900">$42,300.25</h3>
          <p className="text-xs text-slate-500 mt-2">15% increase vs last month</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button 
            onClick={() => setActiveTab('ar')}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-bold transition-all relative ${
              activeTab === 'ar' ? 'text-blue-600 bg-white' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ArrowDownCircle size={18} />
            <span>Accounts Receivable</span>
            {activeTab === 'ar' && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-blue-600"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('ap')}
            className={`flex items-center space-x-2 px-6 py-4 text-sm font-bold transition-all relative ${
              activeTab === 'ap' ? 'text-blue-600 bg-white' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ArrowUpCircle size={18} />
            <span>Accounts Payable</span>
            {activeTab === 'ap' && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-blue-600"></div>}
          </button>
        </div>

        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex space-x-2">
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50">All Items</button>
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50">Pending</button>
            <button className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50">Paid</button>
          </div>
          <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded">
            <Filter size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">{activeTab === 'ar' ? 'Invoice ID' : 'Bill ID'}</th>
                <th className="px-6 py-4">{activeTab === 'ar' ? 'Account' : 'Vendor'}</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(activeTab === 'ar' ? arInvoices : apBills).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-slate-600">{item.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{(item as any).account || (item as any).vendor}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">${item.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{item.due}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      item.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
                      item.status === 'Overdue' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 text-sm font-bold hover:underline">View Details</button>
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
