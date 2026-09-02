import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * ✅ Enable React Strict Mode
   * Why:
   * - Helps catch bugs early (double rendering in dev)
   * - Standard in production-grade apps
   */
  reactStrictMode: true,

  /**
   * ✅ Enable SWC minification
   * Why:
   * - Faster builds vs Terser
   * - Default in modern Next.js, but explicitly keeping it is good clarity
   */
  swcMinify: true,

  /**
   * ✅ Image Optimization config
   * Why:
   * - Required when using external image URLs (CDN, APIs)
   * - Prevents runtime errors
   */
  images: {
    domains: ["jsonplaceholder.typicode.com"],
  },

  /**
   * ✅ Experimental features (use carefully)
   * Why:
   * - SDE2s test new features but don’t blindly rely on them
   */
  experimental: {
    serverActions: true, // Useful for form handling without APIs
  },

  /**
   * ✅ Logging (useful in debugging SSR/ISR issues)
   */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  /**
   * ✅ Headers (Security + SEO)
   * Why:
   * - Important for production apps
   * - Prevent XSS, clickjacking, etc.
   */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  /**
   * ✅ Redirects
   * Why:
   * - SEO handling
   * - URL restructuring without breaking links
   */
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  /**
   * ✅ Rewrites (proxy APIs / hide backend URLs)
   * Why:
   * - Avoid exposing backend directly
   * - Useful in microservices architecture
   */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://jsonplaceholder.typicode.com/:path*",
      },
    ];
  },

  /**
   * ✅ Output config
   * Why:
   * - "standalone" → best for Docker deployments
   */
  output: "standalone",

  /**
   * ✅ Compiler options
   * Why:
   * - Remove console logs in production (clean + secure)
   */
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;