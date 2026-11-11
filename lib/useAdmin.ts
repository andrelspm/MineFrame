"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Project } from "@/lib/types";

/** Protege las pantallas del panel: exige sesión y profiles.is_admin = true (RLS lo vuelve a exigir en el servidor). */
export function useAdmin() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    (async () => {
      if (!isSupabaseConfigured()) { setError("Configura Supabase en .env.local (ver README)."); return; }
      const sb = getSupabase();
      const { data: { user } } = await sb.auth.getUser();
      if (!user) { router.replace("/admin/login"); return; }
      const { data: p } = await sb.from("profiles").select("is_admin").eq("id", user.id).single();
      if (!p?.is_admin) { await sb.auth.signOut(); router.replace("/admin/login"); return; }
      if (live) setEmail(user.email || "");
    })();
    return () => { live = false; };
  }, [router]);
  return { email, error };
}

export function useProjects(enabled: boolean) {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    const { data, error } = await getSupabase().from("projects").select("*").order("created_at", { ascending: false });
    if (error) setError(error.message); else setError("");
    setItems((data || []) as Project[]);
    setLoading(false);
  }, []);
  useEffect(() => { if (enabled) reload(); }, [enabled, reload]);
  return { items, setItems, loading, error, reload };
}
