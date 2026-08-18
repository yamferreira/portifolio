import { site } from "@/data/site";
import Reveal from "./Reveal";
import Section from "./Section";

const links = [
  { label: "GitHub", value: "github.com/yamferreira", href: site.github },
  { label: "LinkedIn", value: "in/yamferreira", href: site.linkedin },
  { label: "E-mail", value: site.email, href: `mailto:${site.email}` },
];

export default function Contact() {
  return (
    <Section id="contato" index="05" title="Contato">
      <Reveal>
        <p
          className="font-display max-w-3xl font-medium leading-[1.05] tracking-[-0.02em] text-fg"
          style={{ fontSize: "clamp(2rem, 6vw, 4.25rem)" }}
        >
          Vamos construir
          <br />
          algo juntos<span className="text-accent">.</span>
        </p>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-muted">
          Aberto a oportunidades em back-end e conversas sobre sistemas
          distribuídos. A resposta costuma vir rápido.
        </p>
      </Reveal>

      <Reveal delay={0.12}>
        <ul className="mt-14 border-t border-line">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 border-b border-line py-5 transition-colors hover:border-accent/40"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
                  {link.label}
                </span>
                <span className="flex items-center gap-3 text-sm text-fg transition-colors group-hover:text-accent sm:text-base">
                  {link.value}
                  <span className="text-dim transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-accent">
                    ↗
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
