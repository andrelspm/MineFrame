"use client";

import { useEffect } from "react";

export function AmbientMotion() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const body = document.body;
    let frame = 0;
    let x = 0;
    let y = 0;

    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        body.style.setProperty("--pointer-x", x + "px");
        body.style.setProperty("--pointer-y", y + "px");
        body.style.setProperty("--pointer-glow", "1");
        frame = 0;
      });
    };

    const hide = () => body.style.setProperty("--pointer-glow", "0");
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("pointerleave", hide);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
      body.style.removeProperty("--pointer-glow");
      body.style.removeProperty("--pointer-x");
      body.style.removeProperty("--pointer-y");
    };
  }, []);

  return null;
}
