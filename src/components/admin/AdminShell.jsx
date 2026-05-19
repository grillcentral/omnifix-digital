export default function AdminShell({ title, description, children }) {
  return (
    <section className="space-y-5">
      <div>
        <p className="eyebrow">admin</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-50">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
