import { ShoppingBag } from "lucide-react";
import { formatCurrency } from "../lib/formatters";

export default function ProductCard({ product }) {
  return (
    <article className="card overflow-hidden">
      <div className="aspect-square bg-gradient-to-br from-zinc-800 to-black p-4">
        <div className="flex h-full items-end rounded-lg border border-zinc-700 bg-zinc-950/70 p-4">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-orange-400">
            {product.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-zinc-50">{product.name}</h3>
        <p className="mt-1 truncate font-mono text-xs text-zinc-500">
          {product.specs}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <strong className="text-orange-400">{formatCurrency(product.price)}</strong>
          <button className="inline-flex items-center gap-2 rounded-md bg-orange-500 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-950 hover:bg-orange-400">
            <ShoppingBag size={14} />
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}
