'use client';

import { useTransition, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toggleCompleteAction } from '@/app/actions/deadlines';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface CompleteButtonProps {
  deadlineId: string;
  isCompleted?: boolean;
}

export default function CompleteButton({
  deadlineId,
  isCompleted: initialCompleted = false,
}: CompleteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [completed, setCompleted] = useState(initialCompleted);

  useEffect(() => {
    setCompleted(initialCompleted);
  }, [initialCompleted]);

  const handleToggle = () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/deadlines/${deadlineId}`);
      return;
    }

    startTransition(async () => {
      try {
        const res = await toggleCompleteAction(deadlineId);
        setCompleted(res.completed);
        router.refresh();
      } catch (err: any) {
        alert(err.message || 'Lỗi khi cập nhật trạng thái');
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
        completed
          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : completed ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-white" />
      ) : (
        <Circle className="h-3.5 w-3.5 text-slate-400" />
      )}
      {completed ? 'Đã xong' : 'Đánh dấu xong'}
    </button>
  );
}

