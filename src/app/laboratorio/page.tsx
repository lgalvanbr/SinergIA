import type { Metadata } from "next";
import { Laboratorio } from "@/components/Laboratorio";

export const metadata: Metadata = {
  title: "Laboratorio",
  description:
    "Capacidades de cómputo, datos y modelado del Laboratorio SinergIA para investigación aplicada en ingeniería civil y ambiental.",
};

export default function LaboratorioPage() {
  return <Laboratorio />;
}
