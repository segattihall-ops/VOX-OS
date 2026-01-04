import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLiveCollection, useLiveDoc } from '../hooks/useLiveData';
import { SupportTicket, Account, Delivery } from '../types';
import { ArrowLeft, ShieldAlert, Clock, Building2, Rocket, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const SupportTicketDetail: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { doc: ticket } = useLiveDoc<SupportTicket>('tickets', ticketId);
  const { data: accounts } = useLiveCollection<Account>('accounts');
  const { data: deliveries } = useLiveCollection<Delivery>('deliveries');

  const getAccountName = (accountId: string) => accounts.find((account) => account.id === accountId)?.name || 'Unknown Account';
  const getDeliveryName = (deliveryId?: string) => {
    if (!deliveryId) return 'No linked delivery';
    return deliveries.find((delivery) => delivery.id === deliveryId)?.name || 'Unknown Delivery';
  };

  const getSeverityStyles = (severity?: SupportTicket['severity']) => {
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

  if (!ticket) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          <span>Back to Support</span>
        </button>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 text-center">
          <ShieldAlert size={48} className="mx-auto mb-4 text-slate-300" />
          <h2 className="text-xl font-bold text-slate-800">Ticket not found</h2>
          <p className="text-slate-500">We could not locate this support request.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        <span>Back to Support</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ticket Summary</p>
            <h2 className="text-2xl font-black text-slate-900">{ticket.summary}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
              <span className="flex items-center space-x-2">
                <Building2 size={14} className="text-slate-300" />
                <span>{getAccountName(ticket.accountId)}</span>
              </span>
              <span className="flex items-center space-x-2">
                <Rocket size={14} className="text-slate-300" />
                <span>{getDeliveryName(ticket.deliveryId)}</span>
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getSeverityStyles(ticket.severity)}`}>
              {ticket.severity} Severity
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">
              {ticket.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opened</p>
            <p className="text-sm font-bold text-slate-700">{new Date(ticket.openedAt).toLocaleString()}</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</p>
            <p className="text-sm font-bold text-slate-700">{new Date(ticket.lastUpdatedAt).toLocaleString()}</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SLA Due</p>
            <p className="text-sm font-bold text-slate-700">{new Date(ticket.slaDueAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-slate-700">
              <ShieldAlert size={18} className="text-rose-500" />
              <h3 className="text-sm font-black uppercase tracking-widest">Impact & Status</h3>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Category</span>
                <span className="text-slate-900 font-bold">{ticket.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Owner</span>
                <span className="text-slate-900 font-bold">{ticket.ownerId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">Resolution Path</span>
                <span className="text-slate-900 font-bold">Engineering Escalation</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 text-slate-700">
              <Clock size={18} className="text-blue-500" />
              <h3 className="text-sm font-black uppercase tracking-widest">Timeline</h3>
            </div>
            <div className="space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Calendar size={14} className="text-slate-300" />
                  <span>Opened</span>
                </span>
                <span className="font-semibold">{new Date(ticket.openedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <AlertTriangle size={14} className="text-slate-300" />
                  <span>SLA Due</span>
                </span>
                <span className="font-semibold">{new Date(ticket.slaDueAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <CheckCircle2 size={14} className="text-slate-300" />
                  <span>Status</span>
                </span>
                <span className="font-semibold">{ticket.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
