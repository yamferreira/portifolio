import { projects } from "@/data/projects";
import { site } from "@/data/site";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";
import Section from "./Section";

export default function ProjectsGrid() {
  return (
    <Section id="projetos" index="03" title="Projetos">
      <div className="grid gap-6 sm:grid-cols-2 md:gap-8 xl:grid-cols-3">
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
          className="group mt-16 inline-flex items-center gap-1.5 text-[15px] text-muted transition-colors duration-200 hover:text-fg"
        >
          Ver todos no GitHub
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            ›
          </span>
        </a>
      </Reveal>
    </Section>
  );
}
