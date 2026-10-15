import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isGithubPages
    ? {
        output: "export",
        basePath: "/gigscope-ai",
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
