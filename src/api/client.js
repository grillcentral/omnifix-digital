import { requireSupabase } from "@/lib/supabase.js";

const id = (prefix) => `${prefix}-${Date.now()}`;

async function run(query) {
  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

function table(name) {
  return requireSupabase().from(name);
}

export function getProducts() {
  return run(table("products").select("*").order("name", { ascending: true }));
}

export function getFeaturedProducts() {
  return run(
    table("products")
      .select("*")
      .eq("featured", true)
      .order("name", { ascending: true }),
  );
}

export function getTestimonials() {
  return run(table("testimonials").select("*").order("name", { ascending: true }));
}

export function getBlogPosts() {
  return run(table("blog_posts").select("*").order("date", { ascending: false }));
}

export function getBlogPostById(postId) {
  return run(table("blog_posts").select("*").eq("id", postId).maybeSingle());
}

export function getOrdensServico() {
  return run(
    table("ordens_servico").select("*").order("data_entrada", { ascending: false }),
  );
}

export function getOrdemServicoById(ordemId) {
  return run(
    table("ordens_servico")
      .select("*")
      .or(`id.eq.${ordemId},numero.eq.${ordemId}`)
      .maybeSingle(),
  );
}

export function createOrdemServico(payload) {
  const record = {
    id: payload.id ?? id("os"),
    ...payload,
  };

  return run(table("ordens_servico").insert(record).select("*").single());
}

export function updateOrdemServico(ordemId, payload) {
  return run(
    table("ordens_servico").update(payload).eq("id", ordemId).select("*").single(),
  );
}

export function getLeads() {
  return run(table("leads").select("*").order("created_at", { ascending: false }));
}

export function getLeadsByStage(stage) {
  return run(
    table("leads")
      .select("*")
      .eq("estagio", stage)
      .order("created_at", { ascending: false }),
  );
}

export function createLead(payload) {
  return run(
    table("leads")
      .insert({
        id: payload.id ?? id("lead"),
        ...payload,
      })
      .select("*")
      .single(),
  );
}

export function updateLead(leadId, payload) {
  return run(table("leads").update(payload).eq("id", leadId).select("*").single());
}

export function getEstoque() {
  return run(table("estoque").select("*").order("descricao", { ascending: true }));
}

export async function getEstoqueCritico() {
  const items = await getEstoque();

  return items.filter((item) => item.quantidade_atual <= item.quantidade_minima);
}

export function createEstoqueItem(payload) {
  return run(
    table("estoque")
      .insert({
        id: payload.id ?? id("estoque"),
        ...payload,
      })
      .select("*")
      .single(),
  );
}

export function updateEstoqueItem(itemId, payload) {
  return run(table("estoque").update(payload).eq("id", itemId).select("*").single());
}

export function getAgendamentos() {
  return run(table("agendamentos").select("*").order("data", { ascending: true }));
}
