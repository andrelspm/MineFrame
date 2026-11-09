import Link from "next/link";
import { Header } from "@/components/Header";
import { HeroArtwork } from "@/components/HeroArtwork";
import { Footer } from "@/components/Footer";
import { ProjectGrid } from "@/components/ProjectGrid";
import { Reveal } from "@/components/Reveal";
import { AnimatedHeroTitle } from "@/components/AnimatedHeroTitle";
import { MagneticLink } from "@/components/MagneticLink";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Project } from "@/lib/types";

async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data } = await getSupabase().from("projects").select("*").eq("published", true).order("created_at", { ascending: false }).limit(6);
    return (data || []) as Project[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();
  return <><Header /><main id="contenido">
    <section className="hero container">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> ESTUDIO CREATIVO · MINECRAFT</div>
        <AnimatedHeroTitle />
        <p>Transformo tus grabaciones de Minecraft en contenido audiovisual con ritmo, identidad y personalidad.</p>
        <div className="hero-actions"><MagneticLink className="button button-light" href="/portafolio">Explorar trabajos <span>↗</span></MagneticLink><Link className="text-link" href="/contacto">Hablemos de tu proyecto <span>→</span></Link></div>
      </div>
      <Reveal className="hero-art-reveal" delay={120}><HeroArtwork /></Reveal>
      <div className="hero-bottom"><span>CREATIVIDAD EN MOVIMIENTO</span><span>PERÚ · TRABAJO REMOTO</span><span>DESLIZA PARA EXPLORAR ↓</span></div>
    </section>
    <div className="brand-marquee" aria-label="Edición para YouTube, Shorts y Minecraft">
      <div className="brand-marquee-row brand-marquee-row-solid" aria-hidden="true"><div className="brand-marquee-track"><span>EDICIÓN PARA YOUTUBE&nbsp;&nbsp;SHORTS Y TIKTOK&nbsp;&nbsp;MINECRAFT, CON OTRA MIRADA&nbsp;&nbsp;CADA FRAME CUENTA&nbsp;&nbsp;</span><span>EDICIÓN PARA YOUTUBE&nbsp;&nbsp;SHORTS Y TIKTOK&nbsp;&nbsp;MINECRAFT, CON OTRA MIRADA&nbsp;&nbsp;CADA FRAME CUENTA&nbsp;&nbsp;</span></div></div>
      <div className="brand-marquee-row brand-marquee-row-outline" aria-hidden="true"><div className="brand-marquee-track brand-marquee-track-reverse"><span>RITMO&nbsp;&nbsp;IDENTIDAD&nbsp;&nbsp;HISTORIAS QUE SE QUEDAN&nbsp;&nbsp;</span><span>RITMO&nbsp;&nbsp;IDENTIDAD&nbsp;&nbsp;HISTORIAS QUE SE QUEDAN&nbsp;&nbsp;</span></div></div>
    </div>
    <section className="section section-dark"><div className="container"><Reveal><div className="section-heading"><div><div className="eyebrow">SELECCIÓN DE TRABAJOS</div><h2>EL PORTAFOLIO<span>.</span></h2></div><Link className="text-link" href="/portafolio">Ver todos los proyectos ↗</Link></div></Reveal><ProjectGrid projects={projects}/></div></section>
    <section className="section container services-strip"><Reveal className="services-intro"><div className="eyebrow">QUÉ PUEDO HACER</div><h2>Tu contenido,<br/>con otra perspectiva.</h2></Reveal><Reveal className="service-list" delay={100}><Link href="/contacto?servicio=Edición%20para%20YouTube" aria-label="Consultar: Videos para YouTube"><b>01</b><span>Videos para YouTube</span><i>↗</i></Link><Link href="/contacto?servicio=Shorts%20%2F%20TikTok%20%2F%20Reels" aria-label="Consultar: Shorts, TikTok y Reels"><b>02</b><span>Shorts, TikTok y Reels</span><i>↗</i></Link><Link href="/contacto?servicio=Edición%20cinematográfica" aria-label="Consultar: Edición cinematográfica"><b>03</b><span>Edición cinematográfica</span><i>↗</i></Link><Link href="/contacto?servicio=Showcase%20de%20mods" aria-label="Consultar: Showcase de mods"><b>04</b><span>Showcase de mods</span><i>↗</i></Link></Reveal><Link href="/servicios" className="button button-outline">Conocer servicios <span>↗</span></Link></section>
    <section className="contact-band"><div className="container contact-band-inner"><Reveal><div><div className="eyebrow">¿TIENES UN PROYECTO?</div><h2>HAGAMOS QUE<br/>SE VEA INCREÍBLE.</h2></div></Reveal><MagneticLink className="button button-light" href="/contacto">Empezar una conversación ↗</MagneticLink></div></section>
  </main><Footer /></>;
}

