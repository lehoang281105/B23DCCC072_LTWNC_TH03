import Header from '@/components/Header';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50/60">
      <Header />
      <main className="flex-1 flex flex-col w-full">{children}</main>
    </div>
  );
}
