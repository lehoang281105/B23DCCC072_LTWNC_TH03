'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { LogIn, Loader2, KeyRound, Mail, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const { data: session, status } = useSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      window.location.href = callbackUrl;
    }
  }, [status, session, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError('Email hoặc mật khẩu không chính xác. Vui lòng thử lại!');
        setLoading(false);
      } else {
        window.location.href = res?.url || callbackUrl;
      }
    } catch {
      setError('Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const fillAccount = (type: 'admin' | 'sv') => {
    if (type === 'admin') {
      setEmail('admin@ptit.edu.vn');
      setPassword('admin123');
    } else {
      setEmail('sv@ptit.edu.vn');
      setPassword('sv123456');
    }
    setError('');
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
          <LogIn className="h-5 w-5" />
        </div>
        <h1 className="mt-4 text-xl font-extrabold text-slate-900">
          Đăng Nhập Tài Khoản Lớp
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Truy cập hệ thống quản lý deadline lớp học
        </p>
      </div>

      <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
        <span className="block text-center text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-2">
          ⚡ Điền nhanh tài khoản kiểm thử:
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillAccount('admin')}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-emerald-50 hover:text-emerald-700 transition"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-rose-500" />
            Lớp trưởng (Admin)
          </button>
          <button
            type="button"
            onClick={() => fillAccount('sv')}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-emerald-50 hover:text-emerald-700 transition"
          >
            <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
            Sinh viên (User)
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@ptit.edu.vn"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mật khẩu
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang xác thực...
            </>
          ) : (
            'Đăng nhập ngay'
          )}
        </button>
      </form>
    </div>
  );
}
