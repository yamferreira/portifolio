import type { ReactNode } from "react";
import Reveal from "./Reveal";

type SectionProps = {
  id: string;
  /** Numeral exibido antes do título, ex: "02". */
  index: string;
  title: string;
  children: ReactNode;
  className?: string;
};

/** Casca padrão das seções: âncora, largura máxima e cabeçalho numerado. */
export default function Section({
  id,
  index,
  title,
  children,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:px-8 md:py-32 lg:pl-40 lg:pr-10 ${className}`}
    >
      <Reveal>
        <div className="mb-12 flex items-center gap-4 md:mb-16">
          <span className="font-mono text-xs text-accent">{index}</span>
          <h2 className="font-display text-2xl font-medium tracking-tight text-fg sm:text-3xl">
            {title}
          </h2>
          <span className="h-px flex-1 bg-line" />
        </div>
      </Reveal>
      {children}
    </section>
  );
}
