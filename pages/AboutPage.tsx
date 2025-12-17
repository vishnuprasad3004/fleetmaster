import React from 'react';

const AboutPage = () => (
  <div className="py-20 bg-white dark:bg-slate-900 min-h-screen">
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">About FleetMaster Pro</h2>
      <div className="prose prose-slate dark:prose-invert lg:prose-lg">
        <p className="mb-4 text-slate-600 dark:text-slate-300">FleetMaster Pro simplifies logistics. We manage fleets, ensure safety, and optimize costs.</p>
      </div>
    </div>
  </div>
);

export default AboutPage;