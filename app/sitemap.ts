import type { MetadataRoute } from 'next';
import { getDeadlines, getSubjects } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [deadlines, subjects] = await Promise.all([
    getDeadlines(),
    getSubjects(),
  ]);

  const baseUrl = 'http://localhost:3000';

  const deadlineEntries: MetadataRoute.Sitemap = deadlines.map((d) => ({
    url: `${baseUrl}/deadlines/${d.id}`,
    lastModified: new Date(d.createdAt),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const subjectEntries: MetadataRoute.Sitemap = subjects.map((s) => ({
    url: `${baseUrl}/subjects/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/deadlines`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...deadlineEntries,
    ...subjectEntries,
  ];
}

