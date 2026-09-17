import Link from "next/link";
import { UnitSignature } from "@/components/UnitSignature";

const subNav = [
  { label: "Inicio", href: "/infraestructura-visible" },
  { label: "Visualiza", href: "/infraestructura-visible/visualiza" },
  { label: "Explora", href: "/infraestructura-visible/explora" },
  { label: "Especiales", href: "/infraestructura-visible/especiales" },
  { label: "Biblioteca", href: "/infraestructura-visible/biblioteca" },
  { label: "Noticias", href: "/infraestructura-visible/noticias" },
];

export default function InfraestructuraVisibleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="border-b border-border-soft bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 pt-24 pb-4 flex flex-wrap items-center justify-between gap-4">
          <Link href="/infraestructura-visible" className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black">
            <UnitSignature unitName="Infraestructura Visible" unitSubtitle="Laboratorio SinergIA · Ingeniería Civil y Ambiental" />
          </Link>
          <nav className="flex flex-wrap gap-x-5 gap-y-1">
            {subNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[13px] font-medium text-foreground-secondary hover:text-black transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
