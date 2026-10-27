import Link from 'next/link';
import { FileQuestion, ArrowLeft, Calendar } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-1 min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <FileQuestion className="h-7 w-7" />
        </div>

        <span className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
          MÃ LỖI 404
        </span>

        <h1 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          Không Tìm Thấy Trang
        </h1>

        <p className="mt-3 text-xs text-slate-500 leading-relaxed">
          Deadline hoặc đường dẫn bạn đang tìm kiếm không tồn tại, đã bị xoá hoặc liên kết đã hết hạn.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/deadlines"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
          >
            <Calendar className="h-4 w-4" />
            Xem danh sách Deadline
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Về Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
