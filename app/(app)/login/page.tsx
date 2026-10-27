import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';
import { Suspense } from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Đăng Nhập Tài Khoản Lớp',
  description: 'Trang đăng nhập hệ thống Class Deadline Hub dành cho sinh viên và ban cán sự lớp.',
  robots: {
    index: false,
    follow: false,
  },
};

interface Props {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const session = await auth();
  const { callbackUrl } = await searchParams;

  if (session?.user) {
    redirect(callbackUrl || (session.user.role === 'admin' ? '/admin' : '/dashboard'));
  }

  return (
    <div className="flex flex-1 w-full min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50/70 px-4 py-12">
      <Suspense fallback={<div className="h-96 w-full max-w-md rounded-2xl bg-white shadow-sm border border-slate-200/80 animate-pulse" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
