import { useQuery } from "@tanstack/react-query";
import { Activity, ShieldCheck, UserRound } from "lucide-react";
import ErrorState from "@/components/ui/ErrorState.jsx";
import LoadingState from "@/components/ui/LoadingState.jsx";
import { useAuth } from "@/hooks/useAuth.js";
import { appConfig } from "@/lib/appConfig.js";
import { checkAuthOnline, checkSupabaseOnline } from "@/lib/healthChecks.js";

export default function SystemStatus() {
  const { isAuthenticated, profile, user } = useAuth();
  const {
    data: health,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["system-status"],
    queryFn: async () => {
      const [supabase, auth] = await Promise.all([
        checkSupabaseOnline(),
        checkAuthOnline(),
      ]);
      return { supabase, auth };
    },
    refetchOnWindowFocus: false,
  });

  return (
    <main className="page-shell space-y-6">
      <div>
        <p className="eyebrow">sistema</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-50">Status tecnico</h1>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Verificacao operacional do ambiente publico, Supabase e sessao atual.
        </p>
      </div>

      {isLoading ? <LoadingState label="Verificando servicos..." /> : null}
      {isError ? <ErrorState message={error.message} /> : null}

      {!isLoading && !isError ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatusCard
            icon={Activity}
            label="Supabase"
            value={health.supabase.label}
            ok={health.supabase.ok}
          />
          <StatusCard
            icon={ShieldCheck}
            label="Auth"
            value={health.auth.label}
            ok={health.auth.ok}
          />
          <StatusCard
            icon={UserRound}
            label="Usuario"
            value={isAuthenticated ? profile?.nome ?? user?.email : "Nao autenticado"}
            ok={isAuthenticated}
          />
          <InfoCard label="Ambiente" value={appConfig.environment} />
          <InfoCard label="Versao" value={appConfig.version} />
          <InfoCard label="Build date" value={appConfig.buildDate} />
        </section>
      ) : null}
    </main>
  );
}

function StatusCard({ icon, label, value, ok }) {
  const StatusIcon = icon;

  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            ok ? "bg-orange-500/10 text-orange-300" : "bg-red-500/10 text-red-300"
          }`}
        >
          <StatusIcon size={20} />
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            {label}
          </p>
          <p className="mt-1 text-sm font-bold text-zinc-100">{value}</p>
        </div>
      </div>
    </article>
  );
}

function InfoCard({ label, value }) {
  return (
    <article className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
        {label}
      </p>
      <p className="mt-2 break-all text-sm font-bold text-zinc-100">{value}</p>
    </article>
  );
}
