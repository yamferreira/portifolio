import type { Architecture } from "@/data/case-studies";
import { publicFileExists } from "@/lib/public-assets";

/**
 * O diagrama exportado do Excalidraw. O traço vem escuro sobre fundo
 * claro; como a página é preta, o filtro inverte para traço claro sem
 * precisar de um segundo export. `invert: false` desliga isso quando o
 * SVG já sai com traço claro.
 */
export default async function ArchitectureDiagram({
  architecture,
}: {
  architecture: Architecture;
}) {
  const exists = await publicFileExists(architecture.src);
  const invert = architecture.invert ?? true;

  return (
    <figure>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface p-6 md:p-10">
        {exists ? (
          // next/image não otimiza SVG e exigiria width/height fixos, que
          // dependem do que o Excalidraw exportar. <img> é o caminho certo aqui.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={architecture.src}
            alt={`Diagrama de arquitetura — ${architecture.caption}`}
            className={`mx-auto h-auto w-full max-w-3xl ${
              invert ? "[filter:invert(1)]" : ""
            }`}
          />
        ) : (
          <div className="flex min-h-56 items-center justify-center rounded-xl border border-dashed border-line px-6 py-10 text-center">
            <p className="max-w-sm text-sm leading-relaxed text-dim">
              Diagrama ainda não exportado. Abra o{" "}
              <code className="font-mono text-muted">.excalidraw</code>{" "}
              correspondente em excalidraw.com e salve o SVG em{" "}
              <code className="font-mono text-muted">{architecture.src}</code>.
            </p>
          </div>
        )}
      </div>
      <figcaption className="mt-5 max-w-2xl text-sm leading-relaxed text-dim">
        {architecture.caption}
      </figcaption>
    </figure>
  );
}
