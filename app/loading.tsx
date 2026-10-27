import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      <span className="text-xs font-semibold text-slate-500">
        Đang tải dữ liệu Class Deadline Hub...
      </span>
    </div>
  );
}
