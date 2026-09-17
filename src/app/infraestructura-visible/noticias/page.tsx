import type { Metadata } from "next";
import { Noticias } from "@/components/infraestructura-visible/Noticias";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Actualizaciones del proyecto Infraestructura Visible.",
};

export default function NoticiasPage() {
  return <Noticias />;
}
