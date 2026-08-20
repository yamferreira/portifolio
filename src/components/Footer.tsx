import { site } from "@/data/site";

type FooterProps = {
  /**
   * Case study não tem o trilho lateral, então o rodapé acompanha a
   * coluna estreita da página em vez de reservar espaço à esquerda.
   */
  narrow?: boolean;
};

export default function Footer({ narrow = false }: FooterProps) {
  const layout = narrow
    ? "max-w-4xl pb-16 pt-16"
    : "max-w-6xl pb-28 pt-16 lg:pb-16 lg:pl-40 lg:pr-10";

  return (
    <footer className={`mx-auto w-full px-6 sm:px-8 ${layout}`}>
      <div className="type-label flex flex-col gap-2 border-t border-line pt-8 text-dim sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>Next.js · TypeScript · Tailwind</span>
      </div>
    </footer>
  );
}
