"use client";
// Transición suave entre páginas (solo opacidad/posición, sin saltos de diseño).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
