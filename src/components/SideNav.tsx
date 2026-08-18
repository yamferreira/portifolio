"use client";

import { useEffect, useState } from "react";
import { navItems, site } from "@/data/site";

/**
 * Navegação fixa com indicador de seção ativa.
 * Desktop: trilho vertical à esquerda. Mobile: pílula fixa no rodapé.
 */
export default function SideNav() {
  const [active, setActive] = useState<string>(navItems[0].id);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    // Guarda quanto de cada seção está visível e elege a de maior proporção.
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            ratios.set(entry.target.id, entry.intersectionRatio);
          } else {
            ratios.delete(entry.target.id);
          }
        }

        let best = "";
        let bestRatio = -1;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setActive(best);
      },
      {
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: "-15% 0px -15% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Monograma */}
      <a
        href="#home"
        className="fixed left-5 top-5 z-50 font-mono text-sm tracking-[0.3em] text-fg transition-colors hover:text-accent md:left-8 md:top-8"
      >
        YF<span className="text-accent">.</span>
      </a>

      {/* Trilho lateral — desktop */}
      <nav
        aria-label="Navegação principal"
        className="fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      >
        <ul className="flex flex-col gap-3">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex items-center gap-3"
                >
                  <span
                    className={`h-px transition-all duration-300 ${
                      isActive
                        ? "w-9 bg-accent"
                        : "w-4 bg-dim group-hover:w-7 group-hover:bg-muted"
                    }`}
                  />
                  <span
                    className={`font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                      isActive
                        ? "text-accent"
                        : "text-dim group-hover:text-muted"
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Redes sociais fixas — desktop */}
      <div className="fixed bottom-8 left-8 z-40 hidden flex-col items-start gap-3 lg:flex">
        <span className="h-12 w-px bg-line" />
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim transition-colors hover:text-accent"
        >
          GitHub
        </a>
        <a
          href={site.linkedin}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-dim transition-colors hover:text-accent"
        >
          LinkedIn
        </a>
      </div>

      {/* Pílula de navegação — mobile */}
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 lg:hidden"
      >
        <ul className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-line bg-surface/80 px-1.5 py-1.5 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`block whitespace-nowrap rounded-full px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wide transition-colors sm:px-3 sm:text-[11px] ${
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-dim hover:text-fg"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
