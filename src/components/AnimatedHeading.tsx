import { useEffect, useState } from "react";

export function AnimatedHeading({
  text,
  className = "",
  startDelay = 200,
}: {
  text: string;
  className?: string;
  startDelay?: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  const lines = text.split("\n");
  let globalIndex = 0;
  return (
    <h1 className={className} style={{ letterSpacing: "-0.04em" }}>
      {lines.map((line, lineIndex) => {
        const words = line.split(/(\s+)/);
        return (
          <span key={lineIndex} className="block">
            {words.map((word, wordIndex) => (
              <span
                key={wordIndex}
                style={{ display: "inline-block", whiteSpace: "pre" }}
              >
                {word.split("").map((char, charIndex) => {
                  const delay = globalIndex++ * 30;
                  return (
                    <span
                      key={charIndex}
                      style={{
                        display: "inline-block",
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateX(0)" : "translateX(-18px)",
                        transition: `opacity 500ms ease ${delay}ms, transform 500ms ease ${delay}ms`,
                        whiteSpace: "pre",
                      }}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            ))}
          </span>
        );
      })}
    </h1>
  );
}
