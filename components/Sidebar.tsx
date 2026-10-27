'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Calendar,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  const isDeadlinesActive = (pathname === '/' || pathname === '/deadlines') && !filter;
  const isDashboardActive = pathname === '/dashboard' && !filter;
  const isPendingActive = pathname === '/dashboard' && filter === 'pending';
  const isCompletedActive = (pathname === '/dashboard' || pathname === '/deadlines') && filter === 'completed';
  const isAdminActive = pathname === '/admin';

  return (
    <aside className="w-full shrink-0 md:w-56 border-r border-slate-100 bg-white p-4 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Điều Hướng Lớp
        </div>

        <nav className="space-y-1">
          <Link
            href="/deadlines"
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${isDeadlinesActive
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <Calendar className={`h-4 w-4 ${isDeadlinesActive ? 'text-emerald-600' : 'text-slate-400'}`} />
            Tất cả Deadline
          </Link>

          <Link
            href="/dashboard"
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${isDashboardActive
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <LayoutDashboard className={`h-4 w-4 ${isDashboardActive ? 'text-emerald-600' : 'text-slate-400'}`} />
            Bảng của tôi
          </Link>

          <Link
            href="/dashboard?filter=pending"
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${isPendingActive
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <Clock className={`h-4 w-4 ${isPendingActive ? 'text-emerald-600' : 'text-slate-400'}`} />
            Cần làm gấp
          </Link>

          <Link
            href="/dashboard?filter=completed"
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${isCompletedActive
                ? 'bg-emerald-50 text-emerald-800 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <CheckCircle2 className={`h-4 w-4 ${isCompletedActive ? 'text-emerald-600' : 'text-slate-400'}`} />
            Đã hoàn thành
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${isAdminActive
                  ? 'bg-emerald-50 text-emerald-800 font-bold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <ShieldAlert className={`h-4 w-4 ${isAdminActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              Quản trị (Admin)
            </Link>
          )}
        </nav>
      </div>

    </aside>
  );
}
