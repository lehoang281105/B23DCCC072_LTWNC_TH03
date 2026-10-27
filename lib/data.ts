import fs from 'fs/promises';
import path from 'path';
import type { Subject, Deadline, Completion, User } from '@/types';

const dataDir = path.join(process.cwd(), 'data');

async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  try {
    const filePath = path.join(dataDir, filename);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return fallback;
  }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(dataDir, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getUsers(): Promise<User[]> {
  return readJsonFile<User[]>('users.json', []);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find((u) => u.id === id);
}

export async function getSubjects(): Promise<Subject[]> {
  return readJsonFile<Subject[]>('subjects.json', []);
}

export async function getSubjectBySlug(slug: string): Promise<Subject | undefined> {
  const subjects = await getSubjects();
  return subjects.find((s) => s.slug === slug);
}

export async function getDeadlines(): Promise<Deadline[]> {
  const deadlines = await readJsonFile<Deadline[]>('deadlines.json', []);
  return deadlines.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
}

export async function getDeadlineById(id: string): Promise<Deadline | undefined> {
  const deadlines = await getDeadlines();
  return deadlines.find((d) => d.id === id);
}

export async function getDeadlinesBySubject(subjectSlug: string): Promise<Deadline[]> {
  const deadlines = await getDeadlines();
  return deadlines.filter((d) => d.subjectSlug === subjectSlug);
}

export async function createDeadline(
  data: Omit<Deadline, 'id' | 'createdAt'>
): Promise<Deadline> {
  const deadlines = await readJsonFile<Deadline[]>('deadlines.json', []);
  const newId = String(Date.now());
  const newDeadline: Deadline = {
    ...data,
    id: newId,
    createdAt: new Date().toISOString(),
  };

  deadlines.push(newDeadline);
  await writeJsonFile('deadlines.json', deadlines);
  return newDeadline;
}

export async function deleteDeadline(id: string): Promise<boolean> {
  const deadlines = await readJsonFile<Deadline[]>('deadlines.json', []);
  const index = deadlines.findIndex((d) => d.id === id);
  if (index === -1) return false;

  deadlines.splice(index, 1);
  await writeJsonFile('deadlines.json', deadlines);

  const completions = await readJsonFile<Completion[]>('completions.json', []);
  const filteredCompletions = completions.filter((c) => c.deadlineId !== id);
  await writeJsonFile('completions.json', filteredCompletions);

  return true;
}

export async function getCompletionsByUser(userId: string): Promise<Completion[]> {
  const completions = await readJsonFile<Completion[]>('completions.json', []);
  return completions.filter((c) => c.userId === userId);
}

export async function toggleCompletion(
  userId: string,
  deadlineId: string
): Promise<{ completed: boolean }> {
  const completions = await readJsonFile<Completion[]>('completions.json', []);
  const existingIndex = completions.findIndex(
    (c) => c.userId === userId && c.deadlineId === deadlineId
  );

  if (existingIndex > -1) {
    completions.splice(existingIndex, 1);
    await writeJsonFile('completions.json', completions);
    return { completed: false };
  } else {
    completions.push({
      userId,
      deadlineId,
      completedAt: new Date().toISOString(),
    });
    await writeJsonFile('completions.json', completions);
    return { completed: true };
  }
}

