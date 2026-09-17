import type { Metadata } from "next";
import { InfraestructuraVisible } from "@/components/infraestructura-visible/InfraestructuraVisible";

export const metadata: Metadata = {
  title: "Infraestructura Visible",
  description:
    "Datos de infraestructura y desarrollo de Colombia, libres y centralizados. Un proyecto del profesor Mauricio Sánchez-Silva y el grupo GeoSI de Uniandes.",
};

export default function InfraestructuraVisiblePage() {
  return <InfraestructuraVisible />;
}
