
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveCollection } from '../hooks/useLiveData';
import { Delivery } from '../types';
import { 
  Rocket, Clock, CheckCircle2, AlertCircle, 
  MoreHorizontal, Settings, HardDrive, ShieldCheck, 
  MessageSquare, Instagram, ChevronRight, Zap 
} from 'lucide-react';

export const DeliveryPage: React.FC = () => {
  const { data: deliveries } = useLiveCollection<Delivery>('deliveries');
  const navigate = useNavigate();

  const getStageColor = (stage: Delivery['stage']) => {
    switch (stage) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700';
      case 'Live': return 'bg-indigo-100 text-indigo-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'QA': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Deployment & Delivery</h2>
          <p className="text-slate-500">Track implementation and "Definition of Done" stages.</p>
        </div>
        <div className="flex space-x-3">
           <button className="flex items-center space-x-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
             <Settings size={18} />
             <span>Templates</span>
           </button>
           <button className="flex items-center space-x-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800">
             <Rocket size={18} />
             <span>New Project</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {deliveries.map((del) => (
          <div 
            key={del.id} 
            onClick={() => navigate(`/dashboard/delivery/${del.id}`)}
            className="group bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all overflow-hidden flex flex-col md:flex-row cursor-pointer"
          >
            <div className="p-8 md:w-1/4 border-r border-slate-50 bg-slate-50/20 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <HardDrive size={16} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instance</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{del.accountName}</h3>
                <p className="text-xs text-slate-500 mt-1">{del.packageTier} Package</p>
              </div>
              <div className="mt-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStageColor(del.stage)}`}>
                  {del.stage}
                </span>
              </div>
            </div>

            <div className="p-8 flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Progress</p>
                <div className="flex items-center space-x-3">
                   <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${del.checklistProgress}%` }}></div>
                   </div>
                   <span className="text-xs font-bold text-slate-900">{del.checklistProgress}%</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">SLA Status</p>
                <div className="flex items-center space-x-2">
                  <Clock size={16} className="text-slate-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Due {del.dueDate}</span>
                    <span className={`text-[10px] font-bold uppercase ${del.onTime ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {del.onTime ? 'On-Schedule' : 'Critical Delay'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">QA Health</p>
                <div className="flex items-center space-x-2">
                   <Zap size={16} className={del.qaStatus === 'Approved' ? 'text-emerald-500' : 'text-amber-500'} />
                   <span className="text-xs font-bold text-slate-900">{del.qaStatus}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="flex items-center text-emerald-600 font-bold text-sm uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                   <span>Open Board</span>
                   <ChevronRight size={18} className="ml-1" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
