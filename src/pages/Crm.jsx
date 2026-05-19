import { Phone, TrendingUp } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState.jsx";
import ErrorState from "@/components/ui/ErrorState.jsx";
import LoadingState from "@/components/ui/LoadingState.jsx";
import { useLeads } from "@/hooks/useOmnifixData.js";
import { formatCurrency } from "@/lib/formatters.js";

const stages = [
  { id: "novo", label: "Novo" },
  { id: "orcamento", label: "Orcamento" },
  { id: "aprovado", label: "Aprovado" },
  { id: "fechado", label: "Fechado" },
  { id: "perdido", label: "Perdido" },
];

export default function Crm() {
  const { data: leads = [], isLoading, isError, error } = useLeads();

  const leadsByStage = stages.map((stage) => ({
    ...stage,
    items: leads.filter((lead) => lead.status === stage.id),
  }));

  return (
    <main className="page-shell">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">crm operacional</p>
          <h1 className="mt-2 text-4xl font-black text-zinc-50">
            Pipeline de leads
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Fluxo comercial para transformar atendimento em orcamento aprovado,
            OS e faturamento.
          </p>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <TrendingUp className="text-orange-400" size={22} />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
              oportunidades
            </p>
            <p className="text-xl font-black text-zinc-50">{leads.length}</p>
          </div>
        </div>
      </div>

      {isLoading ? <LoadingState label="Carregando pipeline..." /> : null}
      {isError ? <ErrorState message={error.message} /> : null}
      {!isLoading && !isError && leads.length === 0 ? <EmptyState /> : null}
      <section className="grid gap-4 xl:grid-cols-5">
        {!isLoading && !isError && leadsByStage.map((stage) => (
          <div
            key={stage.id}
            className="min-h-[420px] rounded-lg border border-zinc-800 bg-black/35 p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-300">
                {stage.label}
              </h2>
              <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs font-bold text-orange-300">
                {stage.items.length}
              </span>
            </div>

            <div className="space-y-3">
              {stage.items.map((lead) => (
                <article
                  key={lead.id}
                  className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition hover:border-orange-500/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-zinc-50">{lead.nome}</h3>
                      <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                        <Phone size={13} />
                        {lead.telefone}
                      </p>
                    </div>
                    <span className="rounded-full bg-zinc-950 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-orange-400">
                      {lead.tipo}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p className="text-zinc-300">{lead.dispositivo}</p>
                    <p className="line-clamp-2 text-zinc-500">{lead.problema}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      {lead.origem}
                    </span>
                    <strong className="text-sm text-orange-400">
                      {formatCurrency(lead.valor_estimado)}
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
