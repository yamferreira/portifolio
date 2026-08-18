"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Atraso em segundos — use para escalonar itens de uma lista. */
  delay?: number;
  /** Deslocamento vertical inicial, em px. */
  y?: number;
  className?: string;
};

/**
 * Fade-in + slide-up quando o elemento entra na viewport.
 * Dispara uma única vez e respeita prefers-reduced-motion.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      // Mesma curva e duração do hero: a página inteira precisa parecer
      // ter um único temperamento. Ease-out puro, sem overshoot.
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
