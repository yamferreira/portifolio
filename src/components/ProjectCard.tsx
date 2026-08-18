import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const label = String(index + 1).padStart(2, "0");
  const href = project.demo ?? project.repo;

  const card = (
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
        {/* Antes isto vivia num overlay de hover — invisível no celular. */}
        <p className="mt-4 flex-1 text-sm leading-relaxed text-dim">
          {project.highlight}
        </p>

        <p className="mt-7 text-xs leading-relaxed text-dim">
          {project.stack.join(" · ")}
        </p>

        <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-fg">
          {href ? (
            <>
              {project.demo ? "Ver demo" : "Ver repositório"}
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                ›
              </span>
            </>
          ) : (
            <span className="text-dim">Repositório em breve</span>
          )}
        </span>
      </div>
    </article>
  );

  if (!href) {
    return card;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${project.title} — abrir em nova aba`}
      className="block h-full rounded-2xl"
    >
      {card}
    </a>
  );
}
