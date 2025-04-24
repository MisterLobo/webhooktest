import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'github.com',
        protocol: 'https',
        pathname: '/*',
      }
    ],
  },
  experimental: {
    nextScriptWorkers: true,
  },
};

export default nextConfig;
