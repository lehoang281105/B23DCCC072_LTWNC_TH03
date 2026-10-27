'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { LogOut, LogIn, ShieldAlert, LayoutDashboard, Settings } from 'lucide-react';

export default function UserNav() {
  const { data: session, status } = useSession();
  const user = session?.user;

  if (status === 'loading') {
    return (
      <div className="h-9 w-28 rounded-full bg-slate-100 animate-pulse" />
    );
  }

  if (user) {
    const isLopTruong = user.role === 'admin';
    const initial = user.name?.charAt(0).toUpperCase() || 'U';

    return (
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
        >
          <LayoutDashboard className="h-3.5 w-3.5 text-slate-500" />
          Bảng của tôi
        </Link>

        {isLopTruong && (
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-emerald-600" />
            Quản trị
          </Link>
        )}

        <button
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          title="Cài đặt"
        >
          <Settings className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
          <div
            className={`relative flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-xs ${
              isLopTruong ? 'bg-gradient-to-tr from-emerald-600 to-teal-500' : 'bg-gradient-to-tr from-blue-600 to-indigo-500'
            }`}
          >
            {initial}
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white" />
          </div>

          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 line-clamp-1 max-w-[110px]">
              {user.name}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">
              {isLopTruong ? 'Lớp trưởng' : 'Sinh viên'}
            </span>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition ml-1"
            title="Đăng xuất"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
    >
      <LogIn className="h-3.5 w-3.5" />
      Đăng nhập
    </Link>
  );
}
