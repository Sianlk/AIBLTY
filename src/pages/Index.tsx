import { GridBackground } from "@/components/atlas/GridBackground";
import { Header } from "@/components/atlas/Header";
import { HeroSection } from "@/components/atlas/HeroSection";
import { ModulesSection } from "@/components/atlas/ModulesSection";
import { TerminalDisplay } from "@/components/atlas/TerminalDisplay";
import { Footer } from "@/components/atlas/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <GridBackground />
      <Header />
      <main>
        <HeroSection />
        <ModulesSection />
        <TerminalDisplay />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
