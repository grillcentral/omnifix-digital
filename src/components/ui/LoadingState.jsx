export default function LoadingState({ label = "Carregando dados..." }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 animate-pulse rounded-full bg-orange-400" />
        <p className="text-sm font-semibold text-zinc-300">{label}</p>
      </div>
    </div>
  );
}
