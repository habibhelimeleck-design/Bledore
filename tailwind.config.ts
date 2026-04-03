import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── E.Talent Emerald Deep Palette ─────────────────────────
        ink:   "#030f0a",
        em: {
          950: "#020a06",
          900: "#063d1e",
          800: "#0a5229",
          700: "#0d6637",
          600: "#138a48",
          500: "#1a9958",
          400: "#26d07c",
          300: "#7de8b4",
          200: "#b8f4d6",
          100: "#e4faf0",
          50:  "#f2fdf7",
        },
        // ── Gold ─────────────────────────────────────────────────
        gold: {
          DEFAULT: "#d4a843",
          light:   "#e8c56a",
          dark:    "#a8832e",
          muted:   "rgba(212,168,67,0.15)",
        },
        // ── Neutral Sand ─────────────────────────────────────────
        sand: {
          50:  "#faf8f5",
          100: "#f5f1ea",
          200: "#ebe3d5",
          300: "#d6c9b2",
          400: "#b9a88a",
          500: "#9d8b6e",
          600: "#7d6e54",
          700: "#5e5240",
          800: "#3d3629",
          900: "#1e1b14",
        },
        // ── Semantic tokens ───────────────────────────────────────
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary:   { DEFAULT: "var(--primary)",   foreground: "var(--primary-foreground)" },
        muted:     { DEFAULT: "var(--muted)",      foreground: "var(--muted-foreground)" },
        accent:    { DEFAULT: "var(--accent)",     foreground: "var(--accent-foreground)" },
        border: "var(--border)",
        ring:   "var(--ring)",
        card:   { DEFAULT: "var(--card)",          foreground: "var(--card-foreground)" },
        danger: { DEFAULT: "#dc2626",              foreground: "#fff" },
        success:{ DEFAULT: "#16a34a",              foreground: "#fff" },
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "Georgia", "serif"],
        body:    ["var(--font-dm-sans)",   "system-ui", "sans-serif"],
        mono:    ["var(--font-dm-mono)",   "monospace"],
        sans:    ["var(--font-dm-sans)",   "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem,8vw,6rem)",    { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.5rem,6vw,4.5rem)",{ lineHeight: "1.08", letterSpacing: "-0.025em" }],
        "display":    ["clamp(2rem,4vw,3rem)",    { lineHeight: "1.1",  letterSpacing: "-0.02em" }],
        "h1": ["clamp(1.75rem,3vw,2.5rem)", { lineHeight: "1.15" }],
        "h2": ["clamp(1.5rem,2.5vw,2rem)",  { lineHeight: "1.2"  }],
        "h3": ["clamp(1.25rem,2vw,1.5rem)", { lineHeight: "1.3"  }],
        "body-xl": ["1.125rem", { lineHeight: "1.75" }],
        "body-lg": ["1rem",     { lineHeight: "1.75" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6"  }],
        "label":   ["0.75rem",  { lineHeight: "1.5", letterSpacing: "0.1em" }],
      },
      spacing: {
        "section": "clamp(4rem,7vw,7rem)",
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "112": "28rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "em-sm":      "0 2px 8px 0 rgba(3,15,10,0.3)",
        "em-md":      "0 4px 20px 0 rgba(3,15,10,0.4)",
        "em-lg":      "0 8px 40px 0 rgba(3,15,10,0.5)",
        "gold-sm":    "0 2px 8px 0 rgba(212,168,67,0.25)",
        "gold-md":    "0 4px 20px 0 rgba(212,168,67,0.35)",
        "glow-em":    "0 0 30px rgba(38,208,124,0.15)",
        "card":       "0 1px 3px rgba(3,15,10,0.06), 0 4px 16px rgba(3,15,10,0.04)",
        "card-hover": "0 4px 24px rgba(3,15,10,0.10), 0 1px 3px rgba(3,15,10,0.06)",
        "soft":       "0 2px 20px rgba(3,15,10,0.06)",
        "medium":     "0 8px 40px rgba(3,15,10,0.10)",
      },
      backgroundImage: {
        "em-gradient":   "linear-gradient(135deg, #063d1e 0%, #030f0a 60%)",
        "em-radial":     "radial-gradient(ellipse at top, #0d6637 0%, #030f0a 70%)",
        "gold-gradient": "linear-gradient(135deg, #d4a843, #e8c56a)",
        "sand-gradient": "linear-gradient(180deg, #faf8f5 0%, #f5f1ea 100%)",
      },
      animation: {
        "fade-up":    "fadeUp 0.5s ease-out both",
        "fade-in":    "fadeIn 0.4s ease-out both",
        "scale-in":   "scaleIn 0.3s ease-out both",
        "shimmer":    "shimmer 1.8s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:  { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        fadeIn:  { from: { opacity: "0" },                                 to: { opacity: "1" } },
        scaleIn: { from: { opacity: "0", transform: "scale(0.95)" },       to: { opacity: "1", transform: "scale(1)" } },
        shimmer: { "0%": { backgroundPosition: "-1000px 0" }, "100%": { backgroundPosition: "1000px 0" } },
      },
      transitionDuration: { "250": "250ms", "350": "350ms", "400": "400ms" },
      maxWidth: { "8xl": "88rem" },
    },
  },
  plugins: [],
};

export default config;
