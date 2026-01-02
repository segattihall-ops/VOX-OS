
import React, { useState } from 'react';
import { useLiveCollection } from '../hooks/useLiveData';
import { Opportunity } from '../types';
import { AutomationService } from '../services/automationService';
import { LayoutGrid, List, Plus, Search, MoreHorizontal, DollarSign, BrainCircuit, Sparkles, TrendingUp, Zap, Clock, CheckCircle2 } from 'lucide-react';

export const Opportunities: React.FC = () => {
  const [view, setView] = useState<'list' | 'kanban'>('kanban');
  const { data: opportunities, updateDoc } = useLiveCollection<Opportunity>('opportunities');

  const STAGES = ['Discovery', 'Solution Fit', 'Proposal Sent', 'Negotiation', 'Closed Won'];

  const handleWinDeal = async (opp: Opportunity) => {
    if (opp.stage === 'Closed Won') return;
    
    // Trigger Global Automation
    AutomationService.handleClosedWon(opp.id);
    
    // Update local stage
    await updateDoc(opp.id, { stage: 'Closed Won', closedAt: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Opportunities Pipeline</h2>
          <p className="text-slate-500">Managing the Voxmation deal flow.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex p-1 bg-slate-100 rounded-lg">
            <button onClick={() => setView('list')} className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}><List size={20} /></button>
            <button onClick={() => setView('kanban')} className={`p-1.5 rounded-md transition-all ${view === 'kanban' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}><LayoutGrid size={20} /></button>
          </div>
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-lg shadow-blue-100">
            <Plus size={18} />
            <span>New Deal</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {STAGES.map((stage) => (
          <div key={stage} className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h4 className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">{stage}</h4>
              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                {opportunities.filter(o => o.stage === stage).length}
              </span>
            </div>
            <div className="space-y-4 min-h-[400px] bg-slate-50 p-2 rounded-xl border border-slate-200/50">
              {opportunities.filter(o => o.stage === stage).map((opp) => (
                <div key={opp.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer relative">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-bold text-slate-900 text-xs leading-tight group-hover:text-blue-600">{opp.name}</h5>
                    {opp.stage !== 'Closed Won' && opp.stage === 'Negotiation' && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleWinDeal(opp); }}
                            className="p-1 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-600 hover:text-white transition-colors"
                            title="Win Deal"
                        >
                            <CheckCircle2 size={14}/>
                        </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mb-4">{opp.accountName}</p>
                  
                  <div className="flex flex-col space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase">MRR</span>
                      <span className="text-xs font-bold text-blue-600">${opp.mrr.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Clock size={12} className="text-slate-300" />
                      <span className="text-[10px] text-slate-400 font-medium">{opp.closeDateTarget}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap size={12} className="text-amber-500" />
                      <span className="text-[10px] font-bold text-slate-600">{opp.probability}%</span>
                    </div>
                  </div>
                  
                  {opp.stage === 'Closed Won' && (
                    <div className="absolute inset-0 bg-emerald-500/10 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Won Deal</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
