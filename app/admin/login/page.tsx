 "use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { Logo } from "@/components/Logo";

export default function Login(){
  const [mode,setMode]=useState<"password"|"google">("password");
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const router=useRouter();
  async function signIn(e:React.FormEvent){e.preventDefault();setError("");if(!isSupabaseConfigured()){setError("Configura Supabase en .env.local antes de iniciar sesión.");return;}setBusy(true);const {data,error}=await getSupabase().auth.signInWithPassword({email,password});if(error){setError(error.message);setBusy(false);return;}const {data:profile}=await getSupabase().from("profiles").select("is_admin").eq("id",data.user.id).single();if(!profile?.is_admin){await getSupabase().auth.signOut();setError("Esta cuenta no tiene permisos de administración.");setBusy(false);return;}router.push("/admin");router.refresh();}
  async function google(){setError("");if(!isSupabaseConfigured()){setError("Configura Supabase en .env.local antes de iniciar sesión.");return;}const {error}=await getSupabase().auth.signInWithOAuth({provider:"google",options:{redirectTo:`${window.location.origin}/admin`}});if(error)setError(error.message);}
  return <main className="login-screen"><div className="login-card"><Logo/><div className="eyebrow">ÁREA PRIVADA</div><h1>Acceso de<br/>administración.</h1><p>Inicia sesión para gestionar el contenido de MINEFRAME.</p><form onSubmit={signIn} className="login-form"><label>Correo electrónico<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="admin@tudominio.com"/></label><label>Contraseña<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Tu contraseña"/></label><button className="button button-light full" disabled={busy}>{busy?"Ingresando...":"Ingresar con correo"}</button></form><div className="login-separator"><span/>o<span/></div><button className="button button-outline full" onClick={google}>Continuar con Google</button>{error&&<div className="form-error">{error}</div>}<Link href="/" className="back-link">← Volver al sitio</Link></div></main>;
}
