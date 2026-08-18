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
      className={`mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-28 sm:px-8 md:py-40 lg:py-48 lg:pl-40 lg:pr-10 ${className}`}
    >
      <Reveal>
        {/* Sem régua nem divisória: o espaço abaixo já separa o cabeçalho
            do conteúdo, e um título por vez fica com a tela toda. */}
        <div className="mb-16 md:mb-24">
          <span className="type-label text-dim">{index}</span>
          <h2 className="type-title mt-4 font-display text-fg">{title}</h2>
        </div>
      </Reveal>
      {children}
    </section>
  );
}
