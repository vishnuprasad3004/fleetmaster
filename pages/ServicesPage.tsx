import React from 'react';
import { CheckCircle } from 'lucide-react';

const ServicesPage = () => (
  <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen">
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Our Services</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {[
          { title: "Vehicle Data Collection", desc: "Complete repository for technical specs." },
          { title: "Driver Management", desc: "Performance monitoring." },
          { title: "Fleet Health Monitoring", desc: "Real-time health scores." },
          { title: "Fuel Credit System", desc: "Track fuel fills and credit." },
          { title: "Document Expiry Alerts", desc: "Never miss a renewal." },
          { title: "Bookings & Deliveries", desc: "Manage trip assignments." }
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-start">
            <CheckCircle className="w-6 h-6 text-blue-500 mt-1 mr-4 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">{s.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mt-2">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ServicesPage;