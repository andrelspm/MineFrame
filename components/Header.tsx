"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { ScrollProgress } from "./ScrollProgress";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/portafolio", label: "Portafolio" },
  { href: "/servicios", label: "Servicios" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return <>
    <ScrollProgress />
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="site-header"><div className="container nav-wrap">
      <Logo />
      <nav id="primary-navigation" className={"nav-links " + (menuOpen ? "is-open" : "")} aria-label="Navegación principal">
        {links.map((item) => <Link key={item.href} href={item.href} onClick={closeMenu} aria-current={pathname === item.href || (item.href === "/portafolio" && pathname.startsWith("/proyecto/")) ? "page" : undefined}>{item.label}</Link>)}
      </nav>
      <div className="header-actions">
        <button className="nav-toggle" type="button" aria-controls="primary-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span>{menuOpen ? "Cerrar" : "Menú"}</span><b aria-hidden="true">{menuOpen ? "×" : "☰"}</b></button>
        <Link className="button button-small button-light header-cta" href="/contacto" onClick={closeMenu}>Hablemos <span>↗</span></Link>
      </div>
    </div></header>
  </>;
}