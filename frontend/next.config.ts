import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Old auth + dashboard URLs (pre-LMS-v2) redirect to the new locations.
  // The actual real-time engine pages (`/quiz/[id]/lobby|play|results` and
  // `/quiz/admin/[id]/{questions,preview,live}`) stay where they are — the
  // dashboard quiz lists deep-link straight into them.
  async redirects() {
    return [
      { source: '/quiz/login', destination: '/login', permanent: true },
      { source: '/quiz/register', destination: '/register', permanent: true },
      { source: '/quiz/dashboard', destination: '/dashboard', permanent: true },
    ];
  },
};

export default nextConfig;
