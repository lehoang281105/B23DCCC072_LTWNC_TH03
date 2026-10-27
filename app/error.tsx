'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="flex flex-1 min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md rounded-2xl border border-rose-200 bg-white p-8 shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertCircle className="h-7 w-7" />
        </div>

        <h2 className="mt-4 text-xl font-bold text-slate-900">
          Đã Có Lỗi Xảy Ra!
        </h2>

        <p className="mt-2 text-xs text-slate-500 leading-relaxed">
          {error.message || 'Hệ thống gặp sự cố trong quá trình xử lý yêu cầu. Vui lòng bấm thử lại.'}
        </p>

        <div className="mt-6">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
          >
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </button>
        </div>
      </div>
    </div>
  );
}
