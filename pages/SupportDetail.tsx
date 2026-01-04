import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLiveCollection, useLiveDoc } from '../hooks/useLiveData';
import { Account, Delivery, SupportTicket } from '../types';
import {
  ArrowLeft,
  Building2,
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Hourglass
} from 'lucide-react';

export const SupportDetail: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { doc: ticket, updateDoc } = useLiveDoc<SupportTicket>('tickets', ticketId);
  const { data: accounts = [] } = useLiveCollection<Account>('accounts');
  const { data: deliveries = [] } = useLiveCollection<Delivery>('deliveries');

  const account = accounts.find(a => a.id === ticket?.accountId);
  const delivery = deliveries.find(d => d.id === ticket?.deliveryId);

  if (!ticket) {
    return (
      <div className="p-12 text-center text-slate-500">
        Ticket not found. Return to the Support Command to select a ticket.
      </div>
    );
  }

  const getSeverityStyles = (severity: SupportTicket['severity']) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'High':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusStyles = (status: SupportTicket['status']) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Waiting on Client':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const handleResolve = async () => {
    await updateDoc({
      status: 'Resolved',
      lastUpdatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-sm font-bold text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        <span>Back to Support Command</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${getSeverityStyles(ticket.severity)}`}>
                <ShieldAlert size={22} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ticket Summary</p>
                <h2 className="text-2xl font-black text-slate-900">{ticket.summary}</h2>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-xs font-bold text-slate-500">
              <span className={`px-2 py-0.5 rounded uppercase tracking-widest ${getStatusStyles(ticket.status)}`}>
                {ticket.status}
              </span>
              <span className={`px-2 py-0.5 rounded uppercase tracking-widest border ${getSeverityStyles(ticket.severity)}`}>
                {ticket.severity} Priority
              </span>
              <span className="text-[10px] uppercase tracking-widest">{ticket.category}</span>
            </div>
          </div>

          <button
            onClick={handleResolve}
            disabled={ticket.status === 'Resolved'}
            className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 size={16} />
            <span>Mark Resolved</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Building2 size={14} />
              <span>Account</span>
            </div>
            <div className="text-sm font-bold text-slate-900">{account?.name || 'Unknown Account'}</div>
            <div className="text-xs text-slate-500">{account?.industry || 'Industry TBD'}</div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Clock size={14} />
              <span>Opened</span>
            </div>
            <div className="text-sm font-bold text-slate-900">{new Date(ticket.openedAt).toLocaleString()}</div>
            <div className="text-xs text-slate-500">Last updated {new Date(ticket.lastUpdatedAt).toLocaleString()}</div>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Hourglass size={14} />
              <span>SLA Target</span>
            </div>
            <div className="text-sm font-bold text-slate-900">{new Date(ticket.slaDueAt).toLocaleString()}</div>
            <div className="text-xs text-slate-500">Owner: {ticket.ownerId}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <AlertTriangle size={14} />
              <span>Delivery Context</span>
            </div>
            <div className="text-sm font-bold text-slate-900">{delivery?.name || 'Not linked to a delivery'}</div>
            <p className="text-xs text-slate-500">{delivery ? `Status: ${delivery.status}` : 'Link a delivery to coordinate escalation.'}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resolution Checklist</div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center space-x-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Confirm SLA target with account owner.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Capture workaround details in support log.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Notify customer success of ticket status.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
