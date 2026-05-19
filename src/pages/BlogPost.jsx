import { Link, useParams } from "react-router-dom";
import ErrorState from "@/components/ui/ErrorState.jsx";
import LoadingState from "@/components/ui/LoadingState.jsx";
import { useBlogPost } from "@/hooks/useOmnifixData.js";

export default function BlogPost() {
  const { id } = useParams();
  const { data: post, isLoading, isError, error } = useBlogPost(id);

  if (isLoading) {
    return (
      <main className="page-shell">
        <LoadingState label="Carregando artigo..." />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="page-shell">
        <ErrorState message={error.message} />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="page-shell">
        <p className="eyebrow">blog</p>
        <h1 className="mt-2 text-3xl font-black text-zinc-50">Artigo nao encontrado</h1>
        <Link className="mt-4 inline-block text-orange-400" to="/blog">
          Voltar para o blog
        </Link>
      </main>
    );
  }

  return (
    <main className="page-shell max-w-3xl">
      <p className="eyebrow">{post.category}</p>
      <h1 className="mt-2 text-4xl font-black text-zinc-50">{post.title}</h1>
      <p className="mt-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
        {post.date}
      </p>
      <p className="mt-8 text-lg leading-relaxed text-zinc-300">{post.content}</p>
    </main>
  );
}
