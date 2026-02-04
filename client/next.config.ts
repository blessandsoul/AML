import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: '..',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'vis.iaai.com',
      },
    ],
  },
};

export default nextConfig;
