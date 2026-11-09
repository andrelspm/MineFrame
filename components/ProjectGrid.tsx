import Link from "next/link";
import type { Project } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (!projects.length) return <Reveal className="project-empty-reveal"><div className="empty-state"><div className="empty-icon" aria-hidden="true">▧</div><h3>Los proyectos aparecerán aquí</h3><p>Cuando conectes el panel, podrás subir tus trabajos y publicarlos en este espacio.</p></div></Reveal>;
  return <div className="project-grid">{projects.map((p, index) => <Reveal key={p.id} className="project-card-reveal" delay={(index % 6) * 55}><SpotlightCard className="project-card-shell"><Link href={"/proyecto/" + p.slug} className="project-card">
    <div className="project-thumb">
      {p.thumbnail_url || p.after_image_url ? <img src={(p.thumbnail_url || p.after_image_url) as string} alt={p.title} loading="lazy" /> : <div className="thumb-placeholder">MINEFRAME</div>}
      {(p.media_type === "video" || p.media_type === "before_after") && <span className="play-mark" aria-hidden="true">{p.media_type === "video" ? "▶" : "↔"}</span>}
      <span className="thumb-open" aria-hidden="true">VER PROYECTO ↗</span>
    </div>
    <div className="project-meta"><span>{p.category}</span><span>{p.media_type === "before_after" ? "ANTES / DESPUÉS" : p.media_type === "video" ? "VIDEO" : "IMAGEN"}</span></div><h3>{p.title}</h3><p>{p.description}</p>
  </Link></SpotlightCard></Reveal>)}</div>;
}