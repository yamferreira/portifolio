import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-28 sm:px-8">
      <span className="type-label text-dim">404</span>
      <h1 className="type-title mt-4 font-display text-fg">
        Página não encontrada
      </h1>
      <p className="type-lead mt-6 max-w-lg text-muted">
        O endereço não existe, ou o projeto que ficava aqui mudou de lugar.
      </p>
      <Link
        href="/"
        className="group mt-10 inline-flex w-fit items-center gap-1.5 text-[15px] text-muted transition-colors duration-200 hover:text-fg"
      >
        Voltar para a home
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        >
          ›
        </span>
      </Link>
    </div>
  );
}
