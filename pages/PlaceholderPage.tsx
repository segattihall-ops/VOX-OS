
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
}

export const PlaceholderPage: React.FC<PlaceholderProps> = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
      <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl mb-4">
        <Construction size={48} />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <p className="text-slate-500 max-w-sm">
        This section is currently under development for the Voxmation OS. Check back soon for full integration.
      </p>
      <button 
        onClick={() => navigate(-1)}
        className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
      >
        Go Back
      </button>
    </div>
  );
};
