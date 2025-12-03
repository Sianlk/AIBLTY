import { GridBackground } from "@/components/atlas/GridBackground";
import { Header } from "@/components/atlas/Header";
import { HeroSection } from "@/components/atlas/HeroSection";
import { LiveMetrics } from "@/components/atlas/LiveMetrics";
import { ModulesSection } from "@/components/atlas/ModulesSection";
import { AutonomousFeatures } from "@/components/atlas/AutonomousFeatures";
import { RevenueShowcase } from "@/components/atlas/RevenueShowcase";
import { TerminalDisplay } from "@/components/atlas/TerminalDisplay";
import { Footer } from "@/components/atlas/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden noise-overlay">
      <GridBackground />
      <Header />
      <main>
        <HeroSection />
        <LiveMetrics />
        <ModulesSection />
        <AutonomousFeatures />
        <RevenueShowcase />
        <TerminalDisplay />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
