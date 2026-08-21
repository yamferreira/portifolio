import { ArrowLeft, ArrowUpRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArchitectureDiagram from "@/components/case-study/ArchitectureDiagram";
import CaseSection from "@/components/case-study/CaseSection";
import CodeBlock from "@/components/case-study/CodeBlock";
import DemoPlayer, {
  type ResolvedDemo,
} from "@/components/case-study/DemoPlayer";
import Footer from "@/components/Footer";
import GithubMark from "@/components/icons/GithubMark";
import Reveal from "@/components/Reveal";
import { caseStudies, getCaseStudy } from "@/data/case-studies";
import { site } from "@/data/site";
import { publicFileExists } from "@/lib/public-assets";

/** Todas as rotas são conhecidas no build: nada é gerado sob demanda. */
export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/projetos/[slug]">,
) {
  const { slug } = await props.params;
  const study = getCaseStudy(slug);

  if (!study) return {};

  const title = `${study.title} · ${site.name}`;
  return {
    title,
    description: study.problem,
    openGraph: {
      type: "article",
      locale: "pt_BR",
      url: `${site.url}/projetos/${study.slug}`,
      title,
      description: study.problem,
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description: study.problem,
    },
  };
}

export default async function CaseStudyPage(
  props: PageProps<"/projetos/[slug]">,
) {
  const { slug } = await props.params;
  const study = getCaseStudy(slug);

  if (!study) notFound();

  // A existência dos arquivos é resolvida aqui, no servidor: o player é
  // um componente de cliente e não enxerga o sistema de arquivos.
  const demos: ResolvedDemo[] = await Promise.all(
    study.demos.map(async (demo) => {
      if (demo.kind === "link") {
        // Sem o thumbnail o card ainda funciona: cai no rótulo textual.
        const hasPoster =
          demo.poster !== undefined && (await publicFileExists(demo.poster));
        return { ...demo, poster: hasPoster ? demo.poster : undefined };
      }
      return { ...demo, available: await publicFileExists(demo.src) };
    }),
  );

  return (
    <>
      <article className="mx-auto w-full max-w-4xl px-6 pb-16 pt-28 sm:px-8 md:pt-36">
        {/* ── 01 · Header ─────────────────────────────────────── */}
        <header className="pb-20 md:pb-28">
          <Reveal>
            <Link
              href="/#projetos"
              className="group inline-flex items-center gap-2 text-sm text-dim transition-colors duration-200 hover:text-fg"
            >
              <ArrowLeft
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              Projetos
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="type-title mt-8 font-display text-fg">
              {study.title}
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            {/* Stack em texto corrido: são fatos sobre o projeto, não
                selos a serem colecionados. */}
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-dim">
              {study.stack.join(" · ")}
            </p>
          </Reveal>

          {(study.repo || study.apiDocs) && (
            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap gap-3">
                {study.repo && (
                  <a
                    href={study.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-fg transition-colors duration-200 hover:border-white/20 hover:bg-white/5"
                  >
                    <GithubMark className="size-4" />
                    Ver repositório
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5 text-dim transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                )}
                {study.apiDocs && (
                  <a
                    href={study.apiDocs}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-fg transition-colors duration-200 hover:border-white/20 hover:bg-white/5"
                  >
                    <BookOpen aria-hidden="true" className="size-4" />
                    Ver documentação da API
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5 text-dim transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                )}
              </div>
            </Reveal>
          )}
        </header>

        {/* ── 02 · O problema ─────────────────────────────────── */}
        <CaseSection index="01" title="O problema">
          <Reveal>
            <p className="type-lead max-w-2xl text-muted">{study.problem}</p>
          </Reveal>
        </CaseSection>

        {/* ── 03 · Arquitetura ────────────────────────────────── */}
        {study.architecture && (
          <CaseSection index="02" title="Arquitetura">
            <Reveal>
              <ArchitectureDiagram architecture={study.architecture} />
            </Reveal>
          </CaseSection>
        )}

        {/* ── 04 · Demonstração ───────────────────────────────── */}
        {demos.length > 0 && (
          <CaseSection index="03" title="Demonstração">
            <Reveal>
              <DemoPlayer demos={demos} />
            </Reveal>
          </CaseSection>
        )}

        {/* ── 05 · Decisões técnicas ──────────────────────────── */}
        {study.decisions.length > 0 && (
          <CaseSection index="04" title="Decisões técnicas">
            <ol className="flex flex-col gap-12">
              {study.decisions.map((decision, i) => (
                <Reveal key={decision.decision} delay={i * 0.05}>
                  <li>
                    <h3 className="max-w-2xl text-[17px] font-medium leading-snug text-fg">
                      {decision.decision}
                    </h3>
                    <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
                      {decision.why}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </CaseSection>
        )}

        {/* ── 06 · Código ─────────────────────────────────────── */}
        <CaseSection index="05" title="No código">
          <Reveal>
            <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-muted">
              {study.snippet.description}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <CodeBlock snippet={study.snippet} />
          </Reveal>
        </CaseSection>

        <Reveal>
          <div className="border-t border-line py-20">
            <Link
              href="/#projetos"
              className="group inline-flex items-center gap-2 text-[15px] text-muted transition-colors duration-200 hover:text-fg"
            >
              <ArrowLeft
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              Voltar para os projetos
            </Link>
          </div>
        </Reveal>
      </article>

      <Footer narrow />
    </>
  );
}
