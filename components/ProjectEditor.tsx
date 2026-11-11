"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { projectFilePaths, removeUnreferencedFiles } from "@/lib/storage";
import { useToast } from "@/components/AdminUI";
import type { Project } from "@/lib/types";

const maxUploadBytes = 500 * 1024 * 1024;
const allowed = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"];
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const isUrl = (s: string) => { try { return /^https?:$/.test(new URL(s).protocol); } catch { return false; } };

function Preview({ file, url, video }: { file: File | null; url: string; video?: boolean }) {
  const local = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => () => { if (local) URL.revokeObjectURL(local); }, [local]);
  const src = local || url;
  if (!src) return null;
  const isVid = video && (file ? file.type.startsWith("video/") : /\.(mp4|webm)(\?|$)/i.test(src));
  if (video && !isVid) return null;
  return <div className="preview">{isVid ? <video src={src} muted controls preload="metadata" /> : <img src={src} alt="Vista previa" />}</div>;
}

export function ProjectEditor({ project }: { project?: Project }) {
  const router = useRouter();
  const toast = useToast();
  const [title, setTitle] = useState(project?.title || "");
  const [slug, setSlug] = useState(project?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [category, setCategory] = useState(project?.category || "Gameplay");
  const [description, setDescription] = useState(project?.description || "");
  const [tags, setTags] = useState((project?.tags || []).join(", "));
  const [externalUrl, setExternalUrl] = useState(project?.external_url || "");
  const [mediaType, setMediaType] = useState<Project["media_type"]>(project?.media_type || "image");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnail_url || "");
  const [videoUrl, setVideoUrl] = useState(project?.video_url || "");
  const [beforeUrl, setBeforeUrl] = useState(project?.before_image_url || "");
  const [afterUrl, setAfterUrl] = useState(project?.after_image_url || "");
  const [busy, setBusy] = useState<"" | "draft" | "publish">("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function onTitle(v: string) { setTitle(v); if (!slugTouched) setSlug(slugify(v)); }

  async function upload(file: File, folder: string) {
    if (file.size > maxUploadBytes) throw new Error("“" + file.name + "” supera los 500 MB.");
    if (!allowed.includes(file.type)) throw new Error("Formato no permitido en “" + file.name + "”. Usa JPG, PNG, WEBP, MP4 o WEBM.");
    const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = folder + "/" + crypto.randomUUID() + "." + ext;
    const sb = getSupabase();
    const { error } = await sb.storage.from("portfolio-media").upload(path, file, { upsert: false, contentType: file.type });
    if (error) throw new Error("No se pudo subir “" + file.name + "”: " + error.message);
    return sb.storage.from("portfolio-media").getPublicUrl(path).data.publicUrl;
  }

  function validate(publish: boolean) {
    const e: Record<string, string> = {};
    if (title.trim().length < 2) e.title = "Escribe un nombre de al menos 2 caracteres.";
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) e.slug = "Usa solo minúsculas, números y guiones (ej. mi-proyecto).";
    if (externalUrl && !isUrl(externalUrl)) e.externalUrl = "El enlace debe empezar con http:// o https://";
    for (const [k, v] of [["thumbnailUrl", thumbnailUrl], ["videoUrl", videoUrl], ["beforeUrl", beforeUrl], ["afterUrl", afterUrl]]) if (v && !isUrl(v)) e[k] = "La URL no es válida.";
    if (mediaType === "before_after" && ((!beforeFile && !beforeUrl) || (!afterFile && !afterUrl))) e.media = "Agrega las dos imágenes (antes y después).";
    if (publish && !thumbnail && !thumbnailUrl && !video && !videoUrl && !afterFile && !afterUrl) e.media = "Para publicar agrega al menos una imagen o un video.";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  }

  async function save(publish: boolean) {
    setError("");
    if (!validate(publish)) { setError("Revisa los campos marcados."); return; }
    setBusy(publish ? "publish" : "draft");
    const sb = getSupabase();
    try {
      let q = sb.from("projects").select("id").eq("slug", slug).limit(1);
      if (project) q = q.neq("id", project.id);
      const { data: dup, error: dupErr } = await q;
      if (dupErr) throw dupErr;
      if (dup?.length) { setFieldErrors(f => ({ ...f, slug: "Ya existe otro proyecto con esta URL. Cámbiala." })); throw new Error("La URL (slug) ya está en uso."); }
      let image = thumbnailUrl, videoLink = videoUrl, before = beforeUrl, after = afterUrl;
      if (thumbnail) image = await upload(thumbnail, "thumbnails");
      if (video) videoLink = await upload(video, "videos");
      if (beforeFile) before = await upload(beforeFile, "comparisons");
      if (afterFile) after = await upload(afterFile, "comparisons");
      if (!image && mediaType === "before_after") image = after;
      const tagList = Array.from(new Set(tags.split(",").map(t => t.trim()).filter(Boolean)));
      const payload: Record<string, unknown> = { title: title.trim(), slug, category, description: description.trim(), media_type: mediaType, published: publish, thumbnail_url: image || null, video_url: videoLink || null, before_image_url: before || null, after_image_url: after || null };
      // Solo se envían si se usan o ya existen, para no romper si la migración 001 aún no se aplicó.
      if (tagList.length || (project && "tags" in project)) payload.tags = tagList;
      if (externalUrl || (project && "external_url" in project)) payload.external_url = externalUrl || null;
      const res = project ? await sb.from("projects").update(payload).eq("id", project.id) : await sb.from("projects").insert(payload);
      if (res.error) throw res.error;
      if (project) await removeUnreferencedFiles(sb, projectFilePaths(project)); // limpia archivos reemplazados
      toast("ok", publish ? "Proyecto publicado." : "Borrador guardado.");
      router.push("/admin/proyectos"); router.refresh();
    } catch (e) {
      const msg = e instanceof Error ? e.message : (e as { message?: string })?.message || "No se pudo guardar el proyecto.";
      const hint = /column .*(tags|external_url)|schema cache/i.test(msg) ? " Aplica primero la migración supabase/migrations/001_tags_external_url.sql." : /duplicate key|23505/i.test(msg) ? " Esa URL ya existe." : "";
      setError(msg + hint); // el formulario conserva todo lo escrito
      toast("error", "No se guardó. " + msg + hint);
    } finally { setBusy(""); }
  }

  const err = (k: string) => fieldErrors[k] ? <small className="field-error" role="alert">{fieldErrors[k]}</small> : null;
  const wasPublished = Boolean(project?.published);
  return <main className="admin-main standalone-admin admin-enter"><div className="admin-top"><div><div className="eyebrow">ADMIN / PROYECTOS</div><h1>{project ? "Editar proyecto" : "Nuevo proyecto"}.</h1></div><Link href="/admin/proyectos" className="text-link">← Volver a proyectos</Link></div>
    <form className="editor-form" onSubmit={e => { e.preventDefault(); save(wasPublished); }} noValidate>
      <label>Nombre del proyecto<input value={title} onChange={e => onTitle(e.target.value)} placeholder="Ej. Supervivencia extrema" />{err("title")}</label>
      <label>URL del proyecto (slug)<input value={slug} onChange={e => { setSlugTouched(true); setSlug(slugify(e.target.value)); }} placeholder="supervivencia-extrema" /><small>Se mostrará como /proyecto/{slug || "..."}</small>{err("slug")}</label>
      <label>Categoría<select value={category} onChange={e => setCategory(e.target.value)}>{["Gameplay", "Funny Moments", "Cinematográfico", "Showcase de mods", "Shorts y TikTok", "Otro"].map(c => <option key={c}>{c}</option>)}</select></label>
      <label>Descripción<textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe brevemente el trabajo..." /></label>
      <label>Etiquetas (separadas por comas)<input value={tags} onChange={e => setTags(e.target.value)} placeholder="minecraft, cinematográfico, mods" /></label>
      <label>Enlace externo (opcional)<input type="url" value={externalUrl} onChange={e => setExternalUrl(e.target.value)} placeholder="https://youtube.com/..." />{err("externalUrl")}</label>
      <label>Tipo de proyecto<select value={mediaType} onChange={e => setMediaType(e.target.value as Project["media_type"])}><option value="image">Imagen / miniatura</option><option value="video">Video</option><option value="before_after">Comparación antes y después</option></select></label>
      <label>Miniatura (JPG, PNG o WEBP)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setThumbnail(e.target.files?.[0] || null)} /></label>
      <label>URL de miniatura<input type="url" value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} placeholder="https://..." />{err("thumbnailUrl")}</label>
      <Preview file={thumbnail} url={thumbnailUrl} />
      <label>Video (MP4, WEBM o enlace de YouTube)<input type="file" accept="video/mp4,video/webm" onChange={e => setVideo(e.target.files?.[0] || null)} /></label>
      <label>URL del video<input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://youtu.be/... o https://.../video.mp4" />{err("videoUrl")}</label>
      <Preview file={video} url={videoUrl} video />
      {mediaType === "before_after" && <fieldset className="comparison-fields"><legend>Comparación</legend><p>Sube el material original y el resultado final. El público podrá mover el control para compararlos.</p>
        <label>Imagen ANTES<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setBeforeFile(e.target.files?.[0] || null)} /></label><label>URL de imagen ANTES<input type="url" value={beforeUrl} onChange={e => setBeforeUrl(e.target.value)} placeholder="https://..." /></label><Preview file={beforeFile} url={beforeUrl} />
        <label>Imagen DESPUÉS<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setAfterFile(e.target.files?.[0] || null)} /></label><label>URL de imagen DESPUÉS<input type="url" value={afterUrl} onChange={e => setAfterUrl(e.target.value)} placeholder="https://..." /></label><Preview file={afterFile} url={afterUrl} /></fieldset>}
      {err("media")}
      {error && <div className="form-error" role="alert">{error}</div>}
      <div className="editor-actions">
        <button type="button" className="button button-outline" disabled={Boolean(busy)} onClick={() => save(false)}>{busy === "draft" ? "Guardando..." : wasPublished ? "Despublicar y guardar" : "Guardar borrador"}</button>
        <button type="button" className="button button-light" disabled={Boolean(busy)} onClick={() => save(true)}>{busy === "publish" ? "Publicando..." : wasPublished ? "Guardar cambios" : "Publicar"}</button>
      </div>
      <p className="editor-note">Los borradores nunca aparecen en la web pública. Puedes reutilizar archivos de la Biblioteca multimedia copiando su URL.</p>
    </form></main>;
}
