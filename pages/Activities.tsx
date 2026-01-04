import React from 'react';
import { useLiveCollection } from '../hooks/useLiveData';
import { Activity, Account, Contact } from '../types';
import { Calendar, CheckCircle2, Mail, MessageSquare, Phone, Users, Building2, Clock } from 'lucide-react';

const ACTIVITY_META: Record<Activity['type'], { label: string; className: string; icon: JSX.Element }> = {
  Call: {
    label: 'Call',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: <Phone size={18} />
  },
  Meeting: {
    label: 'Meeting',
    className: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: <Users size={18} />
  },
  Email: {
    label: 'Email',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: <Mail size={18} />
  },
  WhatsApp: {
    label: 'WhatsApp',
    className: 'bg-green-100 text-green-700 border-green-200',
    icon: <MessageSquare size={18} />
  },
  Task: {
    label: 'Task',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <CheckCircle2 size={18} />
  }
};

export const Activities: React.FC = () => {
  const { data: activities } = useLiveCollection<Activity>('activities');
  const { data: accounts } = useLiveCollection<Account>('accounts');
  const { data: contacts } = useLiveCollection<Contact>('contacts');

  const sortedActivities = [...activities].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  const getAccountName = (accountId: string) => accounts.find((account) => account.id === accountId)?.name || 'Unknown Account';
  const getContactName = (contactId?: string) => {
    if (!contactId) return 'Unassigned Contact';
    const contact = contacts.find((item) => item.id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact';
  };

  const upcomingCount = sortedActivities.filter((activity) => new Date(activity.dateTime) > new Date()).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Activities Command</h2>
          <p className="text-slate-500">Track every customer touchpoint and internal follow-up.</p>
        </div>
        <button className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-lg">
          <Calendar size={16} />
          <span>Log Activity</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Activities</p>
          <p className="text-2xl font-black text-slate-900">{activities.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Upcoming</p>
          <p className="text-2xl font-black text-blue-600">{upcomingCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Recorded This Week</p>
          <p className="text-2xl font-black text-emerald-600">{activities.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent Timeline</p>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sortedActivities.length} events</span>
        </div>
        <div className="divide-y divide-slate-100">
          {sortedActivities.length === 0 && (
            <div className="p-10 text-center text-slate-400">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>No activity logged yet.</p>
            </div>
          )}
          {sortedActivities.map((activity) => {
            const meta = ACTIVITY_META[activity.type];
            return (
              <div key={activity.id} className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-start space-x-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${meta.className}`}>
                    {meta.icon}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{meta.label}</p>
                      <p className="text-lg font-bold text-slate-900">{activity.outcome}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
                      <span className="flex items-center space-x-2">
                        <Building2 size={14} className="text-slate-300" />
                        <span>{getAccountName(activity.accountId)}</span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <Users size={14} className="text-slate-300" />
                        <span>{getContactName(activity.contactId)}</span>
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 max-w-2xl">{activity.notes}</p>
                  </div>
                </div>
                <div className="flex flex-col items-start lg:items-end gap-2 text-xs font-bold text-slate-500">
                  <span className="flex items-center space-x-2">
                    <Clock size={14} className="text-slate-300" />
                    <span>{new Date(activity.dateTime).toLocaleString()}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] uppercase tracking-widest">
                    Owner {activity.ownerId}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
