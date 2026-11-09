"use client";
import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const fill = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const available = document.documentElement.scrollHeight - window.innerHeight;
        const progress = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
        const bar = fill.current;
        if (bar) {
          bar.style.transform = "scaleX(" + progress + ")";
          bar.parentElement?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
        }
        frame = 0;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div className="scroll-progress" role="progressbar" aria-label="Progreso de la página" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}><span ref={fill} /></div>;
}