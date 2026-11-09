"use client";
import { useState } from "react";

export function BeforeAfterSlider({ before, after, title }: { before: string; after: string; title: string }) {
  const [position, setPosition] = useState(50);
  return <div className="comparison-wrap">
    <div className="comparison-frame" style={{ "--compare-position": position + "%" } as React.CSSProperties}>
      <img className="comparison-after" src={after} alt={title + " — resultado final"} draggable={false} />
      <div className="comparison-before" style={{ clipPath: "inset(0 " + (100 - position) + "% 0 0)" }}><img src={before} alt={title + " — material original"} draggable={false} /></div>
      <span className="comparison-label comparison-label-before">ANTES</span><span className="comparison-label comparison-label-after">DESPUÉS</span>
      <span className="comparison-divider" aria-hidden="true"><b>↔</b></span>
      <input className="comparison-range" type="range" min="0" max="100" value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label="Comparar antes y después" aria-valuetext={"Antes " + (100 - position) + " por ciento, después " + position + " por ciento"} />
    </div>
    <p className="comparison-hint">Arrastra el control o usa las flechas del teclado para comparar.</p>
  </div>;
}