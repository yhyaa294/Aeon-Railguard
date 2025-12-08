import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',               // DISABLED for local dev (Enable for GitHub Pages)
  // basePath: '/Aeon-Railguard',    // DISABLED for local dev (Enable for GitHub Pages)
  images: {
    unoptimized: true, 
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
