import { access } from "node:fs/promises";
import path from "node:path";

/**
 * Diagramas e gravações são exportados à mão e entram no repositório
 * depois do código. Enquanto o arquivo não existe, a página mostra um
 * espaço reservado em vez de uma imagem quebrada — a checagem roda no
 * build, então não custa nada em runtime.
 */
export async function publicFileExists(src: string): Promise<boolean> {
  const relative = src.replace(/^\//, "");
  try {
    await access(path.join(process.cwd(), "public", relative));
    return true;
  } catch {
    return false;
  }
}
