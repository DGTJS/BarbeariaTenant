import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "092abtnhnl.ufs.sh",
      },
    ],
  },
};

export default nextConfig;

// "092abtnhnl.ufs.sh"
