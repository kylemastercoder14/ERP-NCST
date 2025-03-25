import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["erp-ncst.s3.us-east-1.amazonaws.com"],
  },
};

export default nextConfig;
