import React from 'react';
import { Mail } from 'lucide-react';

const ContactPage = () => (
  <div className="py-20 bg-slate-50 dark:bg-slate-950 min-h-screen">
    <div className="max-w-3xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">Contact Us</h2>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-8 text-center">
          <Mail className="w-8 h-8 mx-auto text-blue-500 mb-4" />
          <p className="text-lg font-medium dark:text-white">support@fleetmaster.pro</p>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPage;