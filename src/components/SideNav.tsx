"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navItems, site } from "@/data/site";

/**
 * Navegação fixa com indicador de seção ativa.
 * Desktop: trilho vertical à esquerda. Mobile: pílula fixa no rodapé.
 *
 * Fora da home — em /projetos/[slug], por exemplo — as âncoras de seção
 * não apontam para nada, então só ficam o monograma (que volta para a
 * home) e os links sociais. A navegação da página é do próprio conteúdo.
 */
export default function SideNav() {
  const [active, setActive] = useState<string>(navItems[0].id);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const isHome = pathname === "/";

  // O monograma recua ao sair do topo: some um pouco e encolhe, para
  // deixar de disputar atenção com o conteúdo. Como é derivado do
  // scroll, acompanha o dedo/roda 1:1 — nada de animação disparada.
  const { scrollY } = useScroll();
  const monogramOpacity = useTransform(scrollY, [0, 180], [1, 0.4]);
  const monogramScale = useTransform(scrollY, [0, 180], [1, 0.85]);

  useEffect(() => {
    if (!isHome) return;

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
    // Voltar de um case study para a home remonta as seções: o observer
    // precisa ser refeito, senão o indicador fica congelado.
  }, [isHome]);

  return (
    <>
      {/* Monograma */}
      <motion.a
        href="/#home"
        style={
          reduceMotion
            ? undefined
            : {
                opacity: monogramOpacity,
                scale: monogramScale,
                transformOrigin: "left top",
              }
        }
        className="fixed left-5 top-5 z-50 text-sm font-semibold tracking-[0.12em] text-fg md:left-8 md:top-8"
      >
        YF.
      </motion.a>

      {/* Trilho lateral — desktop */}
      {isHome && (
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
                        ? "w-9 bg-fg"
                        : "w-4 bg-dim group-hover:w-7 group-hover:bg-muted"
                    }`}
                  />
                  <span
                    className={`type-label transition-colors duration-300 ${
                      isActive ? "text-fg" : "text-dim group-hover:text-muted"
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
      )}

      {/* Redes sociais fixas — desktop */}
      <div className="fixed bottom-8 left-8 z-40 hidden flex-col items-start gap-3 lg:flex">
        <span className="h-12 w-px bg-line" />
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer"
          className="type-label text-dim transition-colors duration-200 hover:text-fg"
        >
          GitHub
        </a>
        <a
          href={site.linkedin}
          target="_blank"
          rel="noreferrer"
          className="type-label text-dim transition-colors duration-200 hover:text-fg"
        >
          LinkedIn
        </a>
      </div>

      {/* Pílula de navegação — mobile */}
      {isHome && (
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
                  className={`type-label block whitespace-nowrap rounded-full px-3 py-1.5 transition-colors duration-200 ${
                    isActive
                      ? "bg-white/10 text-fg"
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
      )}
    </>
  );
}
