import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  // When deploying to GitHub Pages under a repo subpath, set basePath.
  // Example: https://nightfixed.github.io/atelier-private-chef
  basePath: isGitHubPages ? "/atelier-private-chef" : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
