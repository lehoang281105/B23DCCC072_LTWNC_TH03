import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import UserNav from './UserNav';
import HeaderSearch from './HeaderSearch';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 px-6 py-3.5 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <Image
            src="/logo.svg"
            alt="Cổng Deadline Lớp Học"
            width={150}
            height={36}
            priority
          />
        </Link>

        <div className="flex flex-1 items-center justify-end gap-5">
          <Suspense fallback={<div className="hidden sm:flex w-64 lg:w-80 h-8 rounded-xl bg-slate-50/70 animate-pulse" />}>
            <HeaderSearch />
          </Suspense>

          <UserNav />
        </div>
      </div>
    </header>
  );
}
