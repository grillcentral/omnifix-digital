import { supabase } from "@/lib/supabase.js";

export async function checkSupabaseOnline() {
  if (!supabase) {
    return {
      ok: false,
      label: "Supabase nao configurado",
    };
  }

  const { error } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  return {
    ok: !error,
    label: error ? error.message : "Supabase conectado",
  };
}

export async function checkAuthOnline() {
  if (!supabase) {
    return {
      ok: false,
      label: "Auth nao configurado",
    };
  }

  const { error } = await supabase.auth.getSession();

  return {
    ok: !error,
    label: error ? error.message : "Auth online",
  };
}
