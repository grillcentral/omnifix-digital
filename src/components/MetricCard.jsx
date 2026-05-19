export default function MetricCard({ label, value, detail }) {
  return (
    <div className="card p-4">
      <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-zinc-50">{value}</p>
      {detail ? <p className="mt-1 text-sm text-zinc-500">{detail}</p> : null}
    </div>
  );
}
