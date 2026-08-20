import { createHighlighter, type Highlighter } from "shiki";

/**
 * Tema monocromático para os blocos de código.
 *
 * O resto do site não tem cor de destaque, e um bloco de código com
 * roxo, verde e laranja seria o único ponto colorido da página inteira.
 * Aqui a hierarquia vem de brilho: palavra-chave clara, texto comum em
 * cinza médio, literal um degrau abaixo, comentário apagado e em itálico.
 */
const monoTheme = {
  name: "yf-mono",
  type: "dark" as const,
  colors: {
    "editor.background": "#0a0a0a",
    "editor.foreground": "#c9c9ce",
  },
  // O Shiki lê `settings` quando ela existe — `tokenColors` é ignorado.
  settings: [
    { settings: { foreground: "#c9c9ce", background: "#0a0a0a" } },
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#5f5f66", fontStyle: "italic" },
    },
    {
      scope: [
        "keyword",
        "keyword.control",
        "storage",
        "storage.type",
        "storage.modifier",
        "variable.language",
        "constant.language",
        "support.type",
        "entity.name.type",
      ],
      settings: { foreground: "#f5f5f7" },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call",
        "entity.name.tag",
      ],
      settings: { foreground: "#e4e4e9" },
    },
    {
      scope: ["string", "constant.numeric", "constant.character"],
      settings: { foreground: "#9a9aa0" },
    },
    {
      scope: ["punctuation", "meta.brace"],
      settings: { foreground: "#7a7a80" },
    },
    {
      scope: ["entity.name.type.annotation", "storage.type.annotation"],
      settings: { foreground: "#b9b9c0" },
    },
  ],
};

/** Linguagens usadas pelos snippets dos case studies. */
const langs = ["java", "ts", "tsx", "sql", "bash", "json"] as const;

let highlighterPromise: Promise<Highlighter> | null = null;

/**
 * Um highlighter para todo o build — criar um por página carregaria as
 * gramáticas de novo a cada rota gerada.
 */
function getHighlighter() {
  highlighterPromise ??= createHighlighter({
    themes: [monoTheme],
    langs: [...langs],
  });
  return highlighterPromise;
}

export async function highlight(code: string, lang: string) {
  const highlighter = await getHighlighter();
  const loaded = highlighter.getLoadedLanguages();
  return highlighter.codeToHtml(code, {
    lang: loaded.includes(lang) ? lang : "text",
    theme: monoTheme.name,
  });
}
