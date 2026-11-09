"use client";
import { useRef } from "react";
import Link from "next/link";

export function MagneticLink({ href, className = "", children }: { href: string; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const frame = useRef<number | null>(null);
  const point = useRef<{ x: number; y: number } | null>(null);

  function move(event: React.PointerEvent<HTMLAnchorElement>) {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    point.current = {
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 8,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 8,
    };
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      const node = ref.current;
      if (node && point.current) {
        node.style.setProperty("--magnetic-x", point.current.x + "px");
        node.style.setProperty("--magnetic-y", point.current.y + "px");
      }
      frame.current = null;
    });
  }

  function reset() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    point.current = null;
    ref.current?.style.setProperty("--magnetic-x", "0px");
    ref.current?.style.setProperty("--magnetic-y", "0px");
  }

  return <Link ref={ref} href={href} className={"magnetic-link " + className} onPointerMove={move} onPointerLeave={reset}>{children}</Link>;
}