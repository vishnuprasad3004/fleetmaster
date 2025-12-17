import React, { useState } from 'react';
import { ChevronLeft, Search, Activity } from 'lucide-react';
import { Vehicle } from '../../types';
import { calculateHealthColor } from '../../utils/helpers';

interface PredictiveMaintenancePageProps {
  vehicles: Vehicle[];
  onViewVehicle: (v: Vehicle) => void;
  onBack: () => void;
}

const PredictiveMaintenancePage: React.FC<PredictiveMaintenancePageProps> = ({ vehicles, onViewVehicle, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredVehicles = vehicles.filter(v => v.regNumber.toLowerCase().includes(searchTerm.toLowerCase())).sort((a, b) => a.healthScore - b.healthScore);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center space-x-4"><button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition text-slate-600 dark:text-slate-300"><ChevronLeft className="w-6 h-6" /></button><div><h2 className="text-2xl font-bold text-slate-800 dark:text-white">Predictive Maintenance</h2><p className="text-slate-500 dark:text-slate-400 text-sm">AI-driven analysis</p></div></div>
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"><div className="relative max-w-md"><Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" /><input type="text" placeholder="Search Vehicle..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" /></div></div>
      <div className="grid gap-4">
        {filteredVehicles.map(v => (
          <div key={v.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between">
             <div className="flex items-center space-x-4"><div className={`p-3 rounded-full ${v.healthScore < 50 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}><Activity className="w-6 h-6" /></div><div><h4 className="font-bold text-lg dark:text-white">{v.regNumber}</h4><p className="text-sm text-slate-500">{v.model}</p></div></div>
             <div className="flex-1 px-8"><div className="flex justify-between text-sm mb-1"><span className="text-slate-500">Health</span><span className={`font-bold ${calculateHealthColor(v.healthScore)}`}>{v.healthScore}%</span></div><div className="w-full bg-slate-200 rounded-full h-2.5"><div className={`h-2.5 rounded-full ${v.healthScore < 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${v.healthScore}%` }}></div></div></div>
             <button onClick={() => onViewVehicle(v)} className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">View Report</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictiveMaintenancePage;