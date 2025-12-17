export const getExpiryStatus = (dateString: string) => {
  if (!dateString) return { color: 'text-slate-400 bg-slate-100 dark:bg-slate-800 dark:text-slate-400', label: 'N/A', status: 'unknown' };
  const today = new Date();
  const expiry = new Date(dateString);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { color: 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800', label: `Expired`, status: 'critical' };
  if (diffDays < 30) return { color: 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800', label: `${diffDays} Days`, status: 'warning' };
  return { color: 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800', label: 'Valid', status: 'good' };
};

export const calculateHealthColor = (score: number) => {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
};