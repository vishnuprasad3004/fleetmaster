import React, { useState } from 'react';
import { ChevronLeft, Plus, CreditCard, Fuel, Search } from 'lucide-react';
import { Vehicle } from '../../types';
import { generateFuelData } from '../../utils/mockData';

interface FuelCreditPageProps {
  role?: string;
  vehicles: Vehicle[];
  onViewVehicle: (v: Vehicle) => void;
  onBack: () => void;
}

const FuelCreditPage: React.FC<FuelCreditPageProps> = ({ role, vehicles, onViewVehicle, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const fuelEntries = generateFuelData().filter(f => f.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) || f.station.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center"><div className="flex items-center space-x-3"><button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition text-slate-600 dark:text-slate-300"><ChevronLeft className="w-6 h-6" /></button><div><h2 className="text-2xl font-bold text-slate-800 dark:text-white">Fuel & Credit Management</h2><p className="text-slate-500 dark:text-slate-400 text-sm">Track fills, credit status, and expenses</p></div></div>{role === 'manager' && <button className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-orange-600 transition"><Plus className="w-4 h-4 mr-2" /> Add Log</button>}</div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between"><div><p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Outstanding Credit</p><h3 className="text-2xl font-bold text-red-600 dark:text-red-400">₹ 45,200</h3></div><CreditCard className="w-8 h-8 text-red-100 dark:text-red-900 bg-red-500 rounded p-1" /></div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between"><div><p className="text-sm text-slate-500 dark:text-slate-400 font-medium">This Month Fuel</p><h3 className="text-2xl font-bold text-slate-800 dark:text-white">₹ 1,28,000</h3></div><Fuel className="w-8 h-8 text-blue-100 dark:text-blue-900 bg-blue-500 rounded p-1" /></div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"><div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50"><h3 className="font-bold text-slate-700 dark:text-slate-300">Transaction History</h3><div className="relative"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" /><input type="text" placeholder="Search vehicle or station..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-700 dark:text-white w-64" /></div></div>
        <table className="w-full text-sm text-left"><thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase font-bold text-xs"><tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Vehicle</th><th className="px-6 py-3">Station</th><th className="px-6 py-3">Liters</th><th className="px-6 py-3">Cost</th><th className="px-6 py-3">Payment</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-700">{fuelEntries.map((f) => (<tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:text-slate-300"><td className="px-6 py-4">{f.date}</td><td className="px-6 py-4"><button onClick={() => { const v = vehicles.find(v => v.regNumber === f.vehicle); if (v) onViewVehicle(v); }} className="font-bold text-blue-600 dark:text-blue-400 hover:underline text-left">{f.vehicle}</button></td><td className="px-6 py-4">{f.station}</td><td className="px-6 py-4">{f.liters} L</td><td className="px-6 py-4 font-medium">₹ {f.cost.toLocaleString()}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${f.credit ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>{f.credit ? 'CREDIT' : 'PAID'}</span></td></tr>))}</tbody></table>
      </div>
    </div>
  );
};

export default FuelCreditPage;