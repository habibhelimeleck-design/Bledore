import Link from "next/link";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";

const FOOTER_LINKS = {
  "Plateforme": [
    { label: "Talents",         href: "/talents"  },
    { label: "Missions",        href: "/missions" },
    { label: "Process",         href: "#etapes"   },
    { label: "Tarifs",          href: "/tarifs"   },
  ],
  "Ressources": [
    { label: "Blog",        href: "/blog"       },
    { label: "Guides",      href: "/guides"     },
    { label: "Support",     href: "/aide"       },
    { label: "Communauté",  href: "/communaute" },
  ],
  "Légal": [
    { label: "CGU",                href: "/cgu"              },
    { label: "Confidentialité",    href: "/confidentialite"  },
    { label: "Cookies",            href: "/cookies"          },
    { label: "Contact",            href: "/contact"          },
  ],
};

const SOCIAL = [
  { label: "Instagram", Icon: Instagram, href: "#" },
  { label: "Facebook",  Icon: Facebook,  href: "#" },
  { label: "YouTube",   Icon: Youtube,   href: "#" },
  { label: "Twitter/X", Icon: Twitter,   href: "#" },
];

export default function FooterSection() {
  return (
    <footer
      role="contentinfo"
      style={{
        background: "#020b06",
        borderTop: "1px solid rgba(255,255,255,.05)",
        padding: "5rem 0 2rem",
      }}
    >
      <div className="container-xl">
        {/* Main grid */}
        <div className="grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 lg:gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="block w-fit mb-4">
              <span
                style={{
                  fontFamily: "var(--f-disp, 'Cormorant Garamond', serif)",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "white",
                  letterSpacing: "-0.01em",
                }}
              >
                E<span style={{ color: "#26d07c" }}>.</span>Talent
              </span>
            </Link>
            <p
              style={{
                fontSize: "0.9375rem",
                color: "rgba(255,255,255,.35)",
                lineHeight: 1.7,
                maxWidth: 260,
                marginBottom: "2rem",
                fontWeight: 300,
              }}
            >
              La plateforme de casting premium du Gabon et d&apos;Afrique Centrale.
            </p>
            <nav className="flex gap-2.5" aria-label="Réseaux sociaux">
              {SOCIAL.map(({ label, Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center transition-all duration-300 focus-visible:outline-2 focus-visible:outline-white/50 hover:border-em-600 hover:text-em-400"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,.1)",
                    color: "rgba(255,255,255,.4)",
                  }}
                >
                  <Icon size={14} aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="flex flex-col gap-6">
              <h4
                style={{
                  fontFamily: "var(--f-mono, 'DM Mono', monospace)",
                  fontSize: "0.625rem",
                  fontWeight: 400,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,.3)",
                }}
              >
                {group}
              </h4>
              <ul className="flex flex-col gap-3.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors duration-200 hover:text-white"
                      style={{
                        fontSize: "0.9rem",
                        color: "rgba(255,255,255,.4)",
                        fontWeight: 300,
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255,255,255,.05)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--f-mono, 'DM Mono', monospace)",
              fontSize: "0.625rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,.2)",
            }}
          >
            © {new Date().getFullYear()} E.Talent Gabon · Tous droits réservés
          </p>
          <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,.2)" }}>
            Fait avec soin au Gabon 🇬🇦
          </p>
        </div>
      </div>
    </footer>
  );
}