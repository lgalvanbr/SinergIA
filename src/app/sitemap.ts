import type { MetadataRoute } from "next";
import { especiales } from "@/components/infraestructura-visible/content/especiales";
import { noticias } from "@/components/infraestructura-visible/content/noticias";

const routes = [
  "",
  "/proyectos",
  "/quienes-somos",
  "/laboratorio",
  "/investigacion",
  "/infraestructura-visible",
  "/infraestructura-visible/visualiza",
  "/infraestructura-visible/explora",
  "/infraestructura-visible/especiales",
  "/infraestructura-visible/biblioteca",
  "/infraestructura-visible/noticias",
  ...especiales.map((e) => `/infraestructura-visible/especiales/${e.slug}`),
  ...noticias.map((n) => `/infraestructura-visible/noticias/${n.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sinergia.uniandes.edu.co";
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
