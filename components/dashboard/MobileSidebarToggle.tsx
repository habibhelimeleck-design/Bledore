"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import type { Profile } from "@/lib/types/database";

interface Props {
  profile: Profile;
  role: "talent" | "producer";
}

export default function MobileSidebarToggle({ profile, role }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 rounded-xl bg-white shadow-card border border-[var(--border)] flex items-center justify-center"
        aria-label="Ouvrir le menu"
      >
        <Menu size={18} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink/40 z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 lg:hidden animate-fade-in">
            <div className="h-full relative">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white"
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
              <Sidebar profile={profile} role={role} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
