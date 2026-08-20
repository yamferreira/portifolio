import type { CaseStudy } from "./types";

export const saas: CaseStudy = {
  slug: "saas",
  title: "Template SaaS",
  stack: [
    "Next.js 15 (App Router)",
    "React 19",
    "TypeScript",
    "Auth.js",
    "Firebase / Firestore",
    "Stripe",
    "Tailwind CSS v4",
  ],
  problem:
    "Todo produto pago começa repetindo a mesma semana de trabalho: login, cobrança recorrente, tela de gerenciar assinatura. Este projeto resolve essa base uma vez, para que o próximo produto comece pela ideia e não pelo checkout.",
  repo: "https://github.com/yamferreira/saas",
  apiDocs: null,
  architecture: {
    src: "/projects/saas/architecture.svg",
    caption:
      "Login com Google via Auth.js → o usuário vive no Firestore → ao assinar, a Route Handler resolve (ou cria) o customer na Stripe, guarda o stripeCustomerId no documento do usuário e devolve uma sessão de Checkout. A mesma referência alimenta o Billing Portal.",
  },
  demos: [
    // TODO: gravar as telas e trocar os caminhos abaixo.
    {
      kind: "video",
      label: "Login com Google",
      src: "/projects/saas/login.mp4",
      caption: "Autenticação social e criação do usuário no Firestore.",
    },
    {
      kind: "video",
      label: "Checkout da assinatura",
      src: "/projects/saas/checkout.mp4",
      caption:
        "POST /api/stripe/create-subscription e redirecionamento para o Checkout da Stripe.",
    },
  ],
  decisions: [
    {
      decision: "O customer da Stripe é resolvido, não recriado a cada compra",
      why: "`getOrCreateCustomer` lê o `stripeCustomerId` já salvo no documento do usuário e só cria um novo quando ele não existe. Sem isso, cada assinatura geraria um cliente novo na Stripe e o histórico de cobrança do mesmo usuário ficaria espalhado em vários registros — quebrando o Billing Portal.",
    },
    {
      decision: "O vínculo é guardado nos dois lados",
      why: "O Firestore guarda o `stripeCustomerId` e a Stripe guarda o `userId` no metadata do customer. Qualquer um dos dois sistemas consegue responder de quem é uma cobrança, mesmo olhando sozinho — o que importa quando o webhook chega vindo da Stripe.",
    },
    {
      decision: "Stripe Checkout e Billing Portal hospedados, em vez de telas próprias",
      why: "Cartão, 3-D Secure, troca de plano e cancelamento ficam do lado da Stripe. O projeto nunca toca em dado de cartão, o que tira todo o escopo de PCI da aplicação e elimina as telas que dariam mais trabalho para manter.",
    },
    {
      decision: "A chave da Stripe é validada na inicialização do módulo",
      why: "`lib/stripe.ts` lança erro se `STRIPE_SECRET_KEY` não existir. O deploy quebra na subida, e não na primeira tentativa de pagamento de um usuário real.",
    },
  ],
  snippet: {
    language: "ts",
    file: "src/app/server/stripe/get-customer-id.ts",
    description:
      "A função que mantém usuário e cliente da Stripe apontando um para o outro. É idempotente: chamar de novo devolve o mesmo customer, em vez de criar um duplicado.",
    code: `import "server-only"

export async function getOrCreateCustomer(userId: string, userEmail: string) {
  const userRef = db.collection("users").doc(userId)
  const userDoc = await userRef.get()

  if (!userDoc.exists) {
    throw new Error("User not found.")
  }

  // Já existe cliente na Stripe para esse usuário: reaproveita.
  // Criar outro espalharia o histórico de cobrança em dois registros.
  const stripeCustomerId = userDoc.data()?.stripeCustomerId
  if (stripeCustomerId) {
    return stripeCustomerId
  }

  const userName = userDoc.data()?.name

  const stripeCustomer = await stripe.customers.create({
    email: userEmail,
    ...(userName && { name: userName }),
    // O vínculo também vai para o lado da Stripe: um evento de webhook
    // sabe de quem é sem precisar consultar o Firestore de volta.
    metadata: { userId },
  })

  await userRef.update({ stripeCustomerId: stripeCustomer.id })

  return stripeCustomer.id
}`,
  },
};
