import type { Metadata } from "next";
import { Investigacion } from "@/components/Investigacion";

export const metadata: Metadata = {
  title: "Investigación",
  description:
    "Líneas de investigación del Laboratorio SinergIA: IA para ciudades sostenibles, modernización de infraestructura, movilidad y gestión ambiental.",
};

export default function InvestigacionPage() {
  return <Investigacion />;
}
