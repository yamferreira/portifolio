import type { Project } from "@/data/projects";
import ProjectCover from "./ProjectCover";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const label = String(index + 1).padStart(2, "0");
  const href = project.demo ?? project.repo;

  const card = (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface/60 backdrop-blur-sm transition-colors duration-300 hover:border-white/20">
      {/* Capa */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
        <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.06]">
          <ProjectCover slug={project.slug} index={label} />
        </div>

        {/* Overlay de hover com o detalhe técnico */}
        <div className="absolute inset-0 flex flex-col justify-end bg-bg/90 p-5 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none">
          <p className="text-sm leading-relaxed text-fg">{project.highlight}</p>
          {href ? (
            <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-fg">
              {project.demo ? "Ver demo" : "Ver repositório"}
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                ↗
              </span>
            </span>
          ) : (
            <span className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-dim">
              Repositório em breve
            </span>
          )}
        </div>
      </div>

      {/* Corpo */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-medium leading-snug tracking-tight text-fg transition-colors group-hover:text-fg">
          {project.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {project.summary}
        </p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] tracking-wide text-dim"
            >
              {tech}
            </li>
          ))}
        </ul>
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
      className="block h-full rounded-xl"
    >
      {card}
    </a>
  );
}
