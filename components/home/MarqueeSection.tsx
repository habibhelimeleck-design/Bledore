"use client";

import { useRef, useEffect } from "react";

const ITEMS = [
  { label: "Acteurs",       highlight: "Libreville"  },
  { label: "Mannequins",    highlight: "Port-Gentil" },
  { label: "Voix off",      highlight: "Franceville" },
  { label: "Danseurs",      highlight: "Oyem"        },
  { label: "Présentateurs", highlight: "Gabon"       },
  { label: "Influenceurs",  highlight: "Africa"      },
  { label: "Comédiens",     highlight: "Libreville"  },
  { label: "Photographes",  highlight: "E.Talent"    },
];

export default function MarqueeSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let x = 0;
    let raf: number;

    const tick = () => {
      x -= 0.5;
      // Loop: 3 copies → reset after 1 copy width (= totalWidth / 3)
      const oneWidth = el.scrollWidth / 3;
      if (Math.abs(x) >= oneWidth) x = 0;
      el.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Triple items pour loop seamless
  const track = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <div
      aria-hidden="true"
      style={{
        padding: "1.25rem 0",
        background: "#071a10",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          flexWrap: "nowrap",
          width: "max-content",
          willChange: "transform",
        }}
      >
        {track.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "2rem",
              padding: "0 2.5rem",
              flexShrink: 0,
              fontFamily: "var(--f-mono, 'DM Mono', monospace)",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.875rem" }}>·</span>
            <span style={{ color: "#7de8b4", fontWeight: 400 }}>{item.highlight}</span>
          </span>
        ))}
      </div>
    </div>
  );
}