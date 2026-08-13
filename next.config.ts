import withSerwistInit from '@serwist/next';
import type {NextConfig} from 'next';

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV !== 'production',
});

const nextConfig: NextConfig = {
  turbopack: {},
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: process.env.SUPABASE_IMAGE_HOSTNAME ?
        [
          {
            protocol: 'https',
            hostname: process.env.SUPABASE_IMAGE_HOSTNAME,
            pathname: '/storage/v1/object/public/**',
          },
        ] :
        [],
  },
};

export default withSerwist(nextConfig);