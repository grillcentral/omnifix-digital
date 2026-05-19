import ProductCard from "../components/ProductCard.jsx";
import { useProducts } from "../hooks/useOmnifixData";
import EmptyState from "@/components/ui/EmptyState.jsx";
import ErrorState from "@/components/ui/ErrorState.jsx";
import LoadingState from "@/components/ui/LoadingState.jsx";

export default function Produtos() {
  const { data: products = [], isLoading, isError, error } = useProducts();
  const categories = ["Todos", ...new Set(products.map((item) => item.category))];

  return (
    <main className="page-shell">
      <p className="eyebrow">catalogo</p>
      <h1 className="mt-2 text-3xl font-black text-zinc-50">Nossos Produtos</h1>
      <p className="mt-2 text-zinc-400">
        Acessorios e eletronicos conectados ao catalogo operacional.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-semibold text-zinc-200 hover:border-orange-500"
          >
            {category}
          </button>
        ))}
      </div>
      {isLoading ? <LoadingState label="Carregando produtos..." /> : null}
      {isError ? <ErrorState message={error.message} /> : null}
      {!isLoading && !isError && products.length === 0 ? <EmptyState /> : null}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {!isLoading && !isError && products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
