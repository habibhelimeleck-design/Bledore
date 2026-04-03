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
  // Duplicate items to create seamless loop
  const track = [...ITEMS, ...ITEMS];

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden"
      style={{
        padding: "1.25rem 0",
        background: "#071a10",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex whitespace-nowrap" style={{ animation: "marquee 28s linear infinite" }}>
        {track.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-8"
            style={{
              padding: "0 2.5rem",
              fontFamily: "var(--f-mono, 'DM Mono', monospace)",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            {item.label}
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "0.875rem" }}>·</span>
            <span style={{ color: "#7de8b4", fontWeight: 400 }}>{item.highlight}</span>
          </span>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}