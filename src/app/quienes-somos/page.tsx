import type { Metadata } from "next";
import { QuienesSomos } from "@/components/QuienesSomos";

export const metadata: Metadata = {
  title: "Quiénes somos",
  description:
    "Misión, visión y comunidad del Laboratorio SinergIA, del Departamento de Ingeniería Civil y Ambiental de la Universidad de los Andes.",
};

export default function QuienesSomosPage() {
  return <QuienesSomos />;
}
