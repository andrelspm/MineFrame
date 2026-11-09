import Image from "next/image";
import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className={`brand ${compact ? "brand-compact" : ""}`} aria-label="MINEFRAME, inicio">
    <Image src="/brand/mineframe-symbol.png" alt="Símbolo original de MINEFRAME" width={58} height={46} priority />
    {!compact && <span>MINEFRAME</span>}
  </Link>;
}

