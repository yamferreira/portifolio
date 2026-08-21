import { awsEventDrivenCatalog } from "./aws-event-driven-catalog";
import { barbershopAppointment } from "./barbershop-appointment";
import { cadastroUsuario } from "./cadastro-usuario";
import { productManager } from "./product-manager";
import { saas } from "./saas";
import type { CaseStudy } from "./types";

export type {
  CaseStudy,
  Architecture,
  Decision,
  Demo,
  DemoImage,
  DemoLink,
  DemoVideo,
  Snippet,
} from "./types";

/**
 * Registro dos case studies. Para adicionar um projeto: crie o arquivo
 * ao lado deste e inclua o objeto na lista abaixo: o `slug` precisa
 * bater com o do projeto em `src/data/projects.ts`.
 */
export const caseStudies: CaseStudy[] = [
  awsEventDrivenCatalog,
  barbershopAppointment,
  saas,
  productManager,
  cadastroUsuario,
];

const bySlug = new Map(caseStudies.map((study) => [study.slug, study]));

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return bySlug.get(slug);
}

/** Usado pelo card para decidir se mostra o ícone de case study. */
export function hasCaseStudy(slug: string): boolean {
  return bySlug.has(slug);
}
