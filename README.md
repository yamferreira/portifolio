# Portfólio — Yam Ferreira

Site pessoal de **Yam Ferreira**, desenvolvedor back-end com foco em Java,
Spring Boot e arquitetura orientada a eventos na AWS.

Página única, renderizada estaticamente, com seções de apresentação,
projetos, stack e contato.

## Stack

| Camada | Ferramenta |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Linguagem | TypeScript |
| UI | React 19 |
| Estilo | Tailwind CSS v4 (tokens via `@theme`) |
| Animação | [Motion](https://motion.dev) |
| Fontes | Geist e JetBrains Mono, via `next/font` |

## Rodando localmente

Requer Node 20 ou superior.

```bash
npm install
npm run dev
```

O site sobe em <http://localhost:3000>.

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Build de produção |
| `npm run start` | Sobe o build de produção |
| `npm run lint` | ESLint |

## Editando o conteúdo

Quase todo o texto do site vive em dois arquivos. **Comece por eles** — na
maioria das vezes não é preciso tocar em componente nenhum.

- **`src/data/site.ts`** — nome, cargo, tagline, e-mail, links sociais, URL
  canônica e os itens de navegação.
- **`src/data/projects.ts`** — a lista de projetos. Cada item tem `summary`
  (uma linha sobre o que é) e `highlight` (o detalhe técnico), e ambos
  aparecem no card. `repo: null` renderiza o projeto como "Repositório em
  breve", sem link.

A ordem dos arrays nesses arquivos é a ordem exibida na página.

Os grupos da seção Stack ficam em `src/components/Skills.tsx`, no topo do
arquivo.

## Estrutura

```
src/
├─ app/
│  ├─ layout.tsx      # shell, fontes, metadados de SEO e Open Graph
│  ├─ page.tsx        # composição das seções
│  ├─ globals.css     # tokens de design e escala tipográfica
│  ├─ icon.svg        # favicon
│  └─ apple-icon.tsx  # ícone de tela de início do iOS (gerado)
├─ components/        # seções e primitivos (Reveal, Section)
└─ data/              # conteúdo do site
```

## Direção visual

O site é **monocromático por decisão**: preto `#000000`, branco `#f5f5f7` e
dois cinzas. Não existe cor de destaque, e a hierarquia vem de peso, tamanho
e espaço.

Duas convenções que valem conhecer antes de mexer no CSS:

- **Tokens em `@theme`** (`globals.css`) definem a paleta inteira. Trocar a
  identidade do site é trocar esses valores — nenhum componente tem cor
  hard-coded.
- **A escala tipográfica** (`.type-display`, `.type-title`, `.type-heading`,
  `.type-lead`, `.type-body`, `.type-label`) carrega tamanho, `line-height` e
  `letter-spacing` juntos em cada degrau. Isso é proposital: tracking é
  específico por tamanho — negativo no texto grande, positivo nos rótulos —
  então um valor único estaria errado em algum lugar.

Todo movimento respeita `prefers-reduced-motion`.

## Pendências

- `src/data/site.ts` — confirmar a URL real do LinkedIn e apontar `url` para
  o domínio de produção antes do deploy (ele alimenta `metadataBase` e as
  tags Open Graph).
- `src/data/projects.ts` — adicionar o link do repositório de
  **Ticket Marketplace**.
