"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type ToastItem = { id: number; type: "ok" | "error" | "info"; text: string };
const ToastCtx = createContext<(type: ToastItem["type"], text: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const push = useCallback((type: ToastItem["type"], text: string) => {
    const id = Date.now() + Math.random();
    setItems(list => [...list.slice(-3), { id, type, text }]);
    setTimeout(() => setItems(list => list.filter(t => t.id !== id)), type === "error" ? 6500 : 3800);
  }, []);
  return <ToastCtx.Provider value={push}>{children}<div className="toast-stack" aria-live="polite">{items.map(t => <div key={t.id} className={"toast toast-" + t.type} role={t.type === "error" ? "alert" : "status"}><i aria-hidden="true">{t.type === "ok" ? "✓" : t.type === "error" ? "!" : "i"}</i><span>{t.text}</span></div>)}</div></ToastCtx.Provider>;
}

export function AnimatedNumber({ value }: { value: number }) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(value); from.current = value; return; }
    const start = performance.now(), a = from.current, dur = 900;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      setShown(Math.round(a + (value - a) * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick); else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{shown}</>;
}

export function Skeleton({ rows = 4 }: { rows?: number }) {
  return <div className="skeleton-list" aria-busy="true" aria-label="Cargando">{Array.from({ length: rows }).map((_, i) => <div className="skeleton-row" key={i}><span className="sk sk-thumb" /><span className="sk-lines"><span className="sk sk-line" /><span className="sk sk-line sk-short" /></span></div>)}</div>;
}

export function ConfirmModal({ open, title, children, confirmLabel, busy, onConfirm, onCancel }: { open: boolean; title: string; children: React.ReactNode; confirmLabel: string; busy?: boolean; onConfirm: () => void; onCancel: () => void }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape" && !busy) onCancel(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, busy, onCancel]);
  if (!open) return null;
  return <div className="modal-backdrop" onClick={() => !busy && onCancel()}><div className="modal" role="alertdialog" aria-modal="true" aria-labelledby="modal-title" onClick={e => e.stopPropagation()}><h2 id="modal-title">{title}</h2><div className="modal-body">{children}</div><div className="modal-actions"><button className="button button-outline button-small" onClick={onCancel} disabled={busy} autoFocus>Cancelar</button><button className="button button-danger button-small" onClick={onConfirm} disabled={busy}>{busy ? "Eliminando..." : confirmLabel}</button></div></div></div>;
}
