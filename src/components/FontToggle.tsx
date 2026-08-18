"use client";

/**
 * Easter egg: troca a fonte de display do site inteiro entre a sans e a
 * JetBrains Mono. A escolha persiste no localStorage e é aplicada antes
 * da pintura pelo script inline no layout.
 *
 * O estado vive só no atributo `data-font` do <html> — o rótulo do botão
 * é resolvido por CSS. Sem useState/useEffect, não há render em cascata
 * nem divergência de hidratação.
 */
export default function FontToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.font === "mono" ? "sans" : "mono";
    root.dataset.font = next;
    try {
      localStorage.setItem("yf-font", next);
    } catch {
      // localStorage bloqueado (modo privado) — o toggle segue valendo na sessão.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Alternar entre fonte sans-serif e monospace"
      title="Trocar a fonte do site"
      className="type-label fixed right-5 top-5 z-50 rounded-full border border-line bg-surface/70 px-3.5 py-2 text-dim backdrop-blur-md transition-colors duration-200 hover:border-white/20 hover:text-fg md:right-8 md:top-8"
    >
      <span className="font-label-sans">Aa</span>
      <span className="font-label-mono">{"{ }"}</span>
    </button>
  );
}
