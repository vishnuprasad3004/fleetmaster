import React from 'react';
import { Plus } from 'lucide-react';
import { Vehicle } from '../../types';
import { calculateHealthColor } from '../../utils/helpers';

interface VehicleListProps {
  vehicles: Vehicle[];
  role?: string;
  onSelect: (v: Vehicle) => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, role, onSelect }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Fleet Vehicles</h2>
      {role === 'manager' && <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-blue-700 transition"><Plus className="w-4 h-4 mr-2" /> Add Vehicle</button>}
    </div>
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase font-bold text-xs"><tr><th className="px-6 py-3">Reg. Number</th><th className="px-6 py-3">Model</th><th className="px-6 py-3">Health</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer dark:text-slate-300" onClick={() => onSelect(v)}>
                <td className="px-6 py-4 font-bold text-slate-700 dark:text-white">{v.regNumber}</td><td className="px-6 py-4">{v.model}</td><td className={`px-6 py-4 font-bold ${calculateHealthColor(v.healthScore)}`}>{v.healthScore}/100</td>
                <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${v.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'}`}>{v.status}</span></td>
                <td className="px-6 py-4"><button onClick={(e) => { e.stopPropagation(); onSelect(v); }} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">{role === 'manager' ? 'Edit / View' : 'View Details'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default VehicleList;