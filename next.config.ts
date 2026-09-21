import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output traces only the files each route actually needs into
  // .next/standalone (including a minimal server.js and the subset of
  // node_modules actually used) — lets the Docker image skip `npm install`
  // in production and stay small, instead of shipping the full node_modules.
  output: "standalone",

  // Hides the floating dev badge (the "N" that shows Compiling…) in local dev.
  devIndicators: false,

  // /videos and /projects filenames carry a content hash (name.<sha1-8>.ext),
  // so a changed clip always gets a new URL — safe to cache for a year.
  // /data and /documentos keep their plain names and get overwritten in
  // place, so they stay on a short cache with stale-while-revalidate.
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/projects/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/documentos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        source: "/data/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
