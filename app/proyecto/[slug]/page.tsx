import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { getYouTubeEmbedUrl } from "@/lib/media";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isSupabaseConfigured()) notFound();
  let data: Project | null = null;
  try {
    const result = await getSupabase().from("projects").select("*").eq("slug", slug).eq("published", true).single();
    data = result.data as Project | null;
  } catch {
    notFound();
  }
  if (!data) notFound();
  const p = data;
  const youtubeEmbed = getYouTubeEmbedUrl(p.video_url);
  return <><Header/><main id="contenido" className="page-main container"><Link href="/portafolio" className="text-link">← Volver al portafolio</Link><Reveal><div className="eyebrow project-eyebrow">{p.category}</div><h1 className="page-title">{p.title}<span>.</span></h1><p className="page-lead">{p.description}</p>{(p.tags?.length||p.external_url)?<div className="detail-extra">{p.tags?.map(t=><span className="tag" key={t}>{t}</span>)}{p.external_url&&/^https?:\/\//.test(p.external_url)&&<a className="text-link" href={p.external_url} target="_blank" rel="noopener noreferrer">Ver enlace externo ↗</a>}</div>:null}</Reveal>
    {p.media_type === "before_after" && p.before_image_url && (p.after_image_url || p.thumbnail_url) ? <Reveal><BeforeAfterSlider before={p.before_image_url} after={(p.after_image_url || p.thumbnail_url) as string} title={p.title}/></Reveal> :
      <Reveal><div className="detail-media">{p.video_url ? youtubeEmbed ? <div className="video-embed"><iframe src={youtubeEmbed} title={"Video de " + p.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /></div> : <video src={p.video_url} controls playsInline preload="metadata" poster={p.thumbnail_url || undefined}/> : p.thumbnail_url ? <img src={p.thumbnail_url} alt={p.title}/> : <div className="empty-state">Este proyecto todavía no tiene una imagen o video.</div>}</div></Reveal>}
  </main><Footer/></>;
}