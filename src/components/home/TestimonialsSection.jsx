import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { getTestimonials } from "@/api/client.js";
import { queryKeys } from "@/lib/queryKeys.js";

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const { data: testimonials = [] } = useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: getTestimonials,
  });
  const current = testimonials[active] ?? testimonials[0];

  const goTo = (direction) => {
    if (!testimonials.length) return;
    setActive((index) =>
      direction === "next"
        ? (index + 1) % testimonials.length
        : (index - 1 + testimonials.length) % testimonials.length,
    );
  };

  if (!current) return null;

  return (
    <section className="page-shell">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <div>
          <p className="eyebrow">depoimentos</p>
          <h2 className="mt-2 text-3xl font-black text-zinc-50">
            Quem trouxe, voltou.
          </h2>
          <div className="mt-5 flex gap-2">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-700 text-zinc-200 hover:border-orange-500"
              onClick={() => goTo("prev")}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-700 text-zinc-200 hover:border-orange-500"
              onClick={() => goTo("next")}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <article className="rounded-lg border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6">
          <div className="flex gap-1 text-orange-400">
            {Array.from({ length: current.rating }).map((_, index) => (
              <Star key={index} size={18} fill="currentColor" />
            ))}
          </div>
          <p className="mt-5 text-xl leading-relaxed text-zinc-100">
            "{current.text}"
          </p>
          <div className="mt-6">
            <p className="font-bold text-zinc-50">{current.name}</p>
            <p className="text-sm text-zinc-500">{current.role}</p>
          </div>
        </article>
      </div>
    </section>
  );
}
