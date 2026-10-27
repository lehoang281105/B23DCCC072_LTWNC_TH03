export type Role = 'admin' | 'user';

export type UserRole = Role | 'guest';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: Role;
}

export interface Subject {
  id: string;
  slug: string;
  code: string;
  name: string;
  credits: number;
  instructor: string;
  description: string;
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  subjectSlug: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Completion {
  deadlineId: string;
  userId: string;
  completedAt: string;
}

export type Action =
  | 'deadline:view'
  | 'deadline:complete'
  | 'deadline:create'
  | 'deadline:delete';

