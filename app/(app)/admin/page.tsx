import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { auth } from '@/auth';
import { getDeadlines, getSubjects } from '@/lib/data';
import CreateDeadlineForm from '@/components/CreateDeadlineForm';
import AdminDeadlineRow from '@/components/AdminDeadlineRow';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bảng Quản Trị Deadline — Dành Cho Lớp Trưởng',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }

  if (session.user.role !== 'admin') {
    redirect('/403');
  }

  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  const subjectMap = new Map(subjects.map((s) => [s.slug, s]));

  return (
    <div className="space-y-6 p-6 sm:p-8 bg-white">
      <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/70 to-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Khu vực dành riêng cho Lớp trưởng (Admin)
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Quản Trị Deadline Lớp Học
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              Đăng nhập với tư cách: <strong>{session.user.name}</strong> ({session.user.email})
            </p>
          </div>

          <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-2xs text-right">
            <div className="text-xs text-slate-400 font-medium">Tổng số deadline quản lý</div>
            <div className="text-2xl font-black text-emerald-600">
              {deadlines.length}
            </div>
          </div>
        </div>
      </div>

      <CreateDeadlineForm subjects={subjects} />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">
            Danh Sách Deadline Hiện Tại ({deadlines.length})
          </h2>
          <span className="text-xs text-slate-400">
            Hành động thêm/xoá tự động kích hoạt ISR on-demand (revalidatePath)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] uppercase font-bold text-slate-400">
              <tr>
                <th className="px-4 py-3">Tiêu đề</th>
                <th className="px-4 py-3">Môn học</th>
                <th className="px-4 py-3">Hạn nộp</th>
                <th className="px-4 py-3">Mức độ</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {deadlines.map((deadline) => (
                <AdminDeadlineRow
                  key={deadline.id}
                  deadline={deadline}
                  subject={subjectMap.get(deadline.subjectSlug)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
