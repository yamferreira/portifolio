import { projects } from "@/data/projects";
import { site } from "@/data/site";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";
import Section from "./Section";

export default function ProjectsGrid() {
  return (
    <Section id="projetos" index="03" title="Projetos">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, i) => (
          // Escalona por coluna para a onda não vir toda de uma vez.
          <Reveal key={project.slug} delay={(i % 3) * 0.08} className="h-full">
            <ProjectCard project={project} index={i} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <a
          href={site.github}
          target="_blank"
          rel="noreferrer"
          className="group mt-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-dim transition-colors hover:text-accent"
        >
          Ver todos no GitHub
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </a>
      </Reveal>
    </Section>
  );
}
