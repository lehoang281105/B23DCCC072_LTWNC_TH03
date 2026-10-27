'use client';

import { useEffect, useState } from 'react';
import { getCountdown } from '@/lib/utils';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownBadgeProps {
  dueDate: string;
}

export default function CountdownBadge({ dueDate }: CountdownBadgeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        <Clock className="w-3.5 h-3.5" />
        Đang tính...
      </span>
    );
  }

  const { text, isOverdue } = getCountdown(dueDate);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-xs ${
        isOverdue
          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
      }`}
    >
      {isOverdue ? (
        <AlertTriangle className="w-3.5 h-3.5 animate-pulse text-rose-600 dark:text-rose-400" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
      )}
      {text}
    </span>
  );
}

