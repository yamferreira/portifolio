/**
 * Renderiza a mesma cena que vira `.excalidraw` como um SVG pronto para
 * a página, para o diagrama não depender de um export manual.
 *
 * O traço sai do rough.js — a mesma biblioteca que o Excalidraw usa por
 * baixo —, então o desenho tem o mesmo aspecto de rabisco. O `seed` de
 * cada elemento é o mesmo gravado no `.excalidraw`, o que torna a saída
 * determinística: rodar de novo sem mudar a cena gera byte a byte o
 * mesmo arquivo, e o git não fica sujo à toa.
 *
 * O texto é desenhado como <text> numa sans do sistema. Um SVG carregado
 * por <img> não enxerga webfont nenhuma, e Excalifont não vem junto —
 * é exatamente o que o Excalidraw faz no modo de fonte "Normal".
 */
import rough from "roughjs";

const generator = rough.generator();

const FONT_STACK =
  'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/** Margem em volta do conteúdo, para o traço não encostar na borda. */
const PADDING = 24;

const escapeXml = (s) =>
  s.replace(/[&<>"']/g, (c) => `&${{ "&": "amp", "<": "lt", ">": "gt", '"': "quot", "'": "apos" }[c]};`);

const round = (n) => Math.round(n * 100) / 100;

/** Raio adaptativo do Excalidraw para `roundness: { type: 3 }`. */
function cornerRadius(width, height) {
  return Math.min(32, Math.min(Math.abs(width), Math.abs(height)) * 0.25);
}

function roundedRectPath(x, y, w, h, r) {
  return [
    `M${round(x + r)} ${round(y)}`,
    `H${round(x + w - r)}`,
    `A${round(r)} ${round(r)} 0 0 1 ${round(x + w)} ${round(y + r)}`,
    `V${round(y + h - r)}`,
    `A${round(r)} ${round(r)} 0 0 1 ${round(x + w - r)} ${round(y + h)}`,
    `H${round(x + r)}`,
    `A${round(r)} ${round(r)} 0 0 1 ${round(x)} ${round(y + h - r)}`,
    `V${round(y + r)}`,
    `A${round(r)} ${round(r)} 0 0 1 ${round(x + r)} ${round(y)}`,
    "Z",
  ].join(" ");
}

function roughOptions(element) {
  return {
    seed: element.seed,
    roughness: element.roughness,
    stroke: element.strokeColor,
    strokeWidth: element.strokeWidth,
    fill: undefined,
    // Traço tracejado das molduras. O rough não lê `strokeStyle`.
    ...(element.strokeStyle === "dashed" ? { strokeLineDash: [10, 8] } : {}),
  };
}

/** Converte o desenho do rough em elementos <path> do SVG. */
function drawableToPaths(drawable, element) {
  return drawable.sets
    .filter((set) => set.type === "path")
    .map((set) => {
      const d = generator.opsToPath(set);
      const dash =
        element.strokeStyle === "dashed"
          ? ' stroke-dasharray="10 8"'
          : "";
      return `<path d="${d}" fill="none" stroke="${element.strokeColor}" stroke-width="${element.strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${dash}/>`;
    })
    .join("");
}

function renderRectangle(element) {
  const { x, y, width, height } = element;
  const options = roughOptions(element);
  const drawable = element.roundness
    ? generator.path(
        roundedRectPath(x, y, width, height, cornerRadius(width, height)),
        options,
      )
    : generator.rectangle(x, y, width, height, options);
  return drawableToPaths(drawable, element);
}

function renderArrow(element) {
  const options = roughOptions(element);
  const points = element.points.map(([px, py]) => [element.x + px, element.y + py]);
  const parts = [drawableToPaths(generator.linearPath(points, options), element)];

  if (element.endArrowhead === "arrow") {
    const [ax, ay] = points[points.length - 2];
    const [bx, by] = points[points.length - 1];
    const angle = Math.atan2(by - ay, bx - ax);
    const length = Math.min(20, Math.hypot(bx - ax, by - ay) / 2);
    const spread = Math.PI / 7;
    for (const side of [-1, 1]) {
      const a = angle + Math.PI + side * spread;
      const barb = [
        [bx, by],
        [bx + Math.cos(a) * length, by + Math.sin(a) * length],
      ];
      // A ponta nunca é tracejada, mesmo numa linha que seja.
      parts.push(
        drawableToPaths(generator.linearPath(barb, { ...options, strokeLineDash: undefined }), {
          ...element,
          strokeStyle: "solid",
        }),
      );
    }
  }

  return parts.join("");
}

function renderText(element, byId) {
  const lines = element.text.split("\n");
  const lineHeight = element.fontSize * element.lineHeight;
  const container = element.containerId ? byId.get(element.containerId) : null;

  // Texto preso a uma caixa é centrado nela; texto solto ancora no
  // próprio canto superior esquerdo, como o Excalidraw guarda.
  const anchor = container ? "middle" : "start";
  const cx = container ? container.x + container.width / 2 : element.x;
  const top = container
    ? container.y + container.height / 2 - (lines.length * lineHeight) / 2
    : element.y;

  const tspans = lines
    .map((line, i) => {
      const y = top + lineHeight * i + lineHeight / 2;
      return `<tspan x="${round(cx)}" y="${round(y)}">${escapeXml(line)}</tspan>`;
    })
    .join("");

  return `<text font-family='${FONT_STACK}' font-size="${element.fontSize}" fill="${element.strokeColor}" text-anchor="${anchor}" dominant-baseline="central">${tspans}</text>`;
}

/** Caixa que o elemento ocupa, para o cálculo do viewBox. */
function bounds(element) {
  if (element.type === "arrow") {
    const xs = element.points.map(([px]) => element.x + px);
    const ys = element.points.map(([, py]) => element.y + py);
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  }
  return [
    element.x,
    element.y,
    element.x + element.width,
    element.y + element.height,
  ];
}

export function sceneToSvg(elements) {
  const byId = new Map(elements.map((el) => [el.id, el]));

  const boxes = elements.map(bounds);
  const minX = Math.min(...boxes.map((b) => b[0])) - PADDING;
  const minY = Math.min(...boxes.map((b) => b[1])) - PADDING;
  const maxX = Math.max(...boxes.map((b) => b[2])) + PADDING;
  const maxY = Math.max(...boxes.map((b) => b[3])) + PADDING;
  const width = Math.ceil(maxX - minX);
  const height = Math.ceil(maxY - minY);

  const body = elements
    .map((element) => {
      if (element.type === "rectangle") return renderRectangle(element);
      if (element.type === "arrow") return renderArrow(element);
      if (element.type === "text") return renderText(element, byId);
      return "";
    })
    .join("\n");

  // Sem <rect> de fundo: fundo transparente, como a página espera para
  // poder inverter o traço no tema escuro.
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${round(minX)} ${round(minY)} ${width} ${height}" role="img">
${body}
</svg>
`;
}
