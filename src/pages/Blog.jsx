import { Link } from "react-router-dom";
import { useBlogPosts } from "../hooks/useOmnifixData";
import EmptyState from "@/components/ui/EmptyState.jsx";
import ErrorState from "@/components/ui/ErrorState.jsx";
import LoadingState from "@/components/ui/LoadingState.jsx";

export default function Blog() {
  const { data: posts = [], isLoading, isError, error } = useBlogPosts();

  return (
    <main className="page-shell">
      <p className="eyebrow">conteudo tecnico</p>
      <h1 className="mt-2 text-3xl font-black text-zinc-50">Blog</h1>
      {isLoading ? <LoadingState label="Carregando artigos..." /> : null}
      {isError ? <ErrorState message={error.message} /> : null}
      {!isLoading && !isError && posts.length === 0 ? <EmptyState /> : null}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {!isLoading && !isError && posts.map((post) => (
          <article key={post.id} className="card p-5">
            <p className="font-mono text-xs uppercase tracking-widest text-orange-400">
              {post.category} - {post.date}
            </p>
            <h2 className="mt-3 text-xl font-bold text-zinc-50">{post.title}</h2>
            <p className="mt-2 text-sm text-zinc-400">{post.excerpt}</p>
            <Link
              to={`/blog/${post.id}`}
              className="mt-4 inline-block text-sm font-semibold text-orange-400"
            >
              Ler artigo
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
