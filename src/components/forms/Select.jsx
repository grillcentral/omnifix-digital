export default function Select({ label, error, options = [], className = "", ...props }) {
  return (
    <label className={`grid gap-2 text-sm text-zinc-400 ${className}`}>
      {label}
      <select
        {...props}
        className="rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none transition focus:border-orange-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-orange-300">{error}</span> : null}
    </label>
  );
}
