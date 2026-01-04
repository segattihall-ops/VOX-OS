import React from 'react';
import { useLiveCollection } from '../hooks/useLiveData';
import { Activity, Account, Contact, Opportunity } from '../types';
import {
  CalendarClock,
  Building2,
  User,
  MessageSquareText,
  Filter,
  ArrowUpRight
} from 'lucide-react';

export const Activities: React.FC = () => {
  const { data: activities = [] } = useLiveCollection<Activity>('activities');
  const { data: accounts = [] } = useLiveCollection<Account>('accounts');
  const { data: contacts = [] } = useLiveCollection<Contact>('contacts');
  const { data: opportunities = [] } = useLiveCollection<Opportunity>('opportunities');

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );

  const meetingCount = activities.filter(a => a.type === 'Meeting').length;
  const actionDueCount = activities.filter(a => a.nextActionDate && new Date(a.nextActionDate) < new Date()).length;

  const getAccountName = (accountId: string) =>
    accounts.find(a => a.id === accountId)?.name || 'Unknown Account';

  const getContactName = (contactId?: string) => {
    if (!contactId) return 'Unassigned';
    const contact = contacts.find(c => c.id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact';
  };

  const getOpportunityName = (opportunityId?: string) => {
    if (!opportunityId) return 'No Linked Deal';
    return opportunities.find(o => o.id === opportunityId)?.name || 'Unknown Deal';
  };

  const getTypeStyles = (type: Activity['type']) => {
    switch (type) {
      case 'Call':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Meeting':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Email':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'WhatsApp':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Activity Command</h2>
          <p className="text-slate-500">Chronological visibility across customer interactions and follow-ups.</p>
        </div>
        <button className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-lg">
          <CalendarClock size={18} />
          <span>Log Activity</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Touchpoints</p>
          <p className="text-2xl font-black text-slate-900">{activities.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Meetings This Cycle</p>
          <p className="text-2xl font-black text-emerald-600">{meetingCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1">Action Due</p>
          <p className="text-2xl font-black text-rose-600">{actionDueCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <MessageSquareText size={16} />
            <span>Recent Activity Feed</span>
          </div>
          <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl">
            <Filter size={18} />
          </button>
        </div>

        {sortedActivities.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No activity logged yet. Start capturing customer touchpoints.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sortedActivities.map(activity => (
              <div
                key={activity.id}
                className="px-6 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${getTypeStyles(activity.type)}`}>
                      {activity.type}
                    </span>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                      {new Date(activity.dateTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900">{activity.outcome}</div>
                  <p className="text-xs text-slate-500 max-w-2xl">{activity.notes}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-bold text-slate-600">
                  <div className="flex items-center space-x-2">
                    <Building2 size={14} className="text-slate-400" />
                    <span>{getAccountName(activity.accountId)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User size={14} className="text-slate-400" />
                    <span>{getContactName(activity.contactId)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowUpRight size={14} className="text-slate-400" />
                    <span>{getOpportunityName(activity.dealId)}</span>
                  </div>
                </div>

                {activity.nextActionDate && (
                  <div className="text-xs font-bold text-slate-500">
                    Next action: {new Date(activity.nextActionDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
