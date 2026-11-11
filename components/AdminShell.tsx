"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { getSupabase } from "@/lib/supabase";

const links = [["/admin", "▦", "Resumen"], ["/admin/proyectos", "▤", "Proyectos"], ["/admin/media", "▧", "Biblioteca multimedia"]] as const;

export function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  async function logout() { await getSupabase().auth.signOut(); router.push("/admin/login"); router.refresh(); }
  return <div className="admin-shell"><aside className="admin-sidebar"><Logo /><div className="admin-nav-label">ADMINISTRACIÓN</div>
    {links.map(([href, icon, label]) => <Link key={href} href={href} className={path === href ? "active" : ""} aria-current={path === href ? "page" : undefined}>{icon}　{label}</Link>)}
    <Link href="/">↗　Ver sitio público</Link>
    <div className="admin-side-bottom"><span>{email}</span><button onClick={logout}>Cerrar sesión ↗</button></div></aside>
    <main className="admin-main admin-enter">{children}</main></div>;
}
