import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';

export const metadata: Metadata = {
  title: '403 — Từ Chối Quyền Truy Cập',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForbiddenPage() {
  return (
    <div className="flex flex-1 w-full min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-slate-50/70 px-4 py-12 text-center">
      <div className="rounded-2xl border border-rose-200 bg-white p-8 sm:p-12 shadow-sm max-w-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <ShieldAlert className="h-7 w-7" />
        </div>

        <span className="mt-4 inline-block rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold text-rose-700">
          MÃ LỖI 403: FORBIDDEN
        </span>

        <h1 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Truy Cập Bị Từ Chối
        </h1>

        <p className="mt-3 text-xs text-slate-600 leading-relaxed">
          Tài khoản của bạn không có vai trò <strong>Lớp trưởng (Admin)</strong> để truy cập vào khu vực quản trị này.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
          >
            <LayoutDashboard className="h-4 w-4" />
            Về Bảng cá nhân của bạn
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Về Trang Deadlines
          </Link>
        </div>
      </div>
    </div>
  );
}
