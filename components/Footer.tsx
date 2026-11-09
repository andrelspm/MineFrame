import { Logo } from "./Logo";
export function Footer() {
  return <footer className="footer"><div className="container footer-inner"><Logo /><p>Edición audiovisual para creadores de Minecraft.</p><span>© {new Date().getFullYear()} MINEFRAME</span></div></footer>;
}
