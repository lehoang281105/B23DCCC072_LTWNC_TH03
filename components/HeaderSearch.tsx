'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

export default function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [query, setQuery] = useState(q);

  useEffect(() => {
    setQuery(q);
  }, [q]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/deadlines?q=${encodeURIComponent(trimmed)}`);
    } else if (pathname === '/deadlines') {
      router.push('/deadlines');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="hidden sm:flex relative w-64 lg:w-80">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm kiếm deadline, môn học..."
        className="w-full rounded-xl border border-slate-200/80 bg-slate-50/70 py-1.5 pl-3.5 pr-8 text-xs text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-hidden transition"
      />
      <button
        type="submit"
        title="Tìm kiếm"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition"
      >
        <Search className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}

