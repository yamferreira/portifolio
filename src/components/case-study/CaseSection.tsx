import type { ReactNode } from "react";
import Reveal from "../Reveal";

type CaseSectionProps = {
  /** Numeral exibido antes do título, ex: "02". */
  index: string;
  title: string;
  children: ReactNode;
};

/**
 * Casca de seção do case study. Mesma gramática da home — numeral,
 * título grande, muito ar embaixo —, mas sem o recuo do trilho lateral:
 * nesta página a navegação de seções não existe.
 */
export default function CaseSection({
  index,
  title,
  children,
}: CaseSectionProps) {
  return (
    <section className="border-t border-line py-20 md:py-28">
      <Reveal>
        <div className="mb-10 md:mb-14">
          <span className="type-label text-dim">{index}</span>
          <h2 className="type-heading mt-3 font-display text-fg">{title}</h2>
        </div>
      </Reveal>
      {children}
    </section>
  );
}
