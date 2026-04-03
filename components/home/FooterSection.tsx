import Link from "next/link";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";

const FOOTER_LINKS = {
  "Plateforme": [
    { label: "Catalogue Talents",   href: "/talents"  },
    { label: "Missions ouvertes",   href: "/missions" },
    { label: "Comment ça marche",   href: "#etapes"   },
    { label: "Tarifs",              href: "/tarifs"   },
  ],
  "Ressources": [
    { label: "Blog",            href: "/blog"      },
    { label: "Guides talents",  href: "/guides"    },
    { label: "Aide & Support",  href: "/aide"      },
    { label: "Communauté",      href: "/communaute"},
  ],
  "Société": [
    { label: "À propos",         href: "/a-propos"  },
    { label: "Équipe",           href: "/equipe"    },
    { label: "Partenaires",      href: "/partenaires"},
    { label: "Contact",          href: "/contact"   },
  ],
  "Légal": [
    { label: "Conditions d'utilisation", href: "/cgu"             },
    { label: "Politique de confidentialité", href: "/confidentialite" },
    { label: "Cookies",                  href: "/cookies"         },
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
    <footer className="bg-[#0d2d29] text-forest-200">
      {/* Main footer */}
      <div className="container-xl py-16 lg:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-forest-600 flex items-center justify-center group-hover:bg-forest-500 transition-colors duration-250">
                <span className="text-white font-heading font-800 text-sm">W</span>
              </div>
              <span className="font-heading font-700 text-xl text-white tracking-tight">
                WeAct
              </span>
            </Link>
            <p className="font-body text-body-sm text-forest-300 leading-relaxed max-w-[220px]">
              La plateforme de casting et talents n°1 au Bénin et en Afrique de l'Ouest.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {SOCIAL.map(({ label, Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/8 hover:bg-forest-600 flex items-center justify-center transition-all duration-250 focus-visible:outline-2 focus-visible:outline-white/50"
                >
                  <Icon size={15} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="flex flex-col gap-4">
              <h3 className="font-heading font-600 text-sm text-white uppercase tracking-widest">
                {group}
              </h3>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-body text-body-sm text-forest-300 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container-xl py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-forest-400">
            © {new Date().getFullYear()} WeAct Bénin. Tous droits réservés.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="font-body text-xs text-forest-400">Fait avec</span>
            <span className="text-gold-DEFAULT text-xs">♥</span>
            <span className="font-body text-xs text-forest-400">au Bénin 🇧🇯</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
