
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    login({
      id: 'usr-1',
      name: 'BRUno',
      email: 'bruno@voxmation.io',
      role: 'System Administrator',
      initials: 'BR'
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full filter blur-[120px]"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-indigo-500 rounded-full filter blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl mb-4 text-blue-600">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Voxmation OS</h1>
          <p className="text-slate-500 mt-2">Next-Gen Intelligence CRM</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              disabled 
              placeholder="email@example.com"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              disabled 
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
            />
          </div>

          <div className="pt-2">
            <button 
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-blue-200"
            >
              Secure Login (Demo Mode)
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-slate-400 mt-8">
          By logging in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
