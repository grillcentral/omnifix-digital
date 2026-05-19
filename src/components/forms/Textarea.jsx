export default function Textarea({ label, error, className = "", ...props }) {
  return (
    <label className={`grid gap-2 text-sm text-zinc-400 ${className}`}>
      {label}
      <textarea
        {...props}
        className="min-h-28 rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-orange-500"
      />
      {error ? <span className="text-xs text-orange-300">{error}</span> : null}
    </label>
  );
}
