import { ArrowUpRight, FileText } from "lucide-react";
import Link from "next/link";
import GithubMark from "@/components/icons/GithubMark";
import { hasCaseStudy } from "@/data/case-studies";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
};

/** Alvo de toque confortável para um ícone de 18px. */
const iconLink =
  "inline-flex size-9 items-center justify-center rounded-full text-dim transition-colors duration-200 hover:bg-white/5 hover:text-fg";

/**
 * O link esticado NÃO pode ser `relative`: o ::after se posiciona no
 * ancestral posicionado mais próximo, e esse precisa ser o <article>
 * inteiro. Os outros ícones ficam `relative z-10` para pintar por cima
 * dele e continuarem clicáveis.
 */
const stretched = "after:absolute after:inset-0 after:content-['']";
const raised = "relative z-10";

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const label = String(index + 1).padStart(2, "0");
  const caseHref = hasCaseStudy(project.slug)
    ? `/projetos/${project.slug}`
    : null;
  const externalHref = project.demo ?? project.repo;

  // O card inteiro é clicável por um link esticado sobre ele, um só,
  // porque dois esticados sobrepostos disputariam o mesmo clique. A
  // prioridade é a mesma do rótulo: case study, depois demo, depois
  // repositório.
  const primary = caseHref ?? externalHref;
  const linkClass = (href: string | null) =>
    `${iconLink} ${href && href === primary ? stretched : raised}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-white/15">
      {/* Capa: sem imagem real disponível, quem ocupa o espaço é o nome
          do projeto. A tipografia é o objeto de design, não um enfeite
          gerado por trás dele. */}
      <div className="flex aspect-[4/3] flex-col justify-between bg-surface-2 p-7">
        <span className="type-label text-dim">{label}</span>
        <h3 className="type-heading font-display text-fg">{project.title}</h3>
      </div>

      <div className="flex flex-1 flex-col p-7">
        <p className="text-[15px] leading-relaxed text-muted">
          {project.summary}
        </p>
        {/* Antes isto vivia num overlay de hover, invisível no celular. */}
        <p className="mt-4 flex-1 text-sm leading-relaxed text-dim">
          {project.highlight}
        </p>

        <p className="mt-7 text-xs leading-relaxed text-dim">
          {project.stack.join(" · ")}
        </p>

        <div className="mt-6 flex items-center justify-between gap-3">
          <span className="text-sm text-fg">
            {caseHref ? (
              <>
                Case study
                <span
                  aria-hidden="true"
                  className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  ›
                </span>
              </>
            ) : externalHref ? (
              <>
                {project.demo ? "Ver demo" : "Ver repositório"}
                <span
                  aria-hidden="true"
                  className="ml-1.5 inline-block transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  ›
                </span>
              </>
            ) : (
              <span className="text-dim">Repositório em breve</span>
            )}
          </span>

          {/* Ícones discretos, monocromáticos: repositório fora do site,
              case study dentro dele. */}
          <div className="-mr-2 flex items-center gap-0.5">
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title}, abrir repositório no GitHub`}
                className={linkClass(project.repo)}
              >
                <GithubMark className="size-[18px]" />
              </a>
            )}
            {caseHref ? (
              <Link
                href={caseHref}
                aria-label={`${project.title}, ler o case study`}
                className={linkClass(caseHref)}
              >
                <FileText aria-hidden="true" className="size-[18px]" />
              </Link>
            ) : (
              project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${project.title}, abrir demo`}
                  className={linkClass(project.demo ?? null)}
                >
                  <ArrowUpRight aria-hidden="true" className="size-[18px]" />
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
