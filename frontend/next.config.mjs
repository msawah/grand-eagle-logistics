/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  },
  images: {
    domains: ['localhost', 'grand-eagle-logistics.onrender.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'grand-eagle-logistics.onrender.com',
      },
      {
        protocol: 'https',
        hostname: '*.onrender.com',
      },
    ],
  },
  // Optimize for production
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
