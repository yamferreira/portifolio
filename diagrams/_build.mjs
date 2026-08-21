/**
 * Gera os arquivos .excalidraw desta pasta.
 *
 *   node diagrams/_build.mjs
 *
 * Escrever cena do Excalidraw à mão é frágil: cada elemento tem uma
 * dúzia de campos obrigatórios e os arrows precisam de ponto E binding.
 * Este script cuida disso; os diagramas em si ficam em `_scenes.mjs`.
 *
 * Cada cena sai em dois formatos, da mesma fonte:
 *
 *   diagrams/[slug].excalidraw               para editar em excalidraw.com
 *   public/projects/[slug]/architecture.svg  o que a página exibe
 *
 * Ou seja, o site já mostra o diagrama sem passo manual. Se você preferir
 * ajustar à mão, abra o `.excalidraw`, edite e exporte o SVG por cima,
 * mas aí não rode este script de novo, ou ele sobrescreve o seu export.
 * Mudança para valer é melhor voltar para `_scenes.mjs`.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scenes } from "./_scenes.mjs";
import { sceneToSvg } from "./_svg.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

const STROKE = "#1e1e1e";
const FONT = 5; // Excalifont: o traço "à mão" padrão
const FONT_SIZE = 16;
const LINE_HEIGHT = 1.25;
const CHAR_W = 9.0; // Excalifont é irregular; sobra é melhor que texto vazando

const B62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * Índice fracionário do Excalidraw: precisa ser estritamente crescente
 * em ordem lexicográfica. Largura fixa em base62 garante isso.
 */
function fractionalIndex(i) {
  return (
    "a" +
    B62[Math.floor(i / 3844) % 62] +
    B62[Math.floor(i / 62) % 62] +
    B62[i % 62]
  );
}

let seedCounter = 1;
const nextSeed = () => (seedCounter = (seedCounter * 1103515245 + 12345) % 2147483647);

function base(type, props) {
  return {
    type,
    version: 1,
    versionNonce: nextSeed(),
    seed: nextSeed(),
    isDeleted: false,
    angle: 0,
    strokeColor: STROKE,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 1,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: null,
    boundElements: [],
    updated: 1,
    link: null,
    locked: false,
    ...props,
  };
}

/** Largura/altura aproximadas de um texto: o Excalidraw remede ao editar. */
function measure(text) {
  const lines = text.split("\n");
  const width = Math.max(...lines.map((l) => l.length)) * CHAR_W;
  const height = lines.length * FONT_SIZE * LINE_HEIGHT;
  return { width, height };
}

function textElement(id, text, props) {
  const { width, height } = measure(text);
  return base("text", {
    id,
    width,
    height,
    text,
    originalText: text,
    fontSize: FONT_SIZE,
    fontFamily: FONT,
    textAlign: "center",
    verticalAlign: "middle",
    lineHeight: LINE_HEIGHT,
    autoResize: true,
    containerId: null,
    ...props,
  });
}

/** Folga entre o texto e a borda da caixa. */
const PAD_X = 48;
const PAD_Y = 28;

/**
 * Uma caixa com rótulo centralizado dentro. A largura pedida é um
 * mínimo: se o texto não couber, a caixa cresce; texto vazando pela
 * borda é o defeito mais visível de um diagrama gerado.
 * `store: true` desenha canto reto (banco/arquivo); serviço fica arredondado.
 */
function box(node) {
  const { id, label, store = false, dashed = false } = node;
  const textId = `${id}-t`;
  const { width, height } = measure(label);

  // O nó é mutado no lugar para que as setas leiam as medidas finais.
  // Crescer só para a direita desalinharia uma coluna de caixas; o
  // centro é o que importa, então a folga é dividida nos dois lados.
  const grownW = Math.max(node.w, Math.ceil(width + PAD_X));
  const grownH = Math.max(node.h, Math.ceil(height + PAD_Y));
  node.x -= (grownW - node.w) / 2;
  node.y -= (grownH - node.h) / 2;
  node.w = grownW;
  node.h = grownH;
  const { x, y, w, h } = node;

  const rect = base("rectangle", {
    id,
    x,
    y,
    width: w,
    height: h,
    roundness: store ? null : { type: 3 },
    strokeStyle: dashed ? "dashed" : "solid",
    boundElements: [{ id: textId, type: "text" }],
  });

  const text = textElement(textId, label, {
    x: x + (w - width) / 2,
    y: y + (h - height) / 2,
    containerId: id,
  });

  return [rect, text];
}

/** Rótulo solto, usado no canto das molduras e ao lado das setas. */
function note(id, x, y, label, extra = {}) {
  return [textElement(id, label, { x, y, textAlign: "left", ...extra })];
}

const CENTER = (n) => ({ x: n.x + n.w / 2, y: n.y + n.h / 2 });

