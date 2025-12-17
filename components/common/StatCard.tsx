import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  trend?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend, onClick }) => (
  <div onClick={onClick} className={`bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all ${onClick ? 'cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 transform hover:-translate-y-1' : ''}`}>
    <div className="flex justify-between items-start">
      <div><p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</p><h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{value}</h3>{trend && <span className="text-green-500 text-xs font-medium mt-1 inline-block">{trend}</span>}</div>
      <div className={`p-3 rounded-lg ${color} shadow-lg`}><Icon className="w-6 h-6 text-white" /></div>
    </div>
  </div>
);

export default StatCard;