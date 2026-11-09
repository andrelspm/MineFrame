import type { Metadata } from "next";
import "./globals.css";
import { AmbientMotion } from "@/components/AmbientMotion";

export const metadata: Metadata = {
  title: { default: "MINEFRAME — Edición audiovisual para Minecraft", template: "%s | MINEFRAME" },
  description: "Portafolio de edición audiovisual especializado en contenido de Minecraft.",
  openGraph: {
    title: "MINEFRAME — Cada frame cuenta",
    description: "Edición audiovisual para creadores de Minecraft.",
    type: "website",
    locale: "es_PE",
    siteName: "MINEFRAME",
  },
  twitter: { card: "summary_large_image", title: "MINEFRAME — Cada frame cuenta", description: "Edición audiovisual para creadores de Minecraft." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><AmbientMotion />{children}<noscript><style>{".reveal{opacity:1;transform:none;filter:none}"}</style></noscript></body></html>;
}
