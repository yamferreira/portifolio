"use client";

import { motion, useReducedMotion } from "motion/react";
import { site } from "@/data/site";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  // Entrada escalonada: cada filho aparece um pouco depois do anterior.
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.08,
        delayChildren: 0.15,
      },
    },
  };

  // Fade + deslocamento curto, curva ease-out longa. Sem overshoot:
  // nada aqui foi arremessado pelo usuário, então não deve quicar.
  const item = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="home"
      className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-40 sm:px-8 lg:pl-40 lg:pr-10"
    >
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.p variants={item} className="type-label text-muted">
          {site.role}
        </motion.p>

        <motion.h1
          variants={item}
          className="type-display mt-8 font-display text-fg"
        >
          Yam
          <br />
          Ferreira.
        </motion.h1>

        <motion.p
          variants={item}
          className="type-lead mt-10 max-w-2xl text-muted"
        >
          {site.tagline}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          <a
            href="#projetos"
            className="rounded-full bg-fg px-7 py-3 text-[15px] font-medium text-bg transition-opacity duration-200 hover:opacity-85"
          >
            Ver projetos
          </a>
          <a
            href="#contato"
            className="group inline-flex items-center gap-1.5 text-[15px] text-fg transition-opacity duration-200 hover:opacity-70"
          >
            Entrar em contato
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              ›
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
