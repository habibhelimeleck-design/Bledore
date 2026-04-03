import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "E.Talent — La plateforme de casting du Gabon",
    template: "%s | E.Talent",
  },
  description:
    "Découvrez ou rejoignez les meilleurs talents du Gabon. E.Talent connecte talents, influenceurs et créateurs avec les recruteurs, marques et producteurs gabonais.",
  keywords: ["casting Gabon", "talents Gabon", "E.Talent", "acteurs", "mannequins", "influenceurs", "recruteurs", "Libreville"],
  openGraph: {
    title: "E.Talent — La plateforme de casting du Gabon",
    description: "La plateforme premium qui connecte les talents gabonais avec les recruteurs et producteurs.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
