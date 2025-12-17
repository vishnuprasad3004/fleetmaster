import React, { useState } from 'react';
import { Truck } from 'lucide-react';

const LoginPage = ({ onLogin }: { onLogin: (role: 'owner' | 'manager') => void }) => {
  const [activeRole, setActiveRole] = useState<'owner' | 'manager'>('owner');
  const [loading, setLoading] = useState(false);
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="bg-blue-600 p-8 text-center">
          <Truck className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-blue-100 mt-2">Sign in to manage your fleet</p>
        </div>
        <div className="p-8">
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg mb-8">
            <button onClick={() => setActiveRole('owner')} className={`flex-1 py-2 rounded-md text-sm font-medium transition ${activeRole === 'owner' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>Owner / VP</button>
            <button onClick={() => setActiveRole('manager')} className={`flex-1 py-2 rounded-md text-sm font-medium transition ${activeRole === 'manager' ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>Fleet Manager</button>
          </div>
          <button onClick={() => { setLoading(true); setTimeout(() => onLogin(activeRole), 1000); }} disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex justify-center items-center">{loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Login to Dashboard'}</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;