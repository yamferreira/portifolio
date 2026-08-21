import { ImageResponse } from "next/og";

/**
 * Ícone da tela de início do iOS. Precisa ser bitmap (o Next só aceita
 * jpg/jpeg/png aqui), então é gerado com ImageResponse em vez de SVG.
 *
 * Os paths são os mesmos de icon.svg: desenhar as letras em vez de
 * escrevê-las evita depender de fonte embarcada, e a fonte padrão do
 * next/og tem um peso só, que não bate com o monograma do site.
 *
 * Sem canto arredondado de propósito: o iOS aplica a própria máscara e
 * não respeita transparência, então o fundo vai preto e sangrando.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            fill="none"
            stroke="#f5f5f7"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M11 19 L20 32 L29 19" />
            <path d="M20 32 L20 45" />
            <path d="M38 45 L38 19 L54 19" />
            <path d="M38 31 L49 31" />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
