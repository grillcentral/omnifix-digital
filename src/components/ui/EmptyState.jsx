import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "Nenhum registro encontrado",
  description = "Quando houver dados, eles aparecem aqui.",
}) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-700 bg-zinc-900/60 p-8 text-center">
      <Inbox className="mx-auto text-orange-400" size={28} />
      <h2 className="mt-4 text-lg font-black text-zinc-50">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">{description}</p>
    </div>
  );
}
