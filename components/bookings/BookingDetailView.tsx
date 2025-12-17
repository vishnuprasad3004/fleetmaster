import React from 'react';
import { ChevronLeft, UserCog, Navigation, MapPin, Gauge, Fuel, Timer } from 'lucide-react';
import { Booking } from '../../types';

interface BookingDetailViewProps {
  booking: Booking;
  onBack: () => void;
}

const BookingDetailView: React.FC<BookingDetailViewProps> = ({ booking, onBack }) => {
  if (!booking) return null;
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition text-slate-600 dark:text-slate-300"><ChevronLeft className="w-6 h-6" /></button>
        <div><h2 className="text-2xl font-bold text-slate-800 dark:text-white">Order #{booking.id}</h2><p className="text-slate-500 dark:text-slate-400">Invoice & Tracking Details</p></div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm md:col-span-2">
           <div className="flex justify-between mb-8 border-b dark:border-slate-700 pb-4">
              <div><h3 className="font-bold text-xl text-slate-800 dark:text-white">INVOICE</h3><p className="text-sm text-slate-500">FleetMaster Logistics Ltd.</p></div>
              <div className="text-right"><div className="font-bold text-slate-700 dark:text-slate-200">Bill To:</div><div className="text-slate-600 dark:text-slate-400">{booking.client}</div></div>
           </div>
           <div className="grid grid-cols-2 gap-8 mb-8">
              <div><div className="text-xs uppercase text-slate-400 font-bold">Route</div><div className="font-medium dark:text-white">{booking.from} ➝ {booking.to}</div></div>
              <div><div className="text-xs uppercase text-slate-400 font-bold">Date</div><div className="font-medium dark:text-white">{booking.date}</div></div>
              <div><div className="text-xs uppercase text-slate-400 font-bold">Items</div><div className="font-medium dark:text-white">{booking.items || 'General Cargo'}</div></div>
              <div><div className="text-xs uppercase text-slate-400 font-bold">Total Value</div><div className="font-bold text-lg text-green-600">₹ {booking.value}</div></div>
           </div>
           <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg flex flex-col gap-3">
              <div className="flex justify-between items-center">
                 <div><div className="text-sm font-bold dark:text-white">Assigned Vehicle</div><div className="text-xs text-slate-500 dark:text-slate-400">{booking.vehicle}</div></div>
                 <div><div className="text-sm font-bold dark:text-white">Driver</div><div className="text-xs text-slate-500 dark:text-slate-400">{booking.driver}</div></div>
              </div>
              <div className="border-t dark:border-slate-600 pt-2 flex items-center mt-2">
                 <UserCog className="w-4 h-4 mr-2 text-indigo-500" />
                 <div><div className="text-xs uppercase text-slate-400 font-bold">Placed By</div><div className="text-sm font-bold dark:text-white">{booking.manager}</div></div>
              </div>
           </div>
        </div>
        <div className="space-y-6">
           <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center"><Navigation className="w-4 h-4 mr-2 text-blue-500" /> Live Tracking</h3>
              <div className="h-48 bg-slate-100 dark:bg-slate-900 rounded-lg mb-4 flex items-center justify-center border dark:border-slate-700 relative">
                 <div className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/10"></div>
                 <MapPin className="w-8 h-8 text-red-500 animate-bounce z-10" />
                 <span className="absolute bottom-2 left-2 bg-white dark:bg-slate-800 text-xs px-2 py-1 rounded shadow">Live GPS</span>
              </div>
              <div className="space-y-3">
                 <div className="flex justify-between items-center"><span className="text-slate-500 text-sm flex items-center"><Gauge className="w-4 h-4 mr-2" /> Speed</span><span className="font-bold dark:text-white">65 km/h</span></div>
                 <div className="flex justify-between items-center"><span className="text-slate-500 text-sm flex items-center"><Fuel className="w-4 h-4 mr-2" /> Fuel</span><span className="font-bold dark:text-white">72%</span></div>
                 <div className="flex justify-between items-center"><span className="text-slate-500 text-sm flex items-center"><Timer className="w-4 h-4 mr-2" /> Est. Time</span><span className="font-bold text-green-600">{booking.estDays} Days</span></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailView;