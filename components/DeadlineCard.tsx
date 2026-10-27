import Link from 'next/link';
import type { Deadline, Subject } from '@/types';
import { formatDate, getCountdown } from '@/lib/utils';
import { Calendar, Clock, MoreHorizontal, ArrowUpRight } from 'lucide-react';

interface DeadlineCardProps {
  deadline: Deadline;
  subject?: Subject;
  completed?: boolean;
  actionSlot?: React.ReactNode;
}

export default function DeadlineCard({
  deadline,
  subject,
  completed,
  actionSlot,
}: DeadlineCardProps) {
  const { text: dueInText, isOverdue } = getCountdown(deadline.dueDate);

  const priorityDotColor =
    deadline.priority === 'high'
      ? 'bg-rose-500 ring-rose-200'
      : deadline.priority === 'medium'
      ? 'bg-amber-500 ring-amber-200'
      : 'bg-emerald-500 ring-emerald-200';

  const priorityLabel =
    deadline.priority === 'high'
      ? 'Ưu tiên cao'
      : deadline.priority === 'medium'
      ? 'Ưu tiên vừa'
      : 'Ưu tiên thấp';

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl border bg-white p-5 transition-all duration-200 hover:shadow-md ${
        completed
          ? 'border-emerald-200 bg-emerald-50/20'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
              <Link href={`/deadlines/${deadline.id}`} className="hover:underline">
                {deadline.title}
              </Link>
            </h3>
            <span
              className={`inline-block h-2 w-2 rounded-full ring-2 ${priorityDotColor}`}
              title={`Mức độ ưu tiên: ${priorityLabel}`}
            />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {actionSlot}
            <Link
              href={`/deadlines/${deadline.id}`}
              className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              title="Xem chi tiết"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-1 text-xs text-slate-400">
          Giao bởi{' '}
          <span className="font-medium text-slate-600">Lớp trưởng</span> tới{' '}
          {subject ? (
            <Link
              href={`/subjects/${subject.slug}`}
              className="font-medium text-emerald-600 hover:underline"
            >
              #{subject.slug}
            </Link>
          ) : (
            <span className="font-medium text-slate-500">#{deadline.subjectSlug}</span>
          )}
        </div>

        <p className="mt-3 line-clamp-2 text-xs text-slate-500 leading-relaxed">
          {deadline.description}
        </p>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-3">
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <div>
            <div className="flex items-center gap-1 text-slate-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
              Ngày giao:
            </div>
            <div className="mt-0.5 font-semibold text-slate-700 truncate">
              {formatDate(deadline.createdAt).split(' ')[1] || '20/10/2026'}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-slate-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
              Hạn nộp:
            </div>
            <div className="mt-0.5 font-semibold text-slate-700 truncate">
              {formatDate(deadline.dueDate).split(' ')[1] || '31/10/2026'}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-slate-400 font-medium">
              <Clock className={`h-3 w-3 ${isOverdue ? 'text-rose-500' : 'text-emerald-500'}`} />
              Còn lại:
            </div>
            <div
              className={`mt-0.5 font-bold truncate ${
                isOverdue ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {dueInText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
