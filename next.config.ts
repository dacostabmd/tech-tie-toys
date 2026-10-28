import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Tree-shake icon and component barrels.
    optimizePackageImports: ["@mantine/core", "@mantine/hooks", "lucide-react"],
  },
};

export default nextConfig;
