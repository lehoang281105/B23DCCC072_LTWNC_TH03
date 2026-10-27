import type { Metadata } from 'next';
import { getDeadlines, getSubjects } from '@/lib/data';
import DeadlineFilter from '@/components/DeadlineFilter';
import Sidebar from '@/components/Sidebar';
import { Suspense } from 'react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Danh Sách Tất Cả Deadline Lớp Học',
  description:
    'Xem danh sách hạn nộp bài tập, tiểu luận của tất cả các môn học. Lọc theo môn học, mức độ ưu tiên và trạng thái hạn.',
};

export default async function DeadlinesPage() {
  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  return (
    <div className="flex flex-1 min-h-[750px]">
      <Suspense fallback={<div className="w-60 border-r border-slate-100 bg-white" />}>
        <Sidebar />
      </Suspense>

      <div className="flex-1 p-6 lg:p-8 bg-white min-w-0">
        <Suspense fallback={<div className="h-96 w-full rounded-2xl bg-slate-50 animate-pulse" />}>
          <DeadlineFilter deadlines={deadlines} subjects={subjects} />
        </Suspense>
      </div>
    </div>
  );
}
