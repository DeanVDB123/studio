
import type {NextConfig} from 'next';

const memorialIdRegex = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}|[a-zA-Z0-9_-]{10}';

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
        source: '/qrcodes',
        destination: '/admin/qrcodes',
      },
      {
        source: '/payment/:plan/:memorialId',
        destination: '/payments',
      },
      {
        source: `/edit/:memorialId(${memorialIdRegex})`,
        destination: '/admin/edit/:memorialId',
      },
      {
        source: `/:memorialId(${memorialIdRegex})`,
        destination: '/memorial/:memorialId',
      },
    ];
  },
};

export default nextConfig;
