export type Project = {
  /** Identificador estável do projeto — usado como key na listagem. */
  slug: string;
  title: string;
  /** Uma linha: o que o projeto é. */
  summary: string;
  /** Detalhe técnico, exibido abaixo do resumo no card. */
  highlight: string;
  stack: string[];
  repo: string | null;
  demo?: string | null;
  year?: string;
};

export const projects: Project[] = [
  {
    slug: "aws-event-driven-catalog",
    title: "AWS Event-Driven Catalog",
    summary:
      "Catálogo distribuído com publicação de eventos e processamento assíncrono na AWS.",
    highlight:
      "Publicação de eventos via SNS, consumo por SQS/Lambda, persistência NoSQL no MongoDB e arquivamento de JSON no S3.",
    stack: ["Java 17", "Spring Boot", "SNS", "SQS", "Lambda", "S3", "MongoDB", "Docker"],
    repo: "https://github.com/yamferreira/aws-event-driven-catalog",
  },
  {
    slug: "barbeariaa",
    title: "Sistema de Agendamento para Barbearia",
    summary:
      "Plataforma de booking com login social e checkout sem cadastro.",
    highlight:
      "CRUD completo, autenticação social via NextAuth, agendamento com guest checkout e arquitetura single-tenant.",
    stack: ["Next.js", "React", "Prisma", "PostgreSQL", "TailwindCSS", "NextAuth"],
    repo: "https://github.com/yamferreira/barbershop-appointment",
  },
  {
    slug: "ticket-marketplace",
    title: "Ticket Marketplace",
    summary:
      "API de marketplace de ingressos com controle de acesso por papéis.",
    highlight:
      "RBAC com papéis BUYER / ORGANIZER / ADMIN, autenticação stateless por JWT sobre Spring Security 6.",
    stack: ["Spring Boot 3", "Spring Security 6", "JWT", "PostgreSQL"],
    // TODO: adicionar o link do repositório.
    repo: null,
  },
  {
    slug: "saas",
    title: "Template SaaS",
    summary:
      "Boilerplate de SaaS com assinatura, autenticação e landing page prontas.",
    highlight:
      "Integração de pagamentos com Stripe, autenticação via Auth.js e cliente da Stripe resolvido de forma idempotente a partir do usuário no Firestore.",
    stack: ["Next.js", "Firebase", "Auth.js", "Stripe", "TailwindCSS"],
    repo: "https://github.com/yamferreira/saas",
  },
  {
    slug: "product-manager",
    title: "Product Manager",
    summary: "Aplicação full-stack de gerenciamento de produtos.",
    highlight:
      "Front-end em React consumindo uma API REST em Spring Boot com persistência em MySQL.",
    stack: ["React", "Spring Boot", "MySQL"],
    repo: "https://github.com/yamferreira/product-manager",
  },
  {
    slug: "cadastro-usuario",
    title: "Cadastro de Usuário",
    summary: "CRUD de usuários em Spring Boot, com foco em fundamentos de API.",
    highlight:
      "Camadas de controller, service e repository bem separadas — base limpa para evoluir em projetos maiores.",
    stack: ["Java", "Spring Boot"],
    repo: "https://github.com/yamferreira/cadastro-usuario",
  },
];
