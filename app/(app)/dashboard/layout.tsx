import Sidebar from '@/components/Sidebar';
import { Suspense } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 min-h-[750px]">
      <Suspense fallback={<div className="w-60 border-r border-slate-100 bg-white" />}>
        <Sidebar />
      </Suspense>
      <div className="flex-1 p-6 lg:p-8 bg-white min-w-0">{children}</div>
    </div>
  );
}
