import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getDeadlines, getDeadlineById, getSubjectBySlug } from '@/lib/data';
import { formatDate, getCountdown } from '@/lib/utils';
import CompleteButton from '@/components/CompleteButton';
import Sidebar from '@/components/Sidebar';
import {
  Calendar,
  BookOpen,
  ArrowLeft,
  Clock,
  Share2,
  FileText,
} from 'lucide-react';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map((d) => ({
    id: d.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  if (!deadline) {
    return {
      title: 'Deadline không tồn tại',
    };
  }

  const subject = await getSubjectBySlug(deadline.subjectSlug);
  const subjectName = subject?.name ?? deadline.subjectSlug;

  return {
    title: `${deadline.title} — Môn ${subjectName}`,
    description: deadline.description,
    alternates: {
      canonical: `/deadlines/${id}`,
    },
    openGraph: {
      title: `${deadline.title} | Deadline Hub`,
      description: `Hạn nộp: ${formatDate(deadline.dueDate)} • Môn: ${subjectName}`,
      type: 'article',
    },
  };
}

export default async function DeadlineDetailPage({ params }: Props) {
  const { id } = await params;
  const deadline = await getDeadlineById(id);

  if (!deadline) {
    notFound();
  }

  const subject = await getSubjectBySlug(deadline.subjectSlug);
  const { text: dueInText, isOverdue } = getCountdown(deadline.dueDate);

  const priorityText =
    deadline.priority === 'high'
      ? 'Ưu tiên cao'
      : deadline.priority === 'medium'
      ? 'Ưu tiên vừa'
      : 'Ưu tiên thấp';

  const priorityDot =
    deadline.priority === 'high'
      ? 'bg-rose-500 ring-rose-200'
      : deadline.priority === 'medium'
      ? 'bg-amber-500 ring-amber-200'
      : 'bg-emerald-500 ring-emerald-200';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: 'http://localhost:3000',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Danh sách Deadline',
        item: 'http://localhost:3000/deadlines',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: deadline.title,
        item: `http://localhost:3000/deadlines/${deadline.id}`,
      },
    ],
  };

  return (
    <div className="flex flex-1 min-h-[750px]">
      <Suspense fallback={<div className="w-60 border-r border-slate-100 bg-white" />}>
        <Sidebar />
      </Suspense>

      <div className="flex-1 p-6 lg:p-8 bg-white min-w-0 space-y-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />

        <div className="flex items-center justify-between">
          <Link
            href="/deadlines"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-600 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Quay lại tất cả Deadlines
          </Link>

          <CompleteButton deadlineId={deadline.id} />
        </div>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex flex-wrap items-center gap-3">
            {subject && (
              <Link
                href={`/subjects/${subject.slug}`}
                className="font-bold text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md transition"
              >
                #{subject.slug}
              </Link>
            )}

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <span className={`h-2.5 w-2.5 rounded-full ring-2 ${priorityDot}`} />
              Mức độ: <span className="font-bold">{priorityText}</span>
            </div>

            <div
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                isOverdue
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {dueInText}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {deadline.title}
          </h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-xl bg-slate-50/70 p-4 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white p-2 text-emerald-600 shadow-2xs">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Hạn nộp bài</div>
                <div className="text-xs font-bold text-slate-800">{formatDate(deadline.dueDate)}</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white p-2 text-emerald-600 shadow-2xs">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 font-medium">Ngày giao bài</div>
                <div className="text-xs font-bold text-slate-800">{formatDate(deadline.createdAt)}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Yêu cầu và Hướng dẫn thực hiện:
            </h2>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-5 text-xs leading-relaxed text-slate-700 whitespace-pre-line">
              {deadline.description}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Share2 className="h-3.5 w-3.5" />
              Link chia sẻ sinh ảnh OpenGraph động
            </div>
            <Link href="/deadlines" className="font-semibold text-emerald-600 hover:underline">
              Xem các deadline khác →
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
