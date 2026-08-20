import { highlight } from "@/lib/highlight";
import type { Snippet } from "@/data/case-studies";

/**
 * Bloco de código destacado no build pelo Shiki — nenhum JS de
 * highlight chega ao navegador.
 */
export default async function CodeBlock({ snippet }: { snippet: Snippet }) {
  const html = await highlight(snippet.code, snippet.language);

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
        <code className="font-mono text-xs text-muted">{snippet.file}</code>
        <span className="type-label uppercase text-dim">
          {snippet.language}
        </span>
      </figcaption>
      {/* O <pre> do Shiki traz o próprio background; o overflow fica no
          contêiner para o código largo rolar sozinho, sem empurrar a página. */}
      <div className="overflow-x-auto [&_pre]:!bg-transparent [&_pre]:p-5 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-[1.7]">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </figure>
  );
}
