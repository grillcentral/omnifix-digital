import { CalendarClock } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState.jsx";
import ErrorState from "@/components/ui/ErrorState.jsx";
import LoadingState from "@/components/ui/LoadingState.jsx";
import { useAgendamentos } from "../hooks/useOmnifixData";

export default function Agendamentos() {
  const {
    data: agendamentos = [],
    isLoading,
    isError,
    error,
  } = useAgendamentos();

  return (
    <main className="page-shell">
      <p className="eyebrow">agenda</p>
      <h1 className="mt-2 text-3xl font-black text-zinc-50">Agendamentos</h1>
      {isLoading ? <LoadingState label="Carregando agendamentos..." /> : null}
      {isError ? <ErrorState message={error.message} /> : null}
      {!isLoading && !isError && agendamentos.length === 0 ? <EmptyState /> : null}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {!isLoading && !isError && agendamentos.map((agenda) => (
          <article key={agenda.id} className="card flex gap-4 p-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-300">
              <CalendarClock size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-50">{agenda.cliente}</h2>
              <p className="mt-1 text-sm text-zinc-400">{agenda.servico}</p>
              <p className="mt-3 font-mono text-xs uppercase tracking-widest text-zinc-500">
                {agenda.data} as {agenda.horario}
              </p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
