import type { MetadataRoute } from "next";

const routes = ["", "/proyectos", "/quienes-somos", "/laboratorio", "/investigacion"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sinergia.uniandes.edu.co";
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
