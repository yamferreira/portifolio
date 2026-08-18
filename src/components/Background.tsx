/**
 * Camada de fundo fixa: gradient mesh animado + grade técnica + grão.
 * Tudo CSS puro (sem canvas, sem RAF) para não competir com o scroll.
 */
export default function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg"
    >
      {/* Manchas de cor em deriva lenta */}
      <div
        className="blob blob-a left-[-10%] top-[-15%] h-[55vmax] w-[55vmax] opacity-25"
        style={{
          background:
            "radial-gradient(circle at center, var(--color-accent) 0%, transparent 65%)",
        }}
      />
      <div
        className="blob blob-b right-[-15%] top-[25%] h-[50vmax] w-[50vmax] opacity-[0.14]"
        style={{
          background:
            "radial-gradient(circle at center, #3d6bff 0%, transparent 65%)",
        }}
      />
      <div
        className="blob blob-c bottom-[-20%] left-[20%] h-[45vmax] w-[45vmax] opacity-[0.12]"
        style={{
          background:
            "radial-gradient(circle at center, var(--color-accent) 0%, transparent 70%)",
        }}
      />

      {/* Grade fina — dá o ar "técnico" sem chamar atenção */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-fg) 1px, transparent 1px), linear-gradient(90deg, var(--color-fg) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Vinheta: escurece as bordas e joga o foco pro centro */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, transparent 20%, var(--color-bg) 92%)",
        }}
      />

      {/* Grão */}
      <div className="grain absolute inset-0 opacity-[0.16] mix-blend-overlay" />
    </div>
  );
}
