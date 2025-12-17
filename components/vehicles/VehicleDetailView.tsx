import React, { useState } from 'react';
import { ChevronLeft, Save, Edit3, MapPin, ExternalLink, Map } from 'lucide-react';
import { Vehicle } from '../../types';
import { calculateHealthColor, getExpiryStatus } from '../../utils/helpers';

interface VehicleDetailViewProps {
  vehicle: Vehicle;
  role?: string;
  onBack: () => void;
}

const VehicleDetailView: React.FC<VehicleDetailViewProps> = ({ vehicle, role, onBack }) => {
  if (!vehicle) return null;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...vehicle });

  const docs = [
    { key: 'fcExpiry', label: 'FC Expiry' }, { key: 'insExpiry', label: 'Insurance Expiry' },
    { key: 'permitExpiry', label: 'National Permit' }, { key: 'fitnessExpiry', label: 'Fitness Cert' },
    { key: 'taxExpiry', label: 'Road Tax' }, { key: 'pollutionExpiry', label: 'Pollution Cert' },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition text-slate-600 dark:text-slate-300"><ChevronLeft className="w-6 h-6" /></button>
        <div><h2 className="text-2xl font-bold text-slate-800 dark:text-white">{vehicle.regNumber}</h2><p className="text-slate-500 dark:text-slate-400">{vehicle.model} • {vehicle.type}</p></div>
        <div className={`ml-auto px-3 py-1 rounded-full text-sm font-bold ${vehicle.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>{vehicle.status}</div>
        {role === 'manager' && <button onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-white transition ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>{isEditing ? <><Save className="w-4 h-4" /> <span>Save</span></> : <><Edit3 className="w-4 h-4" /> <span>Edit Details</span></>}</button>}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm col-span-3 md:col-span-1 space-y-6">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 border-b dark:border-slate-700 pb-2">Live Status</h3>
            <div className="space-y-4">
               <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Health</span><span className={`font-bold ${calculateHealthColor(vehicle.healthScore)}`}>{vehicle.healthScore}/100</span></div>
               <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Fuel</span><span className="font-medium text-slate-800 dark:text-white">{vehicle.fuelLevel}%</span></div>
               <div className="flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Speed</span><span className="font-medium text-slate-800 dark:text-white">{vehicle.currentSpeed} km/h</span></div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-2 flex items-center"><MapPin className="w-4 h-4 mr-2" /> Live Location</h3>
            <div className="h-40 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-600 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-blue-50 dark:bg-slate-800 opacity-50"></div>
               <Map className="w-8 h-8 text-slate-400 z-10" />
               <span className="z-10 text-xs font-mono text-slate-500 mt-8 absolute">GPS Signal Active</span>
               <a href={vehicle.gpsLink || '#'} target="_blank" rel="noreferrer" className="absolute bottom-2 right-2 bg-white dark:bg-slate-700 px-2 py-1 text-xs rounded shadow flex items-center hover:text-blue-500">View Map <ExternalLink className="w-3 h-3 ml-1"/></a>
            </div>
          </div>
          <div>
             <h3 className="font-bold text-slate-800 dark:text-white mb-2 border-b dark:border-slate-700 pb-1">Current Assignment</h3>
             <div className="text-sm">
                <div className="flex justify-between py-1"><span className="text-slate-500">Driver:</span> <span className="font-medium dark:text-white">{vehicle.assignedDriverId ? 'Rajesh Kumar (Mock)' : 'Unassigned'}</span></div>
                <div className="flex justify-between py-1"><span className="text-slate-500">Order:</span> <span className="font-medium dark:text-white">{vehicle.currentOrderId ? '#B-1024' : 'Idle'}</span></div>
             </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm col-span-3 md:col-span-2">
          <div className="flex justify-between items-center mb-4 border-b dark:border-slate-700 pb-2">
             <h3 className="font-bold text-slate-800 dark:text-white">Document Compliance</h3>
             {isEditing && <span className="text-xs text-amber-500 font-bold animate-pulse">EDIT MODE</span>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {docs.map((doc, i) => {
              const status = getExpiryStatus((formData as any)[doc.key]);
              return (
                <div key={i} className={`p-3 rounded-lg border transition ${isEditing ? 'border-blue-300 bg-slate-50 dark:bg-slate-900' : status.color}`}>
                  <div className="text-xs opacity-70 uppercase font-semibold mb-1">{doc.label}</div>
                  <div className="flex justify-between items-center">
                    {isEditing ? <input type="date" value={(formData as any)[doc.key] || ''} onChange={(e) => setFormData({...formData, [doc.key]: e.target.value})} className="w-full bg-white dark:bg-slate-800 border rounded px-2 py-1 text-sm dark:text-white" />
                    : <><span className="font-medium">{(formData as any)[doc.key] || 'N/A'}</span><span className="text-xs px-2 py-0.5 rounded bg-white/50 dark:bg-black/20">{status.label}</span></>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailView;