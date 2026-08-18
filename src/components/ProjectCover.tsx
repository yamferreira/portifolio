/**
 * Capa gerada por código para cada projeto — evita depender de
 * screenshots. O desenho é um grafo de nós (uma alusão a serviços
 * conversando entre si) determinístico a partir do slug: o mesmo
 * projeto sempre produz a mesma capa, no servidor e no cliente.
 */

function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** PRNG determinístico (mulberry32). */
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WIDTH = 400;
const HEIGHT = 250;
const COLUMNS = 6;

type ProjectCoverProps = {
  slug: string;
  /** Numeral grande no canto, ex: "01". */
  index: string;
};

export default function ProjectCover({ slug, index }: ProjectCoverProps) {
  const random = createRandom(hashString(slug));
  const gradientId = `cover-grad-${slug}`;
  const glowId = `cover-glow-${slug}`;

  // Um nó por coluna, com y sorteado — garante distribuição sem sobreposição.
  const nodes = Array.from({ length: COLUMNS }, (_, i) => {
    const columnWidth = (WIDTH - 100) / (COLUMNS - 1);
    return {
      x: 50 + i * columnWidth,
      y: 45 + random() * (HEIGHT - 90),
      r: 2.5 + random() * 3.5,
    };
  });

  // Arestas em cadeia + dois atalhos de longo alcance.
  const edges: Array<[number, number]> = [];
  for (let i = 0; i < nodes.length - 1; i++) edges.push([i, i + 1]);
  edges.push([0, 2 + Math.floor(random() * 2)]);
  edges.push([Math.floor(random() * 2) + 1, nodes.length - 1]);

  const accentIndex = Math.floor(random() * nodes.length);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-full w-full"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-surface-2)" />
          <stop offset="100%" stopColor="var(--color-bg)" />
        </linearGradient>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="var(--color-fg)" stopOpacity={0.3} />
          <stop offset="60%" stopColor="var(--color-fg)" stopOpacity={0.09} />
          <stop offset="100%" stopColor="var(--color-fg)" stopOpacity={0} />
        </radialGradient>
      </defs>

      <rect width={WIDTH} height={HEIGHT} fill={`url(#${gradientId})`} />

      {/* Brilho do acento atrás do grafo */}
      <circle
        cx={nodes[accentIndex].x}
        cy={nodes[accentIndex].y}
        r={110}
        fill={`url(#${glowId})`}
      />

      {edges.map(([from, to], i) => (
        <line
          key={i}
          x1={nodes[from].x}
          y1={nodes[from].y}
          x2={nodes[to].x}
          y2={nodes[to].y}
          stroke="var(--color-fg)"
          strokeOpacity={0.22}
          strokeWidth={1}
        />
      ))}

      {nodes.map((node, i) => {
        const isAccent = i === accentIndex;
        return (
          <g key={i}>
            {isAccent && (
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r + 6}
                fill="none"
                stroke="var(--color-fg)"
                strokeOpacity={0.5}
                strokeWidth={1}
              />
            )}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill="var(--color-fg)"
              fillOpacity={isAccent ? 1 : 0.45}
            />
          </g>
        );
      })}

      <text
        x={24}
        y={HEIGHT - 22}
        fill="var(--color-fg)"
        fillOpacity={0.14}
        fontSize={56}
        fontFamily="var(--font-mono)"
        fontWeight={500}
      >
        {index}
      </text>
    </svg>
  );
}
