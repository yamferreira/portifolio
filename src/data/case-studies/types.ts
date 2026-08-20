/**
 * Tipos do case study — a página longa de um projeto (/projetos/[slug]).
 *
 * Um case study por arquivo em `src/data/case-studies/`, registrado no
 * `index.ts` da pasta. Projeto sem arquivo simplesmente não ganha página:
 * o card cai de volta no link do repositório.
 */

/** Um vídeo curto hospedado aqui mesmo, em /public. */
export type DemoVideo = {
  kind: "video";
  /** Rótulo da aba, ex: "POST /api/product". */
  label: string;
  /** Caminho em /public, ex: "/projects/slug/post-product.mp4". */
  src: string;
  /** Frame estático exibido antes do vídeo carregar. Opcional. */
  poster?: string;
  /** Uma linha explicando o que a gravação mostra. */
  caption?: string;
};

/**
 * Um vídeo que vive fora do site — tipicamente uma demonstração longa
 * demais para hospedar aqui. Vira um card com thumbnail clicável, em vez
 * de um iframe: nenhum embed de terceiro combina com esta página, e um
 * player de 15 minutos não é o que alguém quer no meio de um case study.
 */
export type DemoLink = {
  kind: "link";
  label: string;
  /** URL do vídeo/post original. Abre em aba nova. */
  href: string;
  /** Onde o vídeo está, exibido no card. Ex: "LinkedIn". */
  source: string;
  /** Duração legível, ex: "15 min". Opcional. */
  duration?: string;
  /** Thumbnail em /public. Sem ela o card cai num placeholder tipográfico. */
  poster?: string;
  caption?: string;
};

/**
 * Uma captura de tela. Para projeto que tem interface, um print vale
 * mais que um vídeo de Postman: mostra o produto, carrega instantâneo e
 * é muito mais fácil de manter atualizado do que uma gravação.
 */
export type DemoImage = {
  kind: "image";
  /** Rótulo da aba, ex: "Agendar sem login". */
  label: string;
  /** Caminho em /public, ex: "/projects/slug/home.png". */
  src: string;
  /**
   * Proporção da captura. `phone` limita a largura e centraliza — um
   * print de celular esticado na coluna inteira fica absurdo.
   * Padrão: `desktop`.
   */
  frame?: "desktop" | "phone";
  caption?: string;
};

export type Demo = DemoVideo | DemoLink | DemoImage;

/** Uma escolha de arquitetura e o motivo dela. */
export type Decision = {
  decision: string;
  why: string;
};

/** O trecho de código que carrega a parte interessante do projeto. */
export type Snippet = {
  /** Identificador de linguagem do Shiki: "java", "ts", "tsx", "sql"... */
  language: string;
  /** Caminho do arquivo no repositório de origem, exibido como rótulo. */
  file: string;
  /** O que esse trecho faz — uma ou duas frases, acima do bloco. */
  description: string;
  code: string;
};

export type Architecture = {
  /** SVG/PNG exportado do Excalidraw, em /public/projects/[slug]/. */
  src: string;
  /** Legenda curta com o fluxo, ex: "Request → SNS → Lambda → S3". */
  caption: string;
  /**
   * Diagrama com traço escuro sobre fundo claro/transparente — o padrão
   * do Excalidraw. A página é preta, então ele é invertido no CSS.
   * Marque `false` se o SVG já foi exportado com traço claro.
   */
  invert?: boolean;
};

export type CaseStudy = {
  /** Precisa bater com o `slug` do projeto em `src/data/projects.ts`. */
  slug: string;
  title: string;
  /** Texto simples, sem badges coloridos. */
  stack: string[];
  /** A dor que o projeto resolve, em 1–2 frases e sem jargão. */
  problem: string;
  repo: string | null;
  /** Swagger/OpenAPI publicado, se existir. */
  apiDocs?: string | null;
  architecture: Architecture | null;
  demos: Demo[];
  decisions: Decision[];
  snippet: Snippet;
};
