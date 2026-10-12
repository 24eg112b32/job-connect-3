import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const upper = (status || '').toUpperCase();

  const getStyle = () => {
    switch (upper) {
      case 'APPLIED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SHORTLISTED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'INTERVIEW':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SELECTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'INACTIVE':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getDotStyle = () => {
    switch (upper) {
      case 'APPLIED':
        return 'bg-blue-500';
      case 'SHORTLISTED':
        return 'bg-amber-500';
      case 'INTERVIEW':
        return 'bg-purple-500';
      case 'SELECTED':
        return 'bg-emerald-500';
      case 'REJECTED':
        return 'bg-rose-500';
      case 'ACTIVE':
        return 'bg-emerald-500';
      default:
        return 'bg-slate-400';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${getStyle()}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${getDotStyle()}`} />
      {upper}
    </span>
  );
};
