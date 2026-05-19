export const queryKeys = {
  products: ["products"],
  featuredProducts: ["products", "featured"],
  testimonials: ["testimonials"],
  blogPosts: ["blog-posts"],
  blogPost: (id) => ["blog-posts", id],
  ordensServico: ["ordens-servico"],
  ordemServico: (id) => ["ordens-servico", id],
  leads: ["leads"],
  leadsByStage: (stage) => ["leads", "stage", stage],
  estoque: ["estoque"],
  estoqueCritico: ["estoque", "critico"],
  agendamentos: ["agendamentos"],
};
