import React from 'react';
import { Activity } from 'lucide-react';

const HomePage = ({ setPage }: { setPage: (p: string) => void }) => (
  <div className="animate-fade-in">
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <Activity className="w-4 h-4 mr-2" /> New: AI Predictive Maintenance
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
            Optimize Your <span className="text-blue-600">Logistics</span> & Fleet Performance
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            The all-in-one platform for owners and managers. Track vehicles, manage drivers, predict breakdowns, and control fuel costs.
          </p>
          <div className="flex gap-4">
            <button onClick={() => setPage('login')} className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition transform hover:-translate-y-1">Get Started</button>
            <button onClick={() => setPage('services')} className="px-8 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition">View Services</button>
          </div>
        </div>
        <div className="relative">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800 dark:text-white">Live Fleet Status</h3>
              <span className="text-green-500 text-sm font-medium flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>System Active</span>
            </div>
            <div className="h-48 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700 flex items-end justify-between px-4 pb-4">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} style={{ height: `${h}%` }} className="w-6 bg-blue-500 rounded-t-sm opacity-80 hover:opacity-100 transition-all duration-500"></div>
              ))}
            </div>
          </div>
          <div className="absolute top-10 -right-10 w-full h-full bg-blue-100 dark:bg-blue-900/20 rounded-2xl -z-0 transform rotate-6"></div>
        </div>
      </div>
    </div>
  </div>
);

export default HomePage;