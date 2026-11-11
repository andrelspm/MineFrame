"use client";
import Link from "next/link";
import { useAdmin, useProjects } from "@/lib/useAdmin";
import { AdminShell } from "@/components/AdminShell";
import { ProjectList } from "@/components/ProjectList";
import { AnimatedNumber, Skeleton } from "@/components/AdminUI";

export default function Admin() {
  const { email, error: authError } = useAdmin();
  const { items, setItems, loading, error } = useProjects(email !== null);
  if (authError) return <div className="admin-loading">{authError}</div>;
  if (email === null) return <div className="admin-loading"><Skeleton rows={2} /></div>;
  const published = items.filter(p => p.published).length;
  return <AdminShell email={email}>
    <div className="admin-top"><div><div className="eyebrow">MINEFRAME / PANEL</div><h1>Resumen general.</h1></div><Link className="button button-light" href="/admin/proyectos/nuevo">＋ Nuevo proyecto</Link></div>
    {error && <div className="notice">{error}</div>}
    <div className="stats-grid">
      {[["PROYECTOS", items.length], ["PUBLICADOS", published], ["BORRADORES", items.length - published]].map(([label, n], i) => <div className="stat-card" style={{ "--i": i } as React.CSSProperties} key={label as string}><span>{label}</span><b>{loading ? "–" : <AnimatedNumber value={n as number} />}</b></div>)}
    </div>
    <div className="quick-actions"><Link href="/admin/proyectos/nuevo">＋ Crear proyecto</Link><Link href="/admin/proyectos">▤ Gestionar proyectos</Link><Link href="/admin/media">▧ Subir archivos</Link><Link href="/" target="_blank">↗ Ver web pública</Link></div>
    <section className="admin-section"><div className="admin-section-head"><h2>Últimos proyectos creados</h2><Link href="/admin/proyectos">Gestionar todos ↗</Link></div>
      {loading ? <Skeleton rows={3} /> : <ProjectList items={items.slice(0, 5)} setItems={setItems} empty="Todavía no tienes proyectos. Crea el primero para empezar tu portafolio." />}
    </section>
  </AdminShell>;
}
