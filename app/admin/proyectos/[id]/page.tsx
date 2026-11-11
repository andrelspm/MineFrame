"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectEditor } from "@/components/ProjectEditor";
import { Skeleton } from "@/components/AdminUI";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Project } from "@/lib/types";

export default function EditProject() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
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
        const { data } = await supabase.from("projects").select("*").eq("id", params.id).single();
        if (!active) return;
        setProject(data as Project | null);
        setAuthorized(true);
        setLoading(false);
      } catch {
        router.replace("/admin/login");
      }
    }
    load();
    return () => { active = false; };
  }, [params.id, router]);

  if (!authorized || loading) return <div className="admin-loading"><Skeleton rows={2} /></div>;
  return project ? <ProjectEditor project={project} /> : <div className="admin-loading">No se encontró el proyecto.</div>;
}
