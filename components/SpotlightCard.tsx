"use client";
import { useEffect, useRef } from "react";

export function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const point = useRef<{ x: number; y: number } | null>(null);

  function move(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    point.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      const node = ref.current;
      if (node && point.current) {
        node.style.setProperty("--spot-x", point.current.x + "px");
        node.style.setProperty("--spot-y", point.current.y + "px");
      }
      frame.current = null;
    });
  }

  function leave() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    point.current = null;
    ref.current?.style.setProperty("--spot-x", "50%");
    ref.current?.style.setProperty("--spot-y", "50%");
  }

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  return <div ref={ref} className={"spotlight-card " + className} onPointerMove={move} onPointerLeave={leave}>{children}</div>;
}