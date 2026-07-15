/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: 'output: export' removed — static export breaks API routes.
  // For Capacitor APK: run `next build` without export, then use capacitor-community/http or a live server.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
