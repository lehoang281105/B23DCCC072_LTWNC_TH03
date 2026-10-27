import type { UserRole, Action } from '@/types';

const permissions: Record<UserRole, Action[]> = {
  guest: ['deadline:view'],
  user: ['deadline:view', 'deadline:complete'],
  admin: ['deadline:view', 'deadline:complete', 'deadline:create', 'deadline:delete'],
};

export function can(role: UserRole | undefined | null, action: Action): boolean {
  const effectiveRole: UserRole = role || 'guest';
  return permissions[effectiveRole]?.includes(action) ?? false;
}

