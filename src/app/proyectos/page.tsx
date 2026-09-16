import type { Metadata } from "next";
import { Proyectos } from "@/components/Proyectos";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Portafolio de proyectos aplicados del Laboratorio SinergIA en ciudades sostenibles, modernización de infraestructura y movilidad urbana.",
};

export default function ProyectosPage() {
  return <Proyectos />;
}
