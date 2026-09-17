import type { Metadata } from "next";
import { Especiales } from "@/components/infraestructura-visible/Especiales";

export const metadata: Metadata = {
  title: "Especiales",
  description: "Análisis a profundidad que cruzan varios indicadores de infraestructura y desarrollo de Colombia.",
};

export default function EspecialesPage() {
  return <Especiales />;
}
