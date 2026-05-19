import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getBlogPosts } from "@/api/client.js";
import { queryKeys } from "@/lib/queryKeys.js";

export default function BlogPreview() {
  const { data: posts = [] } = useQuery({
    queryKey: queryKeys.blogPosts,
    queryFn: getBlogPosts,
  });

  return (
    <section className="page-shell">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">conteudo</p>
          <h2 className="mt-2 text-3xl font-black text-zinc-50">
            Guias e cuidados
          </h2>
        </div>
        <Link to="/blog" className="text-sm font-semibold text-orange-400">
          Ver blog
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {posts.slice(0, 3).map((post) => (
          <article
            key={post.id}
            className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900"
          >
            <img
              src={post.image}
              alt={post.title}
              className="h-44 w-full object-cover opacity-80"
            />
            <div className="p-5">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-orange-400">
                {post.category} / {post.readTime ?? post.read_time}
              </p>
              <h3 className="mt-3 text-lg font-bold text-zinc-50">{post.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                {post.excerpt}
              </p>
              <Link
                to={`/blog/${post.id}`}
                className="mt-4 inline-block text-sm font-semibold text-orange-400"
              >
                Ler artigo
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
