"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Talents",   href: "#talents"  },
  { label: "Missions",  href: "#missions" },
  { label: "Process",   href: "#etapes"   },
  { label: "Pourquoi nous", href: "#pourquoi" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[rgba(3,15,10,0.88)] backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="container-xl">
        <nav className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="E.Talent accueil">
            <div className="w-9 h-9 rounded-xl bg-em-400 flex items-center justify-center shadow-medium group-hover:bg-em-300 transition-colors duration-250">
              <span className="text-ink font-heading font-800 text-sm tracking-tight">E</span>
            </div>
            <span className="font-heading font-700 text-xl tracking-tight text-white">
              E.<span className="text-em-400">Talent</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-body text-[0.8125rem] font-500 text-white/55 hover:text-white transition-colors duration-200 tracking-[0.04em] uppercase"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/connexion"
              className="inline-flex items-center gap-2 px-[1.375rem] py-[0.6rem] rounded-full text-[0.8125rem] font-500 border border-white/20 text-white/70 hover:border-em-400 hover:text-em-400 transition-all duration-300"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 px-[1.375rem] py-[0.6rem] rounded-full text-[0.8125rem] font-600 bg-em-400 text-ink hover:bg-em-300 transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(38,208,124,0.3)]"
            >
              Commencer →
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{   opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-[rgba(3,15,10,0.95)] backdrop-blur-xl border-b border-white/[0.08]"
          >
            <div className="container-xl py-5 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-body text-base font-500 text-white/60 hover:text-white transition-colors py-2 border-b border-white/[0.06] last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                <Link href="/connexion"  className="flex-1 text-center px-4 py-2.5 rounded-full text-sm border border-white/20 text-white/70 hover:border-em-400 hover:text-em-400 transition-all">Connexion</Link>
                <Link href="/inscription" className="flex-1 text-center px-4 py-2.5 rounded-full text-sm font-600 bg-em-400 text-ink hover:bg-em-300 transition-all">Commencer →</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
