"use client";

import { motion, useReducedMotion } from "motion/react";
import { site } from "@/data/site";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  // Entrada escalonada: cada filho aparece um pouco depois do anterior.
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.09, delayChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      id="home"
      className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-28 sm:px-8 lg:pl-40 lg:pr-10"
    >
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.p
          variants={item}
          className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          {site.role}
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display font-medium leading-[0.92] tracking-[-0.03em] text-fg"
          style={{ fontSize: "clamp(2.75rem, 11vw, 8.5rem)" }}
        >
          Yam
          <br />
          Ferreira<span className="text-accent">.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-8 font-mono text-sm text-accent sm:text-base"
        >
          {site.stackLine}
        </motion.p>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          {site.tagline}
        </motion.p>

        <motion.div variants={item} className="mt-12 flex flex-wrap gap-3">
          <a
            href="#projetos"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Ver projetos
            <span className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </a>
          <a
            href="#contato"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm text-fg transition-colors hover:border-accent/60 hover:text-accent"
          >
            Entrar em contato
          </a>
        </motion.div>
      </motion.div>

      {/* Rodapé do hero: contexto curto + dica de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="absolute inset-x-6 bottom-24 flex items-end justify-between gap-6 sm:inset-x-8 lg:bottom-10 lg:left-40 lg:right-10"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
          Análise e Desenvolvimento de Sistemas · FMU — 2027
        </span>
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-dim sm:inline">
          Scroll ↓
        </span>
      </motion.div>
    </section>
  );
}
