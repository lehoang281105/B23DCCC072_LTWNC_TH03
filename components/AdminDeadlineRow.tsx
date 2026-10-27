'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import type { Deadline, Subject } from '@/types';
import { formatDate, getPriorityBadge } from '@/lib/utils';
import { deleteDeadlineAction } from '@/app/actions/deadlines';
import { Trash2, Loader2, ExternalLink } from 'lucide-react';

interface AdminDeadlineRowProps {
  deadline: Deadline;
  subject?: Subject;
}

export default function AdminDeadlineRow({ deadline, subject }: AdminDeadlineRowProps) {
  const [isPending, startTransition] = useTransition();
  const priorityInfo = getPriorityBadge(deadline.priority);

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xoá deadline: "${deadline.title}"?`)) {
      startTransition(async () => {
        try {
          await deleteDeadlineAction(deadline.id);
        } catch (err: any) {
          alert(err.message || 'Lỗi khi xoá deadline');
        }
      });
    }
  };

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/60 dark:border-slate-800/80 dark:hover:bg-slate-900/40 transition">
      <td className="px-4 py-3.5">
        <div className="font-semibold text-slate-900 dark:text-white">
          {deadline.title}
        </div>
        <div className="text-xs text-slate-500 line-clamp-1">
          {deadline.description}
        </div>
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">
        {subject?.name ?? deadline.subjectSlug}
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">
        {formatDate(deadline.dueDate)}
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap">
        <span
          className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityInfo.className}`}
        >
          {priorityInfo.label}
        </span>
      </td>

      <td className="px-4 py-3.5 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/deadlines/${deadline.id}`}
            target="_blank"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 transition"
            title="Xem trang chi tiết"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>

          <button
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition disabled:opacity-50"
            title="Xoá deadline"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}

