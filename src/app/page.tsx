import { Hero } from "@/components/Hero";
import { ScrollyShowcase } from "@/components/ScrollyShowcase";
import { SectionTeasers } from "@/components/SectionTeasers";
import { FinalCta } from "@/components/FinalCta";

export default function Home() {
  return (
    <>
      {/* 1. Nombre del laboratorio + video/canvas de fondo */}
      <Hero />

      {/* 2. Escenas de scroll cinematográfico */}
      <ScrollyShowcase />

      {/* 3. Accesos a cada sección (páginas independientes) */}
      <SectionTeasers />

      {/* 4. Llamado a la acción final / contacto */}
      <FinalCta />
    </>
  );
}
