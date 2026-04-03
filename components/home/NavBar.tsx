"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Talents",   href: "#talents"  },
  { label: "Missions",  href: "#missions" },
  { label: "Comment ça marche", href: "#etapes" },
  { label: "À propos",  href: "#pourquoi" },
];

export default function NavBar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-350 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#dde0dc] shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container-xl">
        <nav className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-forest-700 flex items-center justify-center shadow-medium group-hover:bg-forest-600 transition-colors duration-250">
              <span className="text-white font-heading font-800 text-sm tracking-tight">W</span>
            </div>
            <span
              className={`font-heading font-700 text-xl tracking-tight transition-colors duration-250 ${
                scrolled ? "text-forest-700" : "text-forest-700"
              }`}
            >
              WeAct
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-body text-sm font-500 text-[#3d3d3d] hover:text-forest-700 transition-colors duration-200 relative after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-[1.5px] after:bg-forest-700 after:transition-all after:duration-250 hover:after:w-full"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/connexion" className="btn-outline py-2.5 px-5 text-sm">
              Connexion
            </Link>
            <Link href="/inscription" className="btn-primary py-2.5 px-5 text-sm">
              Commencer
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-forest-700 hover:bg-forest-50 transition-colors duration-200"
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
            className="md:hidden overflow-hidden bg-white border-b border-[#dde0dc]"
          >
            <div className="container-xl py-5 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-body text-base font-500 text-[#1a1a1a] hover:text-forest-700 transition-colors py-2 border-b border-[#f0f1ed] last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                <Link href="/connexion"  className="btn-outline  flex-1 text-center py-2.5 text-sm">Connexion</Link>
                <Link href="/inscription" className="btn-primary flex-1 text-center py-2.5 text-sm">Commencer</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
