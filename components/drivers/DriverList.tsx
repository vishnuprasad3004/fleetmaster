import React from 'react';
import { Plus, Users } from 'lucide-react';
import { Driver } from '../../types';

interface DriverListProps {
  drivers: Driver[];
  role?: string;
  onSelectDriver: (d: Driver) => void;
}

const DriverList: React.FC<DriverListProps> = ({ drivers, role, onSelectDriver }) => (
  <div className="space-y-6">
     <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-slate-800 dark:text-white">Driver Directory</h2>{role === 'manager' && <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-blue-700 transition"><Plus className="w-4 h-4 mr-2" /> Add Driver</button>}</div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {drivers.map(d => (
        <div key={d.id} onClick={() => onSelectDriver(d)} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start space-x-4 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0"><Users className="w-6 h-6 text-slate-400 dark:text-slate-500" /></div>
          <div className="flex-1"><h3 className="font-bold text-slate-800 dark:text-white">{d.name}</h3><p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Lic: {d.license}</p><div className="flex justify-between items-center text-sm"><span className={`px-2 py-0.5 rounded text-xs ${d.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'}`}>{d.status}</span><span className="flex items-center text-yellow-500 font-bold">★ {d.rating}</span></div></div>
        </div>
      ))}
    </div>
  </div>
);

export default DriverList;