import { CalendarClock, Clock } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState.jsx";
import ErrorState from "@/components/ui/ErrorState.jsx";
import LoadingState from "@/components/ui/LoadingState.jsx";
import { useAgendamentos } from "@/hooks/useOmnifixData.js";

const statusStyles = {
  pendente: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  confirmado: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  cancelado: "border-red-500/30 bg-red-500/10 text-red-200",
};

function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date(`${date}T12:00:00`));
}

export default function Calendario() {
  const {
    data: agendamentos = [],
    isLoading,
    isError,
    error,
  } = useAgendamentos();

  const grouped = agendamentos.reduce((acc, item) => {
    acc[item.data] = acc[item.data] ? [...acc[item.data], item] : [item];
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort();

  return (
    <main className="page-shell">
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_260px]">
        <div>
          <p className="eyebrow">calendario</p>
          <h1 className="mt-2 text-4xl font-black text-zinc-50">
            Agenda operacional
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Visao simples por data para triagem, bancada, visitas e retirada de
            equipamentos.
          </p>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <CalendarClock className="text-orange-400" size={24} />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              agendamentos
            </p>
            <p className="text-2xl font-black text-zinc-50">
              {agendamentos.length}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? <LoadingState label="Carregando agenda..." /> : null}
      {isError ? <ErrorState message={error.message} /> : null}
      {!isLoading && !isError && dates.length === 0 ? <EmptyState /> : null}
      <section className="grid gap-4 lg:grid-cols-3">
        {!isLoading && !isError && dates.map((date) => (
          <div key={date} className="rounded-lg border border-zinc-800 bg-zinc-900">
            <div className="border-b border-zinc-800 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-orange-400">
                {date}
              </p>
              <h2 className="mt-1 text-lg font-black capitalize text-zinc-50">
                {formatDate(date)}
              </h2>
            </div>

            <div className="space-y-3 p-4">
              {grouped[date]
                .slice()
                .sort((a, b) => a.horario.localeCompare(b.horario))
                .map((item) => (
                  <article
                    key={item.id}
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 font-mono text-xs text-orange-400">
                          <Clock size={14} />
                          {item.horario}
                        </p>
                        <h3 className="mt-2 font-bold text-zinc-50">
                          {item.cliente}
                        </h3>
                      </div>
                      <span
                        className={`rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-widest ${
                          statusStyles[item.status] ?? statusStyles.pendente
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-zinc-300">{item.servico}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {item.dispositivo} / tecnico: {item.tecnico}
                    </p>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
