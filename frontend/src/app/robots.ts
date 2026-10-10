import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep private app areas out of search results.
      disallow: ['/dashboard', '/quiz', '/login', '/register', '/api'],
    },
    sitemap: 'https://efforteducation.in/sitemap.xml',
    host: 'https://efforteducation.in',
  };
}
