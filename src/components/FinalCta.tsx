"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Mail } from "lucide-react";

import { easeApple } from "@/lib/motion";

export function FinalCta() {
  return (
    <section id="contacto" className="relative py-24 sm:py-32 px-5 sm:px-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: easeApple }}
        className="max-w-4xl mx-auto text-center space-y-7"
      >
        <h2 className="text-3xl sm:text-5xl font-semibold text-black tracking-tight text-balance">
          Construyamos juntos el futuro de nuestras ciudades
        </h2>
        <p className="text-base sm:text-lg text-foreground-secondary max-w-xl mx-auto">
          Si eres investigador, estudiante o representas una entidad interesada en colaborar con
          SinergIA, escríbenos.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href="mailto:sinergia@uniandes.edu.co"
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-7 rounded-full bg-black text-white font-medium text-[15px] hover:bg-black/88 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <Mail className="w-4 h-4" />
            sinergia@uniandes.edu.co
          </a>
          <Link
            href="/quienes-somos"
            className="text-[15px] font-medium text-black underline decoration-yellow decoration-4 underline-offset-4 hover:decoration-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black rounded"
          >
            Conócenos
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
