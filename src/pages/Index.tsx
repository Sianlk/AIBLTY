import { GridBackground } from "@/components/atlas/GridBackground";
import { Header } from "@/components/aiblty/Header";
import { Footer } from "@/components/aiblty/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, Zap, TrendingUp, Settings, BarChart3, Rocket } from "lucide-react";

const modules = [
  { icon: Brain, title: "Intelligence Workspace", description: "AI-powered problem solving and analysis", status: "active" },
  { icon: Rocket, title: "Business Builder", description: "Create business plans and strategies", status: "active" },
  { icon: Zap, title: "Automation Engine", description: "Automate workflows and processes", status: "active" },
  { icon: TrendingUp, title: "Growth Suite", description: "Scale and optimize your operations", status: "ready" },
  { icon: BarChart3, title: "Insights Hub", description: "Analytics and performance tracking", status: "ready" },
  { icon: Settings, title: "Operations Center", description: "Manage and deploy your projects", status: "ready" },
];

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <GridBackground />
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center pt-20">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-primary">AIBLTY</span>
                <br />
                <span className="text-foreground">AI-Powered Ability</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Build, automate, and scale your business with intelligent AI tools. 
                From problem-solving to business creation — all in one platform.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" variant="glow">Get Started Free</Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline">View Pricing</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20" id="features">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Capability Matrix</h2>
              <p className="text-muted-foreground">Powerful modules to accelerate your success</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, i) => (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-6 hover:border-primary/50 transition-colors"
                >
                  <module.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                  <span className={`inline-block mt-4 text-xs px-2 py-1 rounded ${
                    module.status === 'active' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {module.status === 'active' ? 'Available' : 'Coming Soon'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
