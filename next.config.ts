import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Worker loader configuration
    if (!isServer) {
      config.output = {
        ...config.output,
        globalObject: "self",
      };
    }

    return config;
  },
};

export default nextConfig;
