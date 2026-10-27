import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getSubjects, getSubjectBySlug, getDeadlinesBySubject } from '@/lib/data';
import DeadlineCard from '@/components/DeadlineCard';
import Sidebar from '@/components/Sidebar';
import { BookOpen, User, Award, ArrowLeft, Calendar } from 'lucide-react';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const subjects = await getSubjects();
  return subjects.map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    return { title: 'Môn học không tồn tại' };
  }

  return {
    title: `${subject.name} (${subject.code})`,
    description: subject.description,
    openGraph: {
      title: `${subject.name} - Class Deadline Hub`,
      description: subject.description,
    },
  };
}

export default async function SubjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    notFound();
  }

  const deadlines = await getDeadlinesBySubject(slug);

  return (
    <div className="flex flex-1 min-h-[750px]">
      <Suspense fallback={<div className="w-60 border-r border-slate-100 bg-white" />}>
        <Sidebar />
      </Suspense>

      <div className="flex-1 p-6 lg:p-8 bg-white min-w-0 space-y-6">
        <div>
          <Link
            href="/deadlines"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-600 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Quay lại tất cả Deadlines
          </Link>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/60 to-white p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white">
              {subject.code}
            </span>
            <span className="text-xs text-slate-400">
              #{subject.slug}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium ml-2">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              {subject.credits} tín chỉ
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
              <User className="h-3.5 w-3.5 text-indigo-500" />
              Giảng viên: {subject.instructor}
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold text-slate-900">
            {subject.name}
          </h1>

          <p className="mt-2 text-xs text-slate-600 leading-relaxed max-w-3xl">
            {subject.description}
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900">
              Deadlines Của Môn Học ({deadlines.length})
            </h2>
          </div>

          {deadlines.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {deadlines.map((deadline) => (
                <DeadlineCard
                  key={deadline.id}
                  deadline={deadline}
                  subject={subject}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
              <p className="text-xs text-slate-500">Chưa có bài tập nào cho môn học này.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
