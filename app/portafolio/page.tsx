import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Reveal } from "@/components/Reveal";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Project } from "@/lib/types";

export default async function Portfolio() {
  let projects: Project[] = [];
  if (isSupabaseConfigured()) {
    try {
      const { data } = await getSupabase().from("projects").select("*").eq("published", true).order("created_at", { ascending: false });
      projects = (data || []) as Project[];
    } catch {
      projects = [];
    }
  }
  return <><Header/><main id="contenido" className="page-main container"><Reveal><div className="eyebrow">MINEFRAME / PROYECTOS</div><h1 className="page-title">TRABAJOS<span>.</span></h1><p className="page-lead">Una selección de proyectos, ideas y experimentos audiovisuales.</p></Reveal><ProjectGrid projects={projects}/></main><Footer/></>;
}