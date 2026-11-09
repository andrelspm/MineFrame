"use client";
import { useEffect, useState } from "react";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "mineframe.contact@gmail.com";
const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";
const services = ["Edición para YouTube", "Shorts / TikTok / Reels", "Edición cinematográfica", "Showcase de mods", "Otro proyecto"];

export function ContactForm() {
  const [status, setStatus] = useState("");
  const [ok, setOk] = useState<boolean | null>(null);
  const [sending, setSending] = useState(false);
  const [service, setService] = useState(services[0]);

  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("servicio");
    if (wanted && services.includes(wanted)) setService(wanted);
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const data: Record<string, string> = { "form-name": "contacto" };
    values.forEach((v, k) => { data[k] = String(v); });
    if (data["bot-field"]) { form.reset(); setOk(true); setStatus("¡Mensaje enviado!"); return; }
    setSending(true); setStatus(""); setOk(null);
    try {
      // Copia en Netlify Forms (se guarda en el panel; no bloquea el envío).
      const netlify = fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      }).then((r) => r.ok).catch(() => false);
      let sent: boolean;
      if (web3formsKey) {
        // Envío del correo gratuito a través de Web3Forms.
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3formsKey,
            subject: "Nuevo mensaje de contacto en MINEFRAME: " + data.servicio,
            from_name: "Web MINEFRAME",
            name: data.nombre,
            email: data.email,
            servicio: data.servicio,
            message: data.mensaje,
          }),
        });
        const json = await res.json().catch(() => ({}));
        sent = res.ok && json.success !== false;
      } else {
        sent = await netlify;
      }
      if (!sent) throw new Error("fallo");
      form.reset(); setService(services[0]); setOk(true);
      setStatus("¡Mensaje enviado! Te responderé al correo que dejaste.");
    } catch {
      // Respaldo: si el envío falla (por ejemplo, en local), abre el correo del visitante.
      const subject = encodeURIComponent("Proyecto MINEFRAME: " + data.servicio);
      const body = encodeURIComponent("Nombre: " + data.nombre + "\nCorreo: " + data.email + "\nServicio: " + data.servicio + "\n\nProyecto:\n" + data.mensaje);
      window.location.href = "mailto:" + contactEmail + "?subject=" + subject + "&body=" + body;
      setOk(false);
      setStatus("No pude enviarlo directo, así que abrí tu aplicación de correo con el mensaje preparado.");
    } finally { setSending(false); }
  }

  return <form className="contact-form" name="contacto" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit}>
    <input type="hidden" name="form-name" value="contacto" />
    <input type="hidden" name="subject" value="Nuevo mensaje de contacto en MINEFRAME (%{submissionId})" />
    <p className="hp" aria-hidden="true"><label>No llenar<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
    <label>Tu nombre<input name="nombre" autoComplete="name" placeholder="¿Cómo te llamas?" required /></label>
    <label>Correo electrónico<input name="email" type="email" autoComplete="email" placeholder="tu@correo.com" required /></label>
    <label>¿Qué necesitas?<select name="servicio" value={service} onChange={(e) => setService(e.target.value)}>{services.map((s) => <option key={s}>{s}</option>)}</select></label>
    <label>Cuéntame sobre tu proyecto<textarea name="mensaje" rows={5} placeholder="Describe tu idea, fecha y material disponible..." required /></label>
    <button className="button button-light" type="submit" disabled={sending}>{sending ? "Enviando..." : "Enviar mensaje"} <span>↗</span></button>
    <p className={"form-status " + (ok === true ? "ok" : ok === false ? "err" : "")} role="status" aria-live="polite">{status}</p>
  </form>;
}
