import type { MetadataRoute } from 'next';
import { courseList } from './data/courses';

const BASE = 'https://efforteducation.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPaths = ['', '/about', '/courses', '/young-scholar', '/contact', '/privacy', '/terms'];
  const coursePaths = courseList.map((c) => `/courses/${c.slug}`);

  return [...staticPaths, ...coursePaths].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : path.startsWith('/courses/') ? 0.7 : 0.8,
  }));
}
