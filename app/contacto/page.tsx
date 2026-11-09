import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ContactForm } from "@/components/ContactForm";

export default function Contact(){return <><Header/><main id="contenido" className="page-main container"><Reveal><div className="eyebrow">MINEFRAME / CONTACTO</div><h1 className="page-title">HABLEMOS<span>.</span></h1><p className="page-lead">Cuéntame qué contenido estás creando y qué necesitas editar.</p></Reveal><div className="contact-layout"><Reveal><div><h2>Construyamos algo<br/>que valga la pena ver.</h2><p>Cuéntame tu idea, el formato que necesitas y cuándo te gustaría publicarlo. Te respondo al correo que dejes en el formulario.</p><p className="muted">También puedes escribirme a mineframe.contact@gmail.com</p></div></Reveal><Reveal delay={100}><ContactForm /></Reveal></div></main><Footer/></>;}