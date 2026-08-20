import type { CaseStudy } from "./types";

export const barbershopAppointment: CaseStudy = {
  slug: "barbeariaa",
  title: "Agendamento para Barbearia",
  stack: [
    "Next.js 15 (App Router)",
    "React 19",
    "TypeScript",
    "Prisma",
    "PostgreSQL (Neon)",
    "Auth.js v5",
    "Tailwind CSS v4",
  ],
  problem:
    "Numa barbearia de um barbeiro só, cada horário marcado era uma conversa: o cliente pergunta, o barbeiro confere a agenda, responde, anota. A agenda vivia na cabeça de uma pessoa — e bastava uma distração para dois clientes caírem no mesmo horário.",
  repo: "https://github.com/yamferreira/barbershop-appointment",
  apiDocs: null,
  architecture: {
    src: "/projects/barbeariaa/architecture.svg",
    caption:
      "O cliente escolhe serviços e horário na home (Server Components) → a Server Action createBooking valida domingo, dia bloqueado, sobreposição de intervalo e fechamento → Prisma grava no PostgreSQL, onde um índice único parcial é a última barreira contra corrida. Em paralelo, uma rota de cron sincroniza feriados da BrasilAPI para a tabela de bloqueios.",
  },
  demos: [
    // Capturas da aplicação rodando de verdade, com PostgreSQL local e
    // dados criados pelo próprio fluxo de agendamento.
    //
    // Só a primeira está em largura de celular: o resto do card de
    // agendamento tem conteúdo mais largo que 390px e sai cortado ali,
    // então essas ficam em desktop até o layout dar conta.
    {
      kind: "image",
      label: "Escolha de serviços",
      src: "/projects/barbeariaa/servicos.png",
      frame: "phone",
      caption:
        "Seleção múltipla em grid; a duração total é somada em tempo real — Corte + Barba = 50min — e é ela que define quais horários vão sobrar.",
    },
    {
      kind: "image",
      label: "Calendário e horários",
      src: "/projects/barbeariaa/horarios.png",
      caption:
        "Domingos e datas passadas já chegam desabilitados, mesmo os futuros. Os horários listados são só os que cabem nos 50min sem colidir nem passar do fechamento.",
    },
    {
      kind: "image",
      label: "Agendar sem login",
      src: "/projects/barbeariaa/guest.png",
      caption:
        "Resumo do que foi escolhido e um único campo obrigatório: o nome. Telefone é opcional e não existe tela de cadastro no caminho.",
    },
    {
      kind: "image",
      label: "Painel do barbeiro",
      src: "/projects/barbeariaa/admin.png",
      caption:
        "Agenda do dia agrupada por status, cada linha mostrando o intervalo que ocupa — \"10:00, até 10:50\" é a mesma duração congelada que a checagem de conflito usa.",
    },
  ],
  decisions: [
    {
      decision: "Conflito calculado por intervalo, não por horário exato",
      why: "Um agendamento ocupa [início, início + duração). Um corte de 1h às 11:00 atropela quem tentar marcar às 12:00 sem repetir a data — comparar só o instante deixaria isso passar. Encostar, porém, não conta: quem termina 13:00 não colide com quem começa 13:00.",
    },
    {
      decision: "Defesa em três camadas para o mesmo horário",
      why: "A lista de horários no cliente é conveniência de UX e pode estar desatualizada; a Server Action faz a validação real; e um índice único parcial no PostgreSQL é a última barreira contra duas requisições simultâneas. As duas primeiras são experiência, a terceira é garantia.",
    },
    {
      decision: "O índice único é parcial (WHERE status <> 'CANCELADO')",
      why: "Um @@unique comum em `date` prenderia o horário para sempre depois de um cancelamento. Com o índice parcial, cancelar libera o slot automaticamente — sem job de limpeza e sem apagar o histórico.",
    },
    {
      decision: "Booking.durationMinutes é um snapshot, não um cálculo",
      why: "A duração é congelada na hora de reservar. Se o barbeiro mudar amanhã o tempo de um corte, a agenda de quem já marcou não pode ser reescrita por trás — e a checagem de conflito consegue ler o intervalo sem agregar a tabela de junção de serviços.",
    },
  ],
  snippet: {
    language: "ts",
    file: "app/_actions/create-booking.ts",
    description:
      "O coração da regra de agenda. Soma a duração dos serviços escolhidos, recusa o que ultrapassa o fechamento e compara o novo intervalo com todos os agendamentos ativos do dia. O catch no final trata o caso em que a corrida foi perdida por milissegundos e o banco recusou.",
    code: `const totalDurationMinutes = services.reduce(
  (sum, service) => sum + service.durationMinutes,
  0,
)

const newStart = params.date
const newEnd = getBookingEnd(newStart, totalDurationMinutes)

if (newEnd > getClosingTime(newStart)) {
  return { success: false as const, message: \`Esse horário ultrapassa o fechamento (\${CLOSING_HOUR}h).\` }
}

const dayBookings = await db.booking.findMany({
  where: {
    date: { gte: startOfDay(params.date), lte: endOfDay(params.date) },
    status: { not: "CANCELADO" },
  },
  // A duração vem da coluna do próprio Booking, não do serviço: um
  // agendamento com vários serviços ocupa a soma deles.
  select: { date: true, durationMinutes: true },
})

// Dois intervalos colidem quando um começa antes do outro terminar e
// termina depois do outro começar. Encostar não conta.
const hasConflict = dayBookings.some((booking) =>
  intervalsOverlap(
    newStart,
    newEnd,
    booking.date,
    getBookingEnd(booking.date, booking.durationMinutes),
  ),
)

if (hasConflict) {
  return { success: false as const, message: "Esse horário conflita com outro agendamento." }
}

try {
  await db.booking.create({ /* ... */ })
  return { success: true as const }
} catch (error) {
  // Última linha de defesa: o índice único parcial recusou porque outra
  // requisição gravou o mesmo horário entre a checagem e o insert.
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return { success: false as const, message: "Esse horário acabou de ser reservado." }
  }
  throw error
}`,
  },
};
