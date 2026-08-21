/**
 * As cenas de arquitetura, uma por projeto. Cada função recebe um
 * mini-API (`box`, `arrow`, `frame`, `note`) e monta o desenho.
 * Coordenadas em pixels, origem no canto superior esquerdo.
 *
 * `w`/`h` são mínimos: a caixa cresce (em torno do próprio centro) se o
 * rótulo não couber. Rótulo em mais de uma linha mantém as caixas
 * estreitas: prefira quebrar a linha a alargar a coluna.
 */

const W = 260; // largura mínima padrão de uma caixa
const H = 74; // altura mínima padrão

export const scenes = {
  // ── Catálogo orientado a eventos na AWS ────────────────────────
  "aws-event-driven-catalog": ({ box, arrow, frame }) => {
    frame("frame-aws", 490, 140, 340, 530, "LocalStack em dev · AWS em produção");

    const client = box({ id: "client", x: 40, y: 30, w: 300, h: 60, label: "Cliente HTTP" });
    const api = box({
      id: "api",
      x: 40,
      y: 170,
      w: 300,
      h: 100,
      label: "Spring Boot REST API\n/api/product · /api/category",
    });
    const mongo = box({
      id: "mongo",
      x: 40,
      y: 360,
      w: 300,
      h: H,
      label: "MongoDB\nprodutos e categorias",
      store: true,
    });

    // `sns` alinhado ao centro de `api` para a seta sair reta na horizontal.
    const sns = box({ id: "sns", x: 520, y: 183, w: 280, h: H, label: "SNS\ncatalog-emit" });
    const sqs = box({ id: "sqs", x: 520, y: 320, w: 280, h: H, label: "SQS\ncatalog-queue" });
    const lambda = box({
      id: "lambda",
      x: 520,
      y: 455,
      w: 280,
      h: H,
      label: "AWS Lambda\nconsumidor (Node.js)",
    });
    const s3 = box({
      id: "s3",
      x: 520,
      y: 590,
      w: 280,
      h: H,
      label: "Amazon S3\nJSON por ownerId",
      store: true,
    });

    arrow(client, api, { label: "POST /api/product" });
    arrow(api, mongo, { label: "1. save" });
    arrow(api, sns, { label: "2. publish" });
    arrow(sns, sqs, { label: "fan-out" });
    arrow(sqs, lambda);
    arrow(lambda, s3, { label: "put object" });
  },

  // ── Agendamento da barbearia ───────────────────────────────────
  barbeariaa: ({ box, arrow, frame }) => {
    frame("frame-action", 40, 320, 420, 210, "Server Action · validação real");

    const client = box({
      id: "client",
      x: 100,
      y: 30,
      w: 300,
      h: 60,
      label: "Navegador · cliente",
    });
    const home = box({
      id: "home",
      x: 100,
      y: 165,
      w: 300,
      h: 90,
      label: "Home (Server Components)\nlista só os horários livres",
    });
    const action = box({
      id: "action",
      x: 75,
      y: 360,
      w: 350,
      h: 130,
      label: "createBooking\ndomingo? · dia bloqueado?\nsobreposição? · fechamento?",
    });
    const prisma = box({ id: "prisma", x: 100, y: 575, w: 300, h: 60, label: "Prisma Client" });
    const db = box({
      id: "db",
      x: 100,
      y: 710,
      w: 300,
      h: 100,
      label: "PostgreSQL (Neon)\níndice único parcial em date\nstatus diferente de CANCELADO",
      store: true,
    });

    const brasilapi = box({
      id: "brasilapi",
      x: 640,
      y: 205,
      w: W,
      h: 60,
      label: "BrasilAPI · feriados",
    });
    const cron = box({
      id: "cron",
      x: 640,
      y: 380,
      w: W,
      h: H,
      label: "/api/cron/sync-holidays\nBearer em tempo constante",
    });

    arrow(client, home, { label: "escolhe serviços e horário" });
    arrow(home, action, { label: "confirma" });
    arrow(action, prisma);
    arrow(prisma, db, { label: "última barreira contra corrida" });
    arrow(brasilapi, cron);
    // BlockedDate é uma tabela do mesmo banco: desenhá-la como caixa
    // separada sugeriria um segundo armazenamento que não existe.
    arrow(cron, db, { label: "grava BlockedDate" });
  },

  // ── Template SaaS ──────────────────────────────────────────────
  saas: ({ box, arrow, frame }) => {
    frame("frame-stripe", 430, 390, 720, 390, "Stripe (hospedado)");

    const browser = box({ id: "browser", x: 60, y: 30, w: 340, h: 60, label: "Navegador" });
    const auth = box({
      id: "auth",
      x: 60,
      y: 165,
      w: 340,
      h: H,
      label: "Auth.js\nlogin com Google",
    });
    const firestore = box({
      id: "firestore",
      x: 60,
      y: 300,
      w: 340,
      h: H,
      label: "Firestore · users\n{ stripeCustomerId }",
      store: true,
    });
    const route = box({
      id: "route",
      x: 60,
      y: 435,
      w: 340,
      h: 90,
      label: "Route Handler\n/api/stripe/create-subscription",
    });
    // Centro vertical igual ao de `route`: a seta entre as duas sai reta.
    const customer = box({
      id: "customer",
      x: 610,
      y: 443,
      w: 300,
      h: H,
      label: "Customers\nresolve ou cria",
    });
    const checkout = box({
      id: "checkout",
      x: 460,
      y: 680,
      w: 280,
      h: H,
      label: "Checkout Session\nassinatura",
    });
    const portal = box({
      id: "portal",
      x: 790,
      y: 680,
      w: 280,
      h: H,
      label: "Billing Portal\ntrocar plano · cancelar",
    });

    arrow(browser, auth);
    arrow(auth, firestore, { label: "cria o usuário" });
    arrow(firestore, route);
    arrow(route, customer, { label: "getOrCreateCustomer" });
    arrow(customer, checkout);
    arrow(customer, portal);
  },

  // ── Product Manager ────────────────────────────────────────────
  "product-manager": ({ box, arrow, frame }) => {
    frame("frame-spring", 40, 285, 380, 480, "Spring Boot");

    const react = box({
      id: "react",
      x: 90,
      y: 30,
      w: 280,
      h: H,
      label: "React (Create React App)\ntabela + formulário",
    });
    const controle = box({
      id: "controle",
      x: 90,
      y: 330,
      w: 280,
      h: 100,
      label: "ProdutoControle\n/listar · /cadastrar\n/alterar · /remover/{codigo}",
    });
    const servico = box({
      id: "servico",
      x: 90,
      y: 480,
      w: 280,
      h: H,
      label: "ProdutoServico\nvalidação + status HTTP",
    });
    const repo = box({
      id: "repo",
      x: 90,
      y: 645,
      w: 280,
      h: H,
      label: "ProdutoRepositorio\nSpring Data JPA",
    });
    const mysql = box({
      id: "mysql",
      x: 90,
      y: 820,
      w: 280,
      h: H,
      label: "MySQL\nbase spring_react",
      store: true,
    });

    arrow(react, controle, { label: "HTTP · JSON" });
    arrow(controle, servico);
    arrow(servico, repo, { label: "save · delete · findAll" });
    arrow(repo, mysql);
  },

  // ── Cadastro de usuário ────────────────────────────────────────
  "cadastro-usuario": ({ box, arrow, frame }) => {
    frame("frame-spring", 40, 155, 380, 480, "Spring Boot");

    const client = box({
      id: "client",
      x: 90,
      y: 30,
      w: 280,
      h: 60,
      label: "Cliente HTTP (Postman)",
    });
    const controller = box({
      id: "controller",
      x: 90,
      y: 200,
      w: 280,
      h: 100,
      label: "UsuarioController\nPOST · GET · PUT · DELETE\nem /usuario",
    });
    const service = box({
      id: "service",
      x: 90,
      y: 350,
      w: 280,
      h: H,
      label: "UsuarioService\natualização parcial",
    });
    const repo = box({
      id: "repo",
      x: 90,
      y: 515,
      w: 280,
      h: H,
      label: "UsuarioRepository\nJpaRepository",
    });
    const h2 = box({
      id: "h2",
      x: 90,
      y: 690,
      w: 280,
      h: H,
      label: "H2 em memória\nemail unique",
      store: true,
    });

    arrow(client, controller);
    arrow(controller, service);
    arrow(service, repo, { label: "saveAndFlush · findByEmail" });
    arrow(repo, h2);
  },
};
