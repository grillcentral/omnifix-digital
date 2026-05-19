import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { getFeaturedProducts } from "@/api/client.js";
import { formatCurrency } from "@/lib/formatters.js";
import { queryKeys } from "@/lib/queryKeys.js";

const MotionArticle = motion.article;

export default function FeaturedProducts() {
  const { data: products = [] } = useQuery({
    queryKey: queryKeys.featuredProducts,
    queryFn: getFeaturedProducts,
  });

  return (
    <section className="page-shell">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">catalogo</p>
          <h2 className="mt-2 text-3xl font-black text-zinc-50">
            Produtos em destaque
          </h2>
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          {products.length} itens
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <MotionArticle
            key={product.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: index * 0.04 }}
            className="group overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-sm shadow-black/30 transition-all hover:-translate-y-1 hover:border-orange-500/60 hover:shadow-orange-500/10"
          >
            <div className="relative aspect-square overflow-hidden bg-zinc-950">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-95"
              />
              <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-950">
                {product.category}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-zinc-50">{product.name}</h3>
              <p className="mt-1 truncate font-mono text-xs text-zinc-500">
                {product.specs}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <strong className="text-orange-400">
                  {formatCurrency(product.price)}
                </strong>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-orange-500 text-zinc-950 transition hover:bg-orange-400">
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          </MotionArticle>
        ))}
      </div>
    </section>
  );
}
