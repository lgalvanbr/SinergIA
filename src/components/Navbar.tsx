"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { easeApple } from "@/lib/motion";
import { UnitSignature } from "./UnitSignature";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Proyectos", href: "/proyectos" },
  { label: "Quiénes somos", href: "/quienes-somos" },
  { label: "Laboratorio", href: "/laboratorio" },
  { label: "Investigación", href: "/investigacion" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Sections tagged data-nav-theme="dark" (the landing page's cinematic
  // chapters) swap the navbar to a light-on-dark treatment while they fill
  // the viewport. On pages without such sections this simply never fires.
  useEffect(() => {
    const darkSections = Array.from(document.querySelectorAll('[data-nav-theme="dark"]'));

    const checkDark = () => {
      const anyDarkNearTop = darkSections.some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= 80 && rect.bottom >= 80;
      });
      setOnDark(anyDarkNearTop);
    };

    checkDark();
    if (darkSections.length === 0) return;

    const observer = new IntersectionObserver(checkDark, {
      threshold: [0, 0.1, 0.5, 1],
      rootMargin: "-80px 0px -80px 0px",
    });
    darkSections.forEach((el) => observer.observe(el));
    window.addEventListener("scroll", checkDark, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", checkDark);
    };
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        onDark
          ? "bg-black/30 backdrop-blur-xl border-b border-white/10"
          : scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-black/5"
          : "bg-white/0 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className={`rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            onDark ? "focus-visible:ring-white focus-visible:ring-offset-black" : "focus-visible:ring-black"
          }`}
        >
          <UnitSignature dark={onDark} compact />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-[13px] font-medium rounded-full transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
                  onDark ? "focus-visible:ring-white" : "focus-visible:ring-black"
                } ${
                  onDark
                    ? isActive
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                    : isActive
                    ? "text-black"
                    : "text-foreground-secondary hover:text-black"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-bg"
                    className={`absolute inset-0 rounded-full -z-10 ${
                      onDark ? "bg-white/15" : "bg-black/[0.05]"
                    }`}
                    transition={{ type: "spring", stiffness: 500, damping: 34 }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#contacto"
            className={`hidden sm:inline-flex items-center justify-center min-h-[36px] px-4 rounded-full text-[13px] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              onDark
                ? "bg-white text-black hover:bg-white/90 focus-visible:ring-white focus-visible:ring-offset-black"
                : "bg-black text-white hover:bg-black/85 focus-visible:ring-black focus-visible:ring-offset-white"
            }`}
          >
            Contáctanos
          </Link>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`lg:hidden p-2 rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 ${
              onDark
                ? "text-white hover:bg-white/10 focus-visible:ring-white"
                : "text-black hover:bg-black/5 focus-visible:ring-black"
            }`}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: easeApple }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-black/5 overflow-hidden"
          >
            <div className="px-5 sm:px-8 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-3 rounded-xl text-[15px] font-medium transition-colors min-h-[44px] flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black ${
                    pathname === item.href ? "bg-black/[0.05] text-black" : "text-black hover:bg-black/[0.04]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/#contacto"
                onClick={() => setMobileOpen(false)}
                className="mt-2 text-center py-3 bg-black text-white font-medium rounded-xl text-[15px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                Contáctanos
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
