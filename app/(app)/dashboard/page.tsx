import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { auth } from '@/auth';
import { getDeadlines, getSubjects, getCompletionsByUser } from '@/lib/data';
import DeadlineCard from '@/components/DeadlineCard';
import CompleteButton from '@/components/CompleteButton';
import { CheckCircle2, Clock, ListTodo, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bảng Điều Khiển Deadline Cá Nhân',
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  searchParams: Promise<{ filter?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const { filter } = await searchParams;
  const userId = session.user.id;

  const [deadlines, subjects, completions] = await Promise.all([
    getDeadlines(),
    getSubjects(),
    getCompletionsByUser(userId),
  ]);

  const subjectMap = new Map(subjects.map((s) => [s.slug, s]));
  const completedIdSet = new Set(completions.map((c) => c.deadlineId));

  const totalCount = deadlines.length;
  const completedCount = completedIdSet.size;
  const pendingCount = totalCount - completedCount;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const displayedDeadlines = deadlines.filter((d) => {
    const isDone = completedIdSet.has(d.id);
    if (filter === 'completed') return isDone;
    if (filter === 'pending') return !isDone;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-100 bg-gradient-to-r from-emerald-50/60 to-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
              <Sparkles className="h-3 w-3 text-emerald-600" />
              Không gian cá nhân
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Xin chào, {session.user.name}!
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Email: {session.user.email} • Vai trò: <strong className="text-slate-700 uppercase">{session.user.role}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-emerald-100 bg-white p-3 shadow-2xs">
            <div className="text-right">
              <div className="text-[11px] font-medium text-slate-400">Tiến độ nộp bài</div>
              <div className="text-lg font-black text-emerald-600">{percent}%</div>
            </div>
            <div className="h-10 w-10 rounded-full border-4 border-emerald-100 border-t-emerald-600 flex items-center justify-center font-bold text-xs text-emerald-700">
              {completedCount}/{totalCount}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-white p-3 border border-slate-100 shadow-2xs">
            <ListTodo className="h-5 w-5 text-indigo-600" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Tổng số deadline</div>
              <div className="text-sm font-bold text-slate-800">{totalCount} bài tập</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white p-3 border border-slate-100 shadow-2xs">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Đã hoàn thành</div>
              <div className="text-sm font-bold text-emerald-600">{completedCount} bài tập</div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white p-3 border border-slate-100 shadow-2xs">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Cần làm tiếp</div>
              <div className="text-sm font-bold text-amber-600">{pendingCount} bài tập</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h2 className="text-base font-bold text-slate-900">
          {filter === 'completed'
            ? 'Danh Sách Bài Tập Đã Hoàn Thành'
            : filter === 'pending'
            ? 'Danh Sách Bài Tập Cần Làm Gấp'
            : 'Tất Cả Deadlines Của Bạn'}
          <span className="ml-2 text-xs font-normal text-slate-400">
            ({displayedDeadlines.length})
          </span>
        </h2>
      </div>

      {displayedDeadlines.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {displayedDeadlines.map((deadline) => {
            const isDone = completedIdSet.has(deadline.id);
            return (
              <DeadlineCard
                key={deadline.id}
                deadline={deadline}
                subject={subjectMap.get(deadline.subjectSlug)}
                completed={isDone}
                actionSlot={
                  <CompleteButton
                    deadlineId={deadline.id}
                    isCompleted={isDone}
                  />
                }
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-slate-50/50">
          <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">
            Tuyệt vời! Không có deadline nào trong danh mục này.
          </h3>
        </div>
      )}
    </div>
  );
}
