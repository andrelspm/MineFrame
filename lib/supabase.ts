import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabase() {
  if (!url || !key) throw new Error("Falta configurar Supabase. Revisa .env.local.");
  return createClient(url, key);
}

export function isSupabaseConfigured() {
  return Boolean(url && key && !url.includes("TU-PROYECTO") && !key.includes("TU_CLAVE"));
}
