import React, { useState, useMemo } from 'react';
import { Truck, Users, Activity, AlertTriangle, Activity as ActivityIcon, BarChart2, TrendingUp, ShieldAlert, AlertOctagon } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import StatCard from '../common/StatCard';
import { Vehicle, Driver } from '../../types';
import { getExpiryStatus } from '../../utils/helpers';

interface DashboardHomeProps {
  role?: string;
  vehicles: Vehicle[];
  drivers: Driver[];
  setDashboardPage: (p: string) => void;
  onViewVehicle: (v: Vehicle) => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ role, vehicles, drivers, setDashboardPage, onViewVehicle }) => {
  const [activeMetric, setActiveMetric] = useState('fuel');
  const [selectedVehicleId, setSelectedVehicleId] = useState('all');
  const [chartType, setChartType] = useState('area');
  const totalVehicles = vehicles.length;
  const healthAvg = Math.round(vehicles.reduce((acc, v) => acc + v.healthScore, 0) / (totalVehicles || 1));
  const criticalAlerts = vehicles.filter(v => v.status === 'Accident' || v.status === 'Off Track' || getExpiryStatus(v.fcExpiry).status === 'critical' || v.healthScore < 40);
  
  const chartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => ({ name: day, value: Math.round((activeMetric === 'fuel' ? 45 : 2000) * (selectedVehicleId === 'all' ? 4 : 1) + Math.sin(i) * 50) }));
  }, [activeMetric, selectedVehicleId]);
  
  const renderChart = () => {
    const ChartComponent = chartType === 'bar' ? BarChart : (chartType === 'line' ? LineChart : AreaChart);
    const DataComponent = chartType === 'bar' ? Bar : (chartType === 'line' ? Line : Area);
    const color = "#3B82F6";
    // @ts-ignore
    return <ResponsiveContainer width="100%" height="100%"><ChartComponent data={chartData}><defs><linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.8}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} /><XAxis dataKey="name" stroke="#94a3b8" /><YAxis stroke="#94a3b8" /><Tooltip contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc'}} />{chartType === 'area' ? <Area type="monotone" dataKey="value" stroke={color} fill="url(#colorVal)" /> : <DataComponent type="monotone" dataKey="value" stroke={color} fill={color} radius={[4, 4, 0, 0]} />}</ChartComponent></ResponsiveContainer>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Vehicles" value={totalVehicles} icon={Truck} color="bg-blue-500" trend="+2" onClick={() => setDashboardPage('vehicles')} />
        <StatCard title="Active Drivers" value={drivers.length} icon={Users} color="bg-indigo-500" onClick={() => setDashboardPage('drivers')} />
        <StatCard title="Fleet Health" value={`${healthAvg}%`} icon={Activity} color="bg-emerald-500" trend="Stable" onClick={() => setDashboardPage('predictive')} />
        <StatCard title="Alerts" value={criticalAlerts.length} icon={AlertTriangle} color="bg-red-500" onClick={() => setDashboardPage('alerts')} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm lg:col-span-2 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div><h3 className="font-bold text-slate-800 dark:text-white">{activeMetric === 'fuel' ? 'Fuel Usage' : 'Revenue'}</h3><select value={selectedVehicleId} onChange={(e) => setSelectedVehicleId(e.target.value)} className="mt-1 text-xs border rounded bg-white dark:bg-slate-700 dark:text-white p-1 outline-none"><option value="all">All Fleet</option>{vehicles.map(v => <option key={v.id} value={v.id}>{v.regNumber}</option>)}</select></div>
            <div className="flex flex-wrap items-center gap-2">
               <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg"><button onClick={() => setChartType('area')} className={`p-1.5 rounded ${chartType === 'area' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}><ActivityIcon className="w-4 h-4" /></button><button onClick={() => setChartType('bar')} className={`p-1.5 rounded ${chartType === 'bar' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}><BarChart2 className="w-4 h-4" /></button><button onClick={() => setChartType('line')} className={`p-1.5 rounded ${chartType === 'line' ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}><TrendingUp className="w-4 h-4" /></button></div>
               {role === 'owner' && <div className="flex space-x-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg"><button onClick={() => setActiveMetric('fuel')} className={`px-3 py-1 text-xs rounded ${activeMetric === 'fuel' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>Fuel</button><button onClick={() => setActiveMetric('revenue')} className={`px-3 py-1 text-xs rounded ${activeMetric === 'revenue' ? 'bg-white shadow text-green-600' : 'text-slate-500'}`}>Revenue</button></div>}
            </div>
          </div>
          {role === 'manager' && <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-10"><div className="bg-white dark:bg-slate-800 p-4 rounded shadow border dark:border-slate-600 flex items-center"><ShieldAlert className="w-5 h-5 text-red-500 mr-2" /><span className="font-medium dark:text-white">Owner Access Only</span></div></div>}
          <div className="h-64">{renderChart()}</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"><h3 className="font-bold text-slate-800 dark:text-white flex items-center"><AlertOctagon className="w-4 h-4 mr-2 text-red-500" /> Critical Attention</h3></div>
          <div className="flex-1 overflow-y-auto max-h-[300px] p-2 space-y-2">
             {criticalAlerts.length === 0 ? <div className="text-center py-10 text-slate-400">No alerts</div> : criticalAlerts.map(v => (
               <div key={v.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between bg-red-50 dark:bg-red-900/10">
                  <div className="flex items-center space-x-3"><AlertTriangle className="w-5 h-5 text-red-500" /><div><div className="font-bold text-sm text-red-700 dark:text-red-400">Action Required</div><div className="text-xs opacity-80 dark:text-slate-300">{v.regNumber}</div></div></div>
                  <button onClick={() => onViewVehicle(v)} className="text-xs bg-white dark:bg-slate-800 border px-2 py-1 rounded shadow-sm hover:text-blue-600">View</button>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;