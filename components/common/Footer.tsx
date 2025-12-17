import React from 'react';
import { Truck } from 'lucide-react';

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 py-12">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center text-white mb-4">
          <Truck className="h-6 w-6 text-blue-500" />
          <span className="ml-2 text-lg font-bold">FleetMasterPro</span>
        </div>
        <p className="text-slate-400 text-sm">
          Advanced logistics & transport management solution for modern fleets.
        </p>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4">Services</h3>
        <ul className="space-y-2 text-sm">
          <li>Fleet Tracking</li>
          <li>Fuel Management</li>
          <li>Predictive Maintenance</li>
          <li>Driver Analytics</li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4">Company</h3>
        <ul className="space-y-2 text-sm">
          <li>About Us</li>
          <li>Careers</li>
          <li>Privacy Policy</li>
          <li>Contact</li>
        </ul>
      </div>
      <div>
        <h3 className="text-white font-semibold mb-4">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-slate-800 rounded text-xs">React</span>
          <span className="px-2 py-1 bg-slate-800 rounded text-xs">Firebase</span>
          <span className="px-2 py-1 bg-slate-800 rounded text-xs">Tailwind</span>
          <span className="px-2 py-1 bg-slate-800 rounded text-xs">Recharts</span>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
      © 2024 FleetMaster Pro. All rights reserved.
    </div>
  </footer>
);

export default Footer;