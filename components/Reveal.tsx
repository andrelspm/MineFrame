"use client";
import { useEffect, useRef, useState } from "react";

let sharedObserver: IntersectionObserver | null = null;
const revealCallbacks = new Map<Element, () => void>();

function subscribe(node: Element, onReveal: () => void) {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const callback = revealCallbacks.get(entry.target);
        revealCallbacks.delete(entry.target);
        sharedObserver?.unobserve(entry.target);
        callback?.();
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -3% 0px" });
  }
  revealCallbacks.set(node, onReveal);
  sharedObserver.observe(node);
  return () => {
    revealCallbacks.delete(node);
    sharedObserver?.unobserve(node);
  };
}

export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    return subscribe(node, () => setVisible(true));
  }, []);

  const revealStyle = { "--reveal-delay": String(delay) + "ms" } as React.CSSProperties;
  return <div ref={ref} className={"reveal " + (visible ? "is-visible " : "") + className} style={revealStyle}>{children}</div>;
}
