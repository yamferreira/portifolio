import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-6xl px-6 pb-28 pt-8 sm:px-8 lg:pb-12 lg:pl-40 lg:pr-10">
      <div className="flex flex-col gap-2 border-t border-line pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-dim sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span>Next.js · TypeScript · Tailwind</span>
      </div>
    </footer>
  );
}
