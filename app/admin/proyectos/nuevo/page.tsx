"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectEditor } from "@/components/ProjectEditor";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export default function NewProject() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    async function checkAccess() {
      if (!isSupabaseConfigured()) {
        router.replace("/admin/login");
        return;
      }
      try {
        const supabase = getSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace("/admin/login");
          return;
        }
        const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
        if (!profile?.is_admin) {
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }
        if (active) setAuthorized(true);
      } catch {
        router.replace("/admin/login");
      }
    }
    checkAccess();
    return () => { active = false; };
  }, [router]);

  if (!authorized) return <div className="admin-loading">Verificando acceso...</div>;
  return <ProjectEditor />;
}
