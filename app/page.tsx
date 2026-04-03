import NavBar               from "@/components/home/NavBar";
import HeroSection          from "@/components/home/HeroSection";
import EtapesSection        from "@/components/home/EtapesSection";
import TalentsSection       from "@/components/home/TalentsSection";
import MissionsSection      from "@/components/home/MissionsSection";
import PourquoiSection      from "@/components/home/PourquoiSection";
import TestimonialsSection  from "@/components/home/TestimonialsSection";
import CTASection           from "@/components/home/CTASection";
import FooterSection        from "@/components/home/FooterSection";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main id="main-content">
        <HeroSection />
        <EtapesSection />
        <TalentsSection />
        <MissionsSection />
        <PourquoiSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <FooterSection />
    </>
  );
}
