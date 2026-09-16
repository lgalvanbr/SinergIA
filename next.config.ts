import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Files under /public keep their literal filename (no content hash), so
  // Next doesn't cache them aggressively by default — a fresh visitor would
  // otherwise re-validate every background video on every page load. These
  // clips do get swapped by overwriting the same path (see project memory),
  // so this stays well short of `immutable`: a day of no-revalidation, then
  // serve-stale-while-refetching for up to a week.
  async headers() {
    return [
      {
        source: "/videos/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
