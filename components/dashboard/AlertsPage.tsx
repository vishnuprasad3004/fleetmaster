import React from 'react';
import { ChevronLeft, CheckCircle, FileText, Activity as ActivityIcon, Siren, MapPin, Zap } from 'lucide-react';
import { Vehicle, Alert } from '../../types';
import { getExpiryStatus } from '../../utils/helpers';

interface AlertsPageProps {
  vehicles: Vehicle[];
  onViewVehicle: (v: Vehicle) => void;
  onBack: () => void;
}

const AlertsPage: React.FC<AlertsPageProps> = ({ vehicles, onViewVehicle, onBack }) => {
  const generateAlerts = () => {
    let allAlerts: Alert[] = [];
    vehicles.forEach(v => {
      const docs = [{ key: 'fcExpiry', label: 'FC' }, { key: 'insExpiry', label: 'Insurance' }, { key: 'permitExpiry', label: 'Permit' }, { key: 'fitnessExpiry', label: 'Fitness' }, { key: 'taxExpiry', label: 'Tax' }, { key: 'pollutionExpiry', label: 'Pollution' }];
      docs.forEach(d => {
        const status = getExpiryStatus((v as any)[d.key]);
        if (status.status !== 'good') allAlerts.push({ id: `${v.id}-${d.key}`, vehicle: v, type: 'Document', title: `${d.label} ${status.label}`, severity: status.status === 'critical' ? 'critical' : 'medium', icon: FileText, color: status.status === 'critical' ? 'text-red-500' : 'text-yellow-500' });
      });
      if (v.healthScore < 50) allAlerts.push({ id: `${v.id}-health`, vehicle: v, type: 'Health', title: `Critical Health: ${v.healthScore}%`, severity: 'high', icon: ActivityIcon, color: 'text-red-500' });
      if (v.status === 'Accident') allAlerts.push({ id: `${v.id}-acc`, vehicle: v, type: 'Emergency', title: 'Accident Reported', severity: 'critical', icon: Siren, color: 'text-red-600' });
      if (v.status === 'Off Track') allAlerts.push({ id: `${v.id}-track`, vehicle: v, type: 'Tracking', title: 'Vehicle Off Track', severity: 'high', icon: MapPin, color: 'text-orange-500' });
      if (v.fastagStatus && v.fastagStatus !== 'Active') allAlerts.push({ id: `${v.id}-fastag`, vehicle: v, type: 'Fastag', title: `Fastag: ${v.fastagStatus}`, severity: 'medium', icon: Zap, color: 'text-purple-500' });
    });
    return allAlerts.sort((a, b) => (a.severity === 'critical' ? -1 : 1));
  };
  const alerts = generateAlerts();
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center space-x-4"><button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition text-slate-600 dark:text-slate-300"><ChevronLeft className="w-6 h-6" /></button><div><h2 className="text-2xl font-bold text-slate-800 dark:text-white">System Alerts</h2><p className="text-slate-500 dark:text-slate-400 text-sm">Real-time fleet notifications</p></div></div>
      <div className="space-y-4">
        {alerts.length === 0 ? <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"><CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" /><h3 className="text-lg font-medium">All Systems Operational</h3></div> :
          alerts.map(alert => (<div key={alert.id} className={`p-4 rounded-xl border ${alert.severity === 'critical' ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900' : 'bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700'} flex items-center justify-between shadow-sm`}><div className="flex items-center space-x-4"><div className={`p-2 rounded-full bg-white dark:bg-slate-700 shadow-sm ${alert.color}`}><alert.icon className="w-6 h-6" /></div><div><h4 className="font-bold text-slate-800 dark:text-white">{alert.title}</h4><p className="text-sm text-slate-500 dark:text-slate-400">{alert.vehicle.regNumber} • {alert.vehicle.model}</p></div></div><button onClick={() => onViewVehicle(alert.vehicle)} className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg">View Details</button></div>))
        }
      </div>
    </div>
  );
};

export default AlertsPage;