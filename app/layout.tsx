import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import SessionProviderWrapper from '@/components/SessionProviderWrapper';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: {
    default: 'Class Deadline Hub — Cổng Quản Lý Deadline Lớp Học',
    template: '%s | Class Deadline Hub',
  },
  description:
    'Cổng thông tin tổng hợp, theo dõi và quản lý hạn nộp bài tập, tiểu luận cho sinh viên.',
  keywords: ['deadline', 'lớp học', 'sinh viên', 'bài tập lớn', 'quản lý hạn nộp'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full`}>
      <body className="min-h-screen w-full bg-white text-slate-800 font-sans antialiased flex flex-col m-0 p-0">
        <SessionProviderWrapper>
          <div className="flex-1 flex flex-col w-full min-h-screen">
            {children}
          </div>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
