function Word({ text, offset }: { text: string; offset: number }) {
  return <span className="hero-word">{Array.from(text).map((letter, index) => <span key={index} className="hero-letter" style={{ animationDelay: String((offset + index) * 28) + "ms" }}>{letter}</span>)}</span>;
}

export function AnimatedHeroTitle() {
  return <h1 className="hero-title" aria-label="CADA FRAME CUENTA.">
    <span className="hero-title-row" aria-hidden="true"><Word text="CADA" offset={0} />{" "}<Word text="FRAME" offset={4} /></span>
    <span className="hero-title-row hero-title-muted" aria-hidden="true"><Word text="CUENTA." offset={9} /></span>
  </h1>;
}