/**
 * Seta entre duas caixas. Calcula os pontos na borda de cada uma e
 * grava o binding, para que arrastar a caixa no editor leve a seta junto.
 */
function arrow(id, from, to, opts = {}) {
  const gap = 6;
  const a = CENTER(from);
  const b = CENTER(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;

  let start;
  let end;
  if (Math.abs(dy) >= Math.abs(dx)) {
    const down = dy > 0;
    start = { x: a.x, y: down ? from.y + from.h + gap : from.y - gap };
    end = { x: b.x, y: down ? to.y - gap : to.y + to.h + gap };
  } else {
    const right = dx > 0;
    start = { x: right ? from.x + from.w + gap : from.x - gap, y: a.y };
    end = { x: right ? to.x - gap : to.x + to.w + gap, y: b.y };
  }

  const el = base("arrow", {
    id,
    x: start.x,
    y: start.y,
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
    points: [
      [0, 0],
      [end.x - start.x, end.y - start.y],
    ],
    lastCommittedPoint: null,
    startBinding: { elementId: from.id, focus: 0, gap },
    endBinding: { elementId: to.id, focus: 0, gap },
    startArrowhead: null,
    endArrowhead: "arrow",
    roundness: { type: 2 },
    elbowed: false,
  });

  const out = [el];

  if (opts.label) {
    // Rótulo solto ao lado do meio da seta, não preso a ela: texto ligado
    // a arrow no Excalidraw fica com fundo opaco e some no export invertido.
    const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
    const { height } = measure(opts.label);
    const vertical = Math.abs(end.y - start.y) >= Math.abs(end.x - start.x);
    // Na vertical o rótulo fica ao lado da linha; na horizontal, acima e
    // encostado no início: centralizar num vão curto joga o texto por
    // cima das caixas dos dois lados.
    out.push(
      ...note(
        `${id}-l`,
        vertical ? mid.x + 12 : Math.min(start.x, end.x) + 6,
        vertical ? mid.y - height / 2 : mid.y - height - 6,
        opts.label,
        { fontSize: 13 },
      ),
    );
  }

  return out;
}

/** Moldura tracejada com rótulo no canto superior esquerdo. */
function frame(id, x, y, w, h, label) {
  return [
    base("rectangle", {
      id,
      x,
      y,
      width: w,
      height: h,
      strokeStyle: "dashed",
      strokeColor: "#868e96",
      roundness: { type: 3 },
    }),
    ...note(`${id}-l`, x + 14, y + 10, label, {
      fontSize: 13,
      strokeColor: "#868e96",
    }),
  ];
}

function buildScene(build) {
  const elements = [];
  const nodes = {};

  const api = {
    box(node) {
      nodes[node.id] = node;
      elements.push(...box(node));
      return node;
    },
    frame: (...args) => elements.push(...frame(...args)),
    note: (...args) => elements.push(...note(...args)),
    arrow(from, to, opts) {
      elements.push(...arrow(`ar-${elements.length}`, from, to, opts));
    },
    nodes,
  };

  build(api);

  // O binding é de mão dupla: a seta aponta para a caixa, e a caixa
  // precisa listar a seta, senão arrastar a caixa no editor deixa a
  // seta para trás.
  const byId = new Map(elements.map((el) => [el.id, el]));
  for (const el of elements) {
    if (el.type !== "arrow") continue;
    for (const binding of [el.startBinding, el.endBinding]) {
      const target = binding && byId.get(binding.elementId);
      if (target) target.boundElements.push({ id: el.id, type: "arrow" });
    }
  }

  // As molduras precisam ficar atrás das caixas que envolvem.
  const frames = elements.filter((el) => el.id.startsWith("frame"));
  const rest = elements.filter((el) => !el.id.startsWith("frame"));
  return [...frames, ...rest].map((el, i) => ({
    ...el,
    index: fractionalIndex(i),
  }));
}

for (const [slug, build] of Object.entries(scenes)) {
  seedCounter = 1;
  const scene = {
    type: "excalidraw",
    version: 2,
    source: "https://excalidraw.com",
    elements: buildScene(build),
    appState: { gridSize: null, viewBackgroundColor: "#ffffff" },
    files: {},
  };
  await writeFile(
    path.join(HERE, `${slug}.excalidraw`),
    JSON.stringify(scene, null, 2) + "\n",
    "utf8",
  );

  const svgDir = path.join(HERE, "..", "public", "projects", slug);
  await mkdir(svgDir, { recursive: true });
  await writeFile(
    path.join(svgDir, "architecture.svg"),
    sceneToSvg(scene.elements),
    "utf8",
  );

  console.log(
    `${slug}: ${scene.elements.length} elementos → .excalidraw + architecture.svg`,
  );
}
