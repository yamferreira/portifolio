import Reveal from "./Reveal";
import Section from "./Section";

/** Edite livremente: a ordem aqui é a ordem exibida na página. */
const groups = [
  {
    title: "Back-End",
    items: [
      "Java 17",
      "Spring Boot",
      "Spring Security",
      "JPA / Hibernate",
      "APIs REST",
      "JWT",
    ],
  },
  {
    title: "Cloud & Mensageria",
    items: [
      "AWS SNS",
      "AWS SQS",
      "AWS Lambda",
      "AWS S3",
      "Arquitetura orientada a eventos",
    ],
  },
  {
    title: "Banco de Dados",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Prisma"],
  },
  {
    title: "Front-End",
    items: ["TypeScript", "React", "Next.js", "TailwindCSS"],
  },
  {
    title: "DevOps & Ferramentas",
    items: ["Docker", "Git", "Vercel"],
  },
];

export default function Skills() {
  return (
    <Section id="stack" index="04" title="Stack">
      <div className="grid gap-x-16 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, i) => (
          <Reveal key={group.title} delay={(i % 3) * 0.08}>
            <h3 className="type-label text-dim">{group.title}</h3>
            {/* Lista simples em vez de pills: nada aqui é clicável, então
                borda e fundo só criavam peso visual sem significado. */}
            <ul className="mt-5 space-y-2.5">
              {group.items.map((item) => (
                <li key={item} className="text-[15px] text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
