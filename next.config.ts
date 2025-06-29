
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/memorials',
        destination: '/admin',
      },
      {
        source: '/create',
        destination: '/admin/create',
      },
      {
        source: '/visits',
        destination: '/admin/scans',
      },
      {
        source: '/edit/:memorialId',
        destination: '/admin/edit/:memorialId',
      },
    ];
  },
};

export default nextConfig;
