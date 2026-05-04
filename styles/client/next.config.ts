import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Lint is checked in its own CI step; don't let build failures block Playwright
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;