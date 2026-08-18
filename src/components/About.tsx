import Reveal from "./Reveal";
import Section from "./Section";

const facts = [
  { label: "Formação", value: "ADS · FMU — conclusão em 2027" },
  { label: "Foco", value: "Arquitetura orientada a eventos" },
  { label: "Principal", value: "Java 17 · Spring Boot · AWS" },
];

export default function About() {
  return (
    <Section id="sobre" index="02" title="Sobre">
      <div className="grid gap-16 md:grid-cols-[1.4fr_1fr] md:gap-24">
        <Reveal className="type-lead space-y-8 text-muted">
          <p>
            Antes de programar, eu empreendia. Foi ali que aprendi a olhar para
            um problema pelo custo que ele gera — e essa é a mesma pergunta que
            eu faço hoje diante de uma arquitetura:{" "}
            <span className="text-fg">o que quebra quando isso crescer?</span>
          </p>
          <p>
            Migrei para o desenvolvimento e me especializei em back-end com{" "}
            <span className="text-fg">Java e Spring Boot</span>. Curso Análise e
            Desenvolvimento de Sistemas na FMU, com formação prevista para 2027.
          </p>
          <p>
            Meu foco é <span className="text-fg">arquitetura orientada a eventos</span>{" "}
            e sistemas distribuídos: mensageria com SNS e SQS, processamento
            assíncrono com Lambda e serviços que se comunicam sem se acoplar.
            Gosto de sistemas que degradam com elegância em vez de cair de uma
            vez.
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <dl className="divide-y divide-line border-y border-line">
            {facts.map((fact) => (
              <div key={fact.label} className="py-6">
                <dt className="type-label text-dim">{fact.label}</dt>
                <dd className="mt-2 text-[15px] text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
