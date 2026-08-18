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
        <p className="type-display max-w-3xl font-display text-fg">
          Vamos construir
          <br />
          algo juntos.
        </p>
        <p className="type-lead mt-10 max-w-lg text-muted">
          Aberto a oportunidades em back-end e conversas sobre sistemas
          distribuídos. A resposta costuma vir rápido.
        </p>
      </Reveal>

      <Reveal delay={0.12}>
        <ul className="mt-20 border-t border-line">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 border-b border-line py-7 transition-colors duration-200 hover:border-white/20"
              >
                <span className="type-label text-dim">{link.label}</span>
                <span className="flex items-center gap-3 text-[15px] text-fg sm:text-base">
                  {link.value}
                  <span
                    aria-hidden="true"
                    className="text-dim transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-fg"
                  >
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
