import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { noticias } from "@/components/infraestructura-visible/content/noticias";
import { NoticiaDetail } from "@/components/infraestructura-visible/NoticiaDetail";

export function generateStaticParams() {
  return noticias.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const noticia = noticias.find((n) => n.slug === slug);
  return noticia ? { title: noticia.title, description: noticia.summary } : {};
}

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const noticia = noticias.find((n) => n.slug === slug);
  if (!noticia) notFound();

  return <NoticiaDetail noticia={noticia} />;
}
