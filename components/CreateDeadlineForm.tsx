'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createDeadlineAction } from '@/app/actions/deadlines';
import type { Subject } from '@/types';
import { PlusCircle, Loader2 } from 'lucide-react';

interface CreateDeadlineFormProps {
  subjects: Subject[];
}

export default function CreateDeadlineForm({ subjects }: CreateDeadlineFormProps) {
  const [state, formAction, isPending] = useActionState(createDeadlineAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <PlusCircle className="h-4 w-4 text-emerald-600" />
        <h2 className="text-sm font-bold text-slate-900">
          Thêm Deadline Mới Cho Lớp
        </h2>
      </div>

      {state?.error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
          {state.message}
        </div>
      )}

      <form ref={formRef} action={formAction} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tiêu đề Deadline *
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="Ví dụ: Báo cáo thực hành Buổi 8 NextAuth"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Môn học *
            </label>
            <select
              name="subjectSlug"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
            >
              <option value="">-- Chọn môn học --</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hạn nộp *
            </label>
            <input
              type="datetime-local"
              name="dueDate"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mức độ ưu tiên *
            </label>
            <select
              name="priority"
              defaultValue="medium"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
            >
              <option value="high">Ưu tiên cao</option>
              <option value="medium">Ưu tiên vừa</option>
              <option value="low">Ưu tiên thấp</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Mô tả chi tiết yêu cầu *
          </label>
          <textarea
            name="description"
            rows={3}
            required
            placeholder="Nội dung yêu cầu, file đính kèm, đường dẫn tài liệu..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <PlusCircle className="h-3.5 w-3.5" />
                Đăng Deadline
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
