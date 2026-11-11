"use client";
import { useState } from "react";
import Link from "next/link";
import { useAdmin, useProjects } from "@/lib/useAdmin";
import { AdminShell } from "@/components/AdminShell";
import { ProjectList } from "@/components/ProjectList";
import { Skeleton } from "@/components/AdminUI";

export default function ProjectsAdmin() {
  const { email, error: authError } = useAdmin();
  const { items, setItems, loading, error } = useProjects(email !== null);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  if (authError) return <div className="admin-loading">{authError}</div>;
  if (email === null) return <div className="admin-loading"><Skeleton rows={2} /></div>;
  const term = q.trim().toLowerCase();
  const shown = items.filter(p => (filter === "all" || (filter === "published") === p.published) && (!term || p.title.toLowerCase().includes(term) || p.slug.includes(term) || p.category.toLowerCase().includes(term)));
  const count = (f: typeof filter) => items.filter(p => f === "all" || (f === "published") === p.published).length;
  return <AdminShell email={email}>
    <div className="admin-top"><div><div className="eyebrow">ADMIN / CONTENIDO</div><h1>Proyectos.</h1></div><Link className="button button-light" href="/admin/proyectos/nuevo">＋ Crear proyecto</Link></div>
    {error && <div className="notice">{error}</div>}
    <div className="toolbar"><input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre, categoría o URL..." aria-label="Buscar proyectos" />
      <div className="segmented" role="group" aria-label="Filtrar por estado">{([["all", "Todos"], ["published", "Publicados"], ["draft", "Borradores"]] as const).map(([v, l]) => <button key={v} className={filter === v ? "active" : ""} onClick={() => setFilter(v)}>{l} <small>{loading ? "" : count(v)}</small></button>)}</div></div>
    {loading ? <Skeleton rows={5} /> : <ProjectList items={shown} setItems={setItems} empty={items.length ? "Ningún proyecto coincide con tu búsqueda o filtro." : "Todavía no tienes proyectos. Crea el primero para empezar tu portafolio."} />}
  </AdminShell>;
}
