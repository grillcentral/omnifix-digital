import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <main className="page-shell grid min-h-[calc(100vh-220px)] place-items-center">
      <section className="max-w-lg rounded-lg border border-orange-500/30 bg-orange-500/10 p-8 text-center">
        <ShieldAlert className="mx-auto text-orange-300" size={34} />
        <h1 className="mt-4 text-3xl font-black text-zinc-50">Acesso restrito</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-300">
          Seu usuario esta autenticado, mas nao possui permissao para acessar esta
          area operacional.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md bg-orange-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-orange-400"
        >
          Voltar ao inicio
        </Link>
      </section>
    </main>
  );
}
