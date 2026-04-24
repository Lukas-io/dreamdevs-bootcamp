import type { NextConfig } from "next";

const imageGenUrl = process.env.IMAGE_GEN_URL || "http://localhost:3001";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/image-gen/:path*",
        destination: `${imageGenUrl}/:path*`,
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/:path*",
      },
    ];
  },
};

export default nextConfig;
