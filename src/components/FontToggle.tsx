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
      className="fixed right-5 top-5 z-50 rounded-full border border-line bg-surface/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-dim backdrop-blur transition-colors hover:border-accent/50 hover:text-accent md:right-8 md:top-8"
    >
      <span className="font-label-sans">Aa</span>
      <span className="font-label-mono">{"{ }"}</span>
    </button>
  );
}
