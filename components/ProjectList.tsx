"use client";
import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { getSupabase } from "@/lib/supabase";
import { projectFilePaths, removeUnreferencedFiles } from "@/lib/storage";
import { ConfirmModal, useToast } from "@/components/AdminUI";

export function ProjectList({ items, setItems, empty }: { items: Project[]; setItems: React.Dispatch<React.SetStateAction<Project[]>>; empty: string }) {
  const toast = useToast();
  const [target, setTarget] = useState<Project | null>(null);
  const [busy, setBusy] = useState(false);
  const [leaving, setLeaving] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  async function togglePublish(p: Project) {
    const next = !p.published;
    const { error } = await getSupabase().from("projects").update({ published: next }).eq("id", p.id);
    if (error) { toast("error", "No se pudo cambiar el estado: " + error.message); return; }
    setItems(list => list.map(x => x.id === p.id ? { ...x, published: next } : x));
    setFlash(p.id); setTimeout(() => setFlash(null), 900);
    toast("ok", next ? "“" + p.title + "” publicado. Ya aparece en la web pública." : "“" + p.title + "” pasó a borrador y dejó de ser público.");
  }

  async function confirmDelete() {
    if (!target) return;
    setBusy(true);
    const sb = getSupabase();
    const paths = projectFilePaths(target);
    const { error } = await sb.from("projects").delete().eq("id", target.id);
    if (error) { setBusy(false); toast("error", "No se pudo eliminar: " + error.message); return; }
    const files = await removeUnreferencedFiles(sb, paths); // solo archivos que ningún otro proyecto usa
    const id = target.id, title = target.title;
    setLeaving(id);
    setTimeout(() => { setItems(list => list.filter(x => x.id !== id)); setLeaving(null); }, 320);
    setTarget(null); setBusy(false);
    toast(files.error ? "info" : "ok", files.error ? "“" + title + "” eliminado, pero no se pudieron limpiar sus archivos (" + files.error + ")." : "“" + title + "” eliminado" + (files.removed ? " junto con " + files.removed + " archivo(s) sin uso." : "."));
  }

  if (!items.length) return <div className="empty-admin">{empty}</div>;
  return <>
    {items.map((p, i) => <div className={"admin-project-row" + (leaving === p.id ? " is-leaving" : "") + (flash === p.id ? " is-flash" : "")} style={{ "--i": Math.min(i, 10) } as React.CSSProperties} key={p.id}>
      <div className="admin-project-thumb">{p.thumbnail_url || p.after_image_url ? <img src={(p.thumbnail_url || p.after_image_url) as string} alt="" loading="lazy" /> : "▧"}</div>
      <div className="admin-project-info"><b>{p.title}</b><span><i className={"status-dot " + (p.published ? "on" : "off")} />{p.published ? "Publicado" : "Borrador"} · {p.category} · /{p.slug}</span></div>
      <div className="row-actions">
        {p.published && <Link href={"/proyecto/" + p.slug} target="_blank">Ver ↗</Link>}
        <Link href={"/admin/proyectos/" + p.id}>Editar</Link>
        <button onClick={() => togglePublish(p)}>{p.published ? "Despublicar" : "Publicar"}</button>
        <button className="danger" onClick={() => setTarget(p)}>Eliminar</button>
      </div>
    </div>)}
    <ConfirmModal open={Boolean(target)} title="¿Eliminar este proyecto?" confirmLabel="Eliminar definitivamente" busy={busy} onConfirm={confirmDelete} onCancel={() => setTarget(null)}>
      <p><b>{target?.title}</b></p>
      <p>La eliminación es <b>permanente</b>: se borra el proyecto de la base de datos y sus imágenes o videos del Storage, salvo los que use otro proyecto o estén en la Biblioteca multimedia. Si solo quieres ocultarlo, usa “Despublicar”.</p>
    </ConfirmModal>
  </>;
}
