import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let client: SupabaseClient | null = null;

// Un único cliente por entorno evita sesiones duplicadas y consultas de autenticación repetidas.
export function getSupabase() {
  if (!url || !key) throw new Error("Falta configurar Supabase. Revisa .env.local.");
  if (!client) client = createClient(url, key);
  return client;
}

export function isSupabaseConfigured() {
  return Boolean(url && key && !url.includes("TU-PROYECTO") && !key.includes("TU_CLAVE"));
}
