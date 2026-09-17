import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { especiales } from "@/components/infraestructura-visible/content/especiales";
import { EspecialDetail } from "@/components/infraestructura-visible/EspecialDetail";

export function generateStaticParams() {
  return especiales.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const especial = especiales.find((e) => e.slug === slug);
  return especial ? { title: especial.title, description: especial.summary } : {};
}

export default async function EspecialPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const especial = especiales.find((e) => e.slug === slug);
  if (!especial) notFound();

  return <EspecialDetail especial={especial} />;
}
