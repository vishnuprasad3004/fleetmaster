import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Booking } from '../../types';
import { generateMockBookings } from '../../utils/mockData';

interface BookingsPageProps {
  role?: string;
  onSelectBooking: (b: Booking) => void;
}

const BookingsPage: React.FC<BookingsPageProps> = ({ role, onSelectBooking }) => {
  const [bookings] = useState(generateMockBookings());
  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center"><div><h2 className="text-2xl font-bold text-slate-800 dark:text-white">Order Management</h2><p className="text-slate-500 dark:text-slate-400 text-sm">Active Bookings & Tracking</p></div>{role === 'manager' && <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-indigo-700"><Plus className="w-4 h-4 mr-2" /> Place New Order</button>}</div>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left"><thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase font-bold text-xs"><tr><th className="px-6 py-3">Order ID</th><th className="px-6 py-3">Client</th><th className="px-6 py-3">Manager</th><th className="px-6 py-3">Route</th><th className="px-6 py-3">Vehicle / Driver</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-700">{bookings.map((b) => (<tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 dark:text-slate-300"><td className="px-6 py-4 font-bold text-indigo-600">#{b.id}</td><td className="px-6 py-4">{b.client}</td><td className="px-6 py-4 text-slate-500">{b.manager}</td><td className="px-6 py-4">{b.from} ➝ {b.to}</td><td className="px-6 py-4"><div className="text-xs"><div className="font-bold">{b.vehicle}</div><div className="text-slate-500">{b.driver}</div></div></td><td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${b.status === 'In Transit' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{b.status}</span></td><td className="px-6 py-4"><button onClick={() => onSelectBooking(b)} className="text-blue-600 font-medium hover:underline">View Details</button></td></tr>))}</tbody></table>
      </div>
    </div>
  );
};

export default BookingsPage;