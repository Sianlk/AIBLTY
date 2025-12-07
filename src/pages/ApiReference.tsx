import { Header } from '@/components/aiblty/Header';
import { Footer } from '@/components/aiblty/Footer';
import { GridBackground } from '@/components/atlas/GridBackground';
import { motion } from 'framer-motion';
import { Code, Terminal } from 'lucide-react';

export default function ApiReferencePage() {
  return (
    <div className="relative min-h-screen bg-background">
      <GridBackground />
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <Code className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4"><span className="gradient-text">API Reference</span></h1>
            <p className="text-muted-foreground">Complete API documentation for developers</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-primary" />
              <span className="font-mono text-sm">Base URL: https://api.aiblty.com/v1</span>
            </div>
            <div className="space-y-4">
              {['GET /projects', 'POST /projects', 'POST /ai/solve', 'POST /ai/build', 'GET /workflows'].map(endpoint => (
                <div key={endpoint} className="p-4 bg-muted/30 rounded-lg font-mono text-sm">{endpoint}</div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
