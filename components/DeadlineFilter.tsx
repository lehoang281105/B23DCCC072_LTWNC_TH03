'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Deadline, Subject } from '@/types';
import DeadlineCard from './DeadlineCard';
import { Search, Plus, Calendar, ChevronDown, X } from 'lucide-react';

interface DeadlineFilterProps {
  deadlines: Deadline[];
  subjects: Subject[];
  userRole?: string;
}

export default function DeadlineFilter({
  deadlines,
  subjects,
  userRole,
}: DeadlineFilterProps) {
  const searchParams = useSearchParams();
  const urlQ = searchParams.get('q') || '';

  const [activeTab, setActiveTab] = useState<'recents' | 'upcoming' | 'overdue' | 'completed'>('recents');
  const [search, setSearch] = useState(urlQ);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState<'due-asc' | 'due-desc'>('due-asc');

  useEffect(() => {
    setSearch(urlQ);
  }, [urlQ]);

  const subjectMap = useMemo(() => {
    return new Map(subjects.map((s) => [s.slug, s]));
  }, [subjects]);

  const filteredDeadlines = useMemo(() => {
    const now = new Date();
    const query = search.trim().toLowerCase();

    let list = deadlines.filter((d) => {
      if (query) {
        const subject = subjectMap.get(d.subjectSlug);
        const matchTitle = d.title.toLowerCase().includes(query);
        const matchDesc = d.description.toLowerCase().includes(query);
        const matchSubjectName = subject ? subject.name.toLowerCase().includes(query) : false;
        const matchSubjectCode = subject ? subject.code.toLowerCase().includes(query) : false;
        const matchSubjectSlug = d.subjectSlug.toLowerCase().includes(query);

        if (!matchTitle && !matchDesc && !matchSubjectName && !matchSubjectCode && !matchSubjectSlug) {
          return false;
        }
      }

      if (selectedSubject !== 'all' && d.subjectSlug !== selectedSubject) {
        return false;
      }

      const due = new Date(d.dueDate);
      if (activeTab === 'upcoming') {
        return due >= now;
      }
      if (activeTab === 'overdue') {
        return due < now;
      }

      return true;
    });

    list.sort((a, b) => {
      const timeA = new Date(a.dueDate).getTime();
      const timeB = new Date(b.dueDate).getTime();
      return sortBy === 'due-asc' ? timeA - timeB : timeB - timeA;
    });

    return list;
  }, [deadlines, search, selectedSubject, activeTab, sortBy, subjectMap]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-4">
        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Danh Sách Deadline Lớp
          </h1>

          <div className="flex items-center gap-5 text-xs font-semibold text-slate-500">
            <button
              onClick={() => setActiveTab('recents')}
              className={`relative py-1 transition ${activeTab === 'recents'
                  ? 'text-slate-900 font-bold after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600'
                  : 'hover:text-slate-800'
                }`}
            >
              Gần đây
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`relative py-1 transition ${activeTab === 'upcoming'
                  ? 'text-slate-900 font-bold after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600'
                  : 'hover:text-slate-800'
                }`}
            >
              Sắp tới hạn
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`relative py-1 transition ${activeTab === 'overdue'
                  ? 'text-slate-900 font-bold after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-emerald-600'
                  : 'hover:text-slate-800'
                }`}
            >
              Quá hạn
            </button>
            <Link
              href="/dashboard?filter=completed"
              className="hover:text-slate-800 transition"
            >
              Đã hoàn thành
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-48 sm:w-56">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm deadline..."
              className="w-full rounded-lg border border-slate-200/90 bg-white py-1.5 pl-3 pr-8 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-hidden"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                title="Xóa tìm kiếm"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Search className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            )}
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none rounded-lg border border-slate-200/90 bg-white py-1.5 pl-3 pr-7 text-xs font-medium text-slate-600 focus:border-emerald-500 focus:outline-hidden cursor-pointer"
            >
              <option value="due-asc">Sắp xếp: Hạn nộp (Tăng dần)</option>
              <option value="due-desc">Sắp xếp: Hạn nộp (Giảm dần)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>

          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="appearance-none rounded-lg border border-slate-200/90 bg-white py-1.5 pl-3 pr-7 text-xs font-medium text-slate-600 focus:border-emerald-500 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Tất cả môn học</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.slug}>
                  #{s.slug}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            Thêm Deadline Mới
          </Link>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
          <span>Mức độ ưu tiên:</span>
          <span className="flex items-center gap-1">
            Thấp <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
          </span>
          <span className="flex items-center gap-1">
            Vừa <span className="h-2 w-2 rounded-full bg-amber-500 ring-2 ring-amber-200" />
          </span>
          <span className="flex items-center gap-1">
            Cao <span className="h-2 w-2 rounded-full bg-rose-500 ring-2 ring-rose-200" />
          </span>
        </div>
      </div>

      {filteredDeadlines.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredDeadlines.map((deadline) => (
            <DeadlineCard
              key={deadline.id}
              deadline={deadline}
              subject={subjectMap.get(deadline.subjectSlug)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-12 text-center bg-slate-50/50">
          <Calendar className="h-8 w-8 text-slate-400 mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">
            Không tìm thấy deadline phù hợp
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Hãy chuyển sang tab khác hoặc xóa bộ lọc tìm kiếm.
          </p>
        </div>
      )}
    </div>
  );
}
