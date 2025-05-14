import Scene3D from "./_components/scene-3d";
import HeroSection from "./_components/hero-section";
import FeatureSection from "./_components/features";
import Footer from "./_components/footer";
import CTA_Section from "./_components/cta";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <Scene3D />
      <HeroSection />
      <FeatureSection />
      <CTA_Section />
      <Footer />
    </div>
  );
}
