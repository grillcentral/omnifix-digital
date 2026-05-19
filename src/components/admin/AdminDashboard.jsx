import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getOrdensServico } from "@/api/client.js";
import ErrorState from "@/components/ui/ErrorState.jsx";
import LoadingState from "@/components/ui/LoadingState.jsx";
import { formatCurrency } from "@/lib/formatters.js";
import { queryKeys } from "@/lib/queryKeys.js";
import MetricCard from "@/components/MetricCard.jsx";

export default function AdminDashboard() {
  const {
    data: ordens = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.ordensServico,
    queryFn: getOrdensServico,
  });

  const stats = useMemo(() => {
    const faturamento = ordens.reduce((total, ordem) => total + ordem.valor, 0);
    const abertas = ordens.filter((ordem) => !ordem.entregue).length;
    const entregues = ordens.filter((ordem) => ordem.entregue).length;
    const porTecnico = ordens.reduce((acc, ordem) => {
      acc[ordem.tecnico] = (acc[ordem.tecnico] ?? 0) + 1;
      return acc;
    }, {});

    return {
      faturamento,
      abertas,
      entregues,
      produtividade: Object.entries(porTecnico).map(([tecnico, total]) => ({
        tecnico,
        total,
      })),
    };
  }, [ordens]);

  return (
    <section className="space-y-6">
      <div>
        <p className="eyebrow">dashboard</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-50">
          Operacao de assistencia
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Visao SaaS premium para acompanhar OS, faturamento e produtividade.
        </p>
      </div>

      {isLoading ? <LoadingState label="Carregando dashboard..." /> : null}
      {isError ? <ErrorState message={error.message} /> : null}

      {!isLoading && !isError ? <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Faturamento"
          value={formatCurrency(stats.faturamento)}
          detail="base atual"
        />
        <MetricCard label="OS abertas" value={stats.abertas} detail="em andamento" />
        <MetricCard label="OS entregues" value={stats.entregues} detail="concluidas" />
        <MetricCard
          label="Produtividade"
          value={`${ordens.length} OS`}
          detail="periodo atual"
        />
      </div> : null}

      {!isLoading && !isError ? <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="card p-5">
          <h2 className="text-xl font-black text-zinc-50">
            Produtividade por tecnico
          </h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.produtividade}>
                <CartesianGrid stroke="#27272a" vertical={false} />
                <XAxis dataKey="tecnico" stroke="#a1a1aa" tickLine={false} />
                <YAxis stroke="#a1a1aa" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: 8,
                    color: "#fafafa",
                  }}
                />
                <Bar dataKey="total" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-xl font-black text-zinc-50">Fila de OS</h2>
          <div className="mt-5 space-y-3">
            {ordens.map((ordem) => (
              <article
                key={ordem.id}
                className="rounded-lg border border-zinc-800 bg-zinc-950 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-xs text-orange-400">{ordem.id}</p>
                  <span className="rounded-full bg-zinc-800 px-2 py-1 text-[10px] uppercase tracking-widest text-zinc-300">
                    {ordem.status}
                  </span>
                </div>
                <p className="mt-2 font-semibold text-zinc-50">{ordem.cliente}</p>
                <p className="text-sm text-zinc-500">{ordem.equipamento}</p>
              </article>
            ))}
          </div>
        </div>
      </div> : null}
    </section>
  );
}
