import React, { useState } from 'react';
import { ChevronLeft, Save, Edit3, Users } from 'lucide-react';
import { Driver } from '../../types';

interface DriverDetailViewProps {
  driver: Driver;
  role?: string;
  onBack: () => void;
}

const DriverDetailView: React.FC<DriverDetailViewProps> = ({ driver, role, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...driver });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition text-slate-600 dark:text-slate-300"><ChevronLeft className="w-6 h-6" /></button>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Driver Profile</h2>
        </div>
        {role === 'manager' && <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition ${isEditing ? 'bg-green-600' : 'bg-blue-600'}`}>{isEditing ? <><Save className="w-4 h-4" /> <span>Save</span></> : <><Edit3 className="w-4 h-4" /> <span>Edit</span></>}</button>}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm md:col-span-1">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4"><Users className="w-12 h-12 text-slate-400" /></div>
            {isEditing ? <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="text-center font-bold text-lg border-b border-blue-500 bg-transparent outline-none dark:text-white mb-2" /> : <h3 className="text-xl font-bold text-slate-800 dark:text-white">{formData.name}</h3>}
            <span className={`mt-2 px-3 py-1 rounded-full text-xs font-medium ${formData.status === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>{formData.status}</span>
            <div className="w-full mt-6 space-y-3">
               <div className="flex justify-between text-sm items-center"><span className="text-slate-500 dark:text-slate-400">License</span><span className="font-medium dark:text-white">{formData.license}</span></div>
               <div className="flex justify-between text-sm items-center"><span className="text-slate-500 dark:text-slate-400">Joined</span><span className="font-medium dark:text-white">{formData.joinDate}</span></div>
               <div className="flex justify-between text-sm items-center"><span className="text-slate-500 dark:text-slate-400">Assigned Vehicle</span><span className="font-medium text-blue-600 dark:text-blue-400">{formData.assignedVehicleId ? 'TN-38-BZ-1001 (Mock)' : 'None'}</span></div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 space-y-6">
           <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">Trip History</div>
              <table className="w-full text-sm text-left"><thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-xs uppercase"><tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Route</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-700">{formData.recentTrips?.map(trip => (<tr key={trip.id} className="dark:text-slate-300"><td className="px-4 py-3">{trip.date}</td><td className="px-4 py-3">{trip.from} ➝ {trip.to}</td><td className="px-4 py-3 text-green-600 font-medium">{trip.status}</td></tr>))}</tbody></table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailView;