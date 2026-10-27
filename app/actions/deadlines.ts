'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { createDeadline, deleteDeadline, toggleCompletion } from '@/lib/data';

const DeadlineSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  subjectSlug: z.string().min(1, 'Vui lòng chọn môn học hợp lệ'),
  dueDate: z.string().min(1, 'Vui lòng chọn hạn nộp'),
  priority: z.enum(['low', 'medium', 'high'], {
    message: 'Mức độ ưu tiên không hợp lệ',
  }),
});

export async function toggleCompleteAction(deadlineId: string) {
  const session = await auth();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  if (!session || !userId || !can(role, 'deadline:complete')) {
    throw new Error('Bạn không có quyền đánh dấu hoàn thành deadline.');
  }

  const result = await toggleCompletion(userId, deadlineId);
  revalidatePath('/dashboard');
  revalidatePath('/deadlines');
  return { success: true, completed: result.completed };
}

export async function createDeadlineAction(prevState: any, formData: FormData) {
  const session = await auth();
  const role = session?.user?.role;

  if (!can(role, 'deadline:create')) {
    return { error: 'Từ chối truy cập: Chỉ admin (Lớp trưởng) mới có quyền tạo deadline.' };
  }

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    subjectSlug: formData.get('subjectSlug'),
    dueDate: formData.get('dueDate'),
    priority: formData.get('priority'),
  };

  const validation = DeadlineSchema.safeParse(rawData);
  if (!validation.success) {
    const errorMsg = validation.error.issues.map((i) => i.message).join('. ');
    return { error: errorMsg };
  }

  try {
    const newDeadline = await createDeadline({
      title: validation.data.title,
      description: validation.data.description,
      subjectSlug: validation.data.subjectSlug,
      dueDate: new Date(validation.data.dueDate).toISOString(),
      priority: validation.data.priority,
    });

    revalidatePath('/deadlines');
    revalidatePath(`/deadlines/${newDeadline.id}`);
    revalidatePath('/dashboard');
    revalidatePath('/admin');

    return { success: true, message: 'Thêm deadline thành công!' };
  } catch (err: any) {
    return { error: 'Đã xảy ra lỗi khi lưu deadline: ' + err.message };
  }
}

export async function deleteDeadlineAction(deadlineId: string) {
  const session = await auth();
  const role = session?.user?.role;

  if (!can(role, 'deadline:delete')) {
    throw new Error('Từ chối truy cập: Chỉ admin (Lớp trưởng) mới có quyền xoá deadline.');
  }

  const success = await deleteDeadline(deadlineId);
  if (!success) {
    throw new Error('Không tìm thấy deadline cần xoá.');
  }

  revalidatePath('/deadlines');
  revalidatePath(`/deadlines/${deadlineId}`);
  revalidatePath('/dashboard');
  revalidatePath('/admin');

  return { success: true };
}

