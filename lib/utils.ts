export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getCountdown(dueDateString: string): {
  text: string;
  isOverdue: boolean;
  days: number;
} {
  const now = new Date();
  const due = new Date(dueDateString);
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: `Quá hạn ${Math.abs(diffDays)} ngày`,
      isOverdue: true,
      days: diffDays,
    };
  } else if (diffDays === 0) {
    return {
      text: 'Hôm nay đến hạn',
      isOverdue: false,
      days: 0,
    };
  } else {
    return {
      text: `Còn ${diffDays} ngày`,
      isOverdue: false,
      days: diffDays,
    };
  }
}

export function getPriorityBadge(priority: 'low' | 'medium' | 'high') {
  switch (priority) {
    case 'high':
      return {
        label: 'Ưu tiên cao',
        className: 'bg-red-500/10 text-red-600 border border-red-500/20 dark:text-red-400',
      };
    case 'medium':
      return {
        label: 'Ưu tiên vừa',
        className: 'bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400',
      };
    case 'low':
      return {
        label: 'Ưu tiên thấp',
        className: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400',
      };
  }
}

