"use client";

import { useEffect, useRef } from "react";

export function HeroArtwork() {
  const frame = useRef<HTMLDivElement>(null);
  const animationFrame = useRef<number | null>(null);

  function move(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(hover: hover) and (pointer: fine)").matches === false) return;
    const node = frame.current;
    if (!node) return;

    const bounds = node.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    node.style.setProperty("--art-x", (x * 100) + "%");
    node.style.setProperty("--art-y", (y * 100) + "%");

    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    animationFrame.current = requestAnimationFrame(() => {
      node.style.transform = "perspective(900px) rotateX(" + ((0.5 - y) * 7) + "deg) rotateY(" + ((x - 0.5) * 7) + "deg) translate3d(0,-2px,0)";
      animationFrame.current = null;
    });
  }

  function reset() {
    const node = frame.current;
    if (!node) return;
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
    animationFrame.current = requestAnimationFrame(() => {
      node.style.transform = "";
      node.style.setProperty("--art-x", "50%");
      node.style.setProperty("--art-y", "50%");
      animationFrame.current = null;
    });
  }

  useEffect(() => () => {
    if (animationFrame.current !== null) cancelAnimationFrame(animationFrame.current);
  }, []);

  return (
    <div className="hero-art">
      <div
        ref={frame}
        className="hero-art-frame"
        onPointerMove={move}
        onPointerLeave={reset}
      >
        <img src="/brand/mineframe-symbol.png" alt="Símbolo original de MINEFRAME" />
        
      </div>
      <div className="hero-index">EDICIÓN<br />AUDIOVISUAL<br />PARA MINECRAFT</div>
    </div>
  );
}



