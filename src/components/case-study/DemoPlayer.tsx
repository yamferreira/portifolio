"use client";

import { ArrowUpRight, Play } from "lucide-react";
import { useState } from "react";
import type { DemoImage, DemoLink, DemoVideo } from "@/data/case-studies";

/** Um vídeo local, já sabendo se o arquivo existe em /public. */
export type ResolvedVideo = DemoVideo & { available: boolean };

/** Um link externo, com o poster já resolvido (undefined se não existir). */
export type ResolvedLink = DemoLink & { poster?: string };

/** Uma captura de tela, já sabendo se o arquivo existe em /public. */
export type ResolvedImage = DemoImage & { available: boolean };

export type ResolvedDemo = ResolvedVideo | ResolvedLink | ResolvedImage;

/**
 * A demonstração, em três formas: captura de tela para projeto que tem
 * interface, <video> mudo em loop (se comporta como GIF, com arquivo
 * muito menor) para uma chamada de API, e card clicável quando o vídeo
 * é longo demais para hospedar aqui. Com mais de uma, abas trocam
 * entre elas — e dá para misturar as três no mesmo projeto.
 */
export default function DemoPlayer({ demos }: { demos: ResolvedDemo[] }) {
  const [active, setActive] = useState(0);
  const demo = demos[active];

  if (!demo) return null;

  return (
    <div>
      {demos.length > 1 && (
        <div
          role="tablist"
          aria-label="Demonstrações"
          className="mb-6 flex flex-wrap gap-1.5"
        >
          {demos.map((item, i) => {
            const isActive = i === active;
            return (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className={`rounded-full border px-4 py-2 font-mono text-xs transition-colors duration-200 ${
                  isActive
                    ? "border-white/20 bg-white/10 text-fg"
                    : "border-line text-dim hover:border-white/15 hover:text-muted"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {demo.kind === "link" && <ExternalDemo demo={demo} />}
      {demo.kind === "video" && <LocalVideo demo={demo} />}
      {demo.kind === "image" && <Screenshot demo={demo} />}

      {demo.caption && (
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-dim">
          {demo.caption}
        </p>
      )}
    </div>
  );
}

function LocalVideo({ demo }: { demo: ResolvedVideo }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      {demo.available ? (
        <video
          // A key força o React a recriar o elemento na troca de aba —
          // sem ela o <video> mantém o src antigo em cache.
          key={demo.src}
          src={demo.src}
          poster={demo.poster}
          autoPlay
          loop
          muted
          playsInline
          controls
          className="h-auto w-full"
        />
      ) : (
        <div className="flex min-h-56 items-center justify-center px-6 py-16 text-center">
          <p className="max-w-sm text-sm leading-relaxed text-dim">
            Gravação de <span className="font-mono text-muted">{demo.label}</span>{" "}
            ainda não publicada. Salve o vídeo em{" "}
            <code className="font-mono text-muted">{demo.src}</code>.
          </p>
        </div>
      )}
    </div>
  );
}

function Screenshot({ demo }: { demo: ResolvedImage }) {
  // Print de celular é estreito e alto: limitar a largura e centralizar
  // num painel evita a imagem esticada ocupando a página inteira.
  const isPhone = demo.frame === "phone";

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-surface ${
        isPhone ? "px-6 py-8" : ""
      }`}
    >
      {demo.available ? (
        // Screenshot de UI não passa por next/image: as dimensões variam
        // por captura e o arquivo já vem do próprio repositório.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={demo.src}
          alt={demo.caption ?? demo.label}
          className={
            isPhone
              ? "mx-auto h-auto w-full max-w-[320px] rounded-xl border border-line"
              : "h-auto w-full"
          }
        />
      ) : (
        <div className="flex min-h-56 items-center justify-center px-6 py-16 text-center">
          <p className="max-w-sm text-sm leading-relaxed text-dim">
            Captura de <span className="font-mono text-muted">{demo.label}</span>{" "}
            ainda não publicada. Salve o print em{" "}
            <code className="font-mono text-muted">{demo.src}</code>.
          </p>
        </div>
      )}
    </div>
  );
}

function ExternalDemo({ demo }: { demo: ResolvedLink }) {
  return (
    <a
      href={demo.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${demo.label} — abrir no ${demo.source}, em nova aba`}
      className="group block overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-300 hover:border-white/20"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-surface-2">
        {demo.poster ? (
          <>
            {/* A captura é a única coisa colorida da página. Fica em cinza
                e só ganha cor quando o cursor mostra interesse. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={demo.poster}
              alt=""
              className="size-full object-cover opacity-60 grayscale transition-[filter,opacity,transform] duration-500 ease-out group-hover:scale-[1.02] group-hover:opacity-100 group-hover:grayscale-0"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:opacity-0"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="type-label text-dim">{demo.source}</span>
          </div>
        )}

        {/* Botão de play: só a forma, sem preenchimento de marca. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="flex size-16 items-center justify-center rounded-full border border-white/30 bg-black/50 backdrop-blur-sm transition-[transform,background-color,border-color] duration-300 ease-out group-hover:scale-110 group-hover:border-white/60 group-hover:bg-black/70">
            <Play className="ml-0.5 size-6 fill-fg text-fg" />
          </span>
        </div>

        {demo.duration && (
          <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-1 font-mono text-xs text-fg backdrop-blur-sm">
            {demo.duration}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4">
        <span className="text-sm text-fg">{demo.label}</span>
        <span className="inline-flex items-center gap-1.5 text-sm text-dim transition-colors duration-200 group-hover:text-fg">
          Ver no {demo.source}
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </a>
  );
}
