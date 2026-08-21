/**
 * Configuração central do portfólio.
 * Praticamente todo texto "pessoal" do site sai daqui: edite este
 * arquivo antes de mexer nos componentes.
 */

export const site = {
  name: "Yam Ferreira",
  role: "Back-End Developer",
  tagline:
    "Construo back-ends orientados a eventos: filas, mensageria e serviços que continuam de pé quando o volume cresce.",
  email: "yamferreira6@gmail.com",
  github: "https://github.com/yamferreira",
  // TODO: confirmar a URL real do perfil antes do deploy.
  linkedin: "https://www.linkedin.com/in/yamferreira",
  url: "https://yamferreira.dev",
} as const;

export const navItems = [
  { id: "home", label: "Home", index: "01" },
  { id: "sobre", label: "Sobre", index: "02" },
  { id: "projetos", label: "Projetos", index: "03" },
  { id: "stack", label: "Stack", index: "04" },
  { id: "contato", label: "Contato", index: "05" },
] as const;

export type NavItem = (typeof navItems)[number];
