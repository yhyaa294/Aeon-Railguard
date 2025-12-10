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
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
