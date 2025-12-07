import { Header } from '@/components/aiblty/Header';
import { Footer } from '@/components/aiblty/Footer';
import { GridBackground } from '@/components/atlas/GridBackground';
import { motion } from 'framer-motion';
import { Book, Code, Rocket, Zap, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  { icon: Rocket, title: 'Getting Started', desc: 'Quick start guide to building with AIBLTY', href: '#getting-started' },
  { icon: Code, title: 'API Reference', desc: 'Complete API documentation', href: '/api' },
  { icon: Zap, title: 'Automation', desc: 'Learn to automate workflows', href: '#automation' },
  { icon: FileText, title: 'Guides', desc: 'Step-by-step tutorials', href: '#guides' },
];

export default function DocsPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <GridBackground />
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <Book className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4"><span className="gradient-text">Documentation</span></h1>
            <p className="text-muted-foreground">Everything you need to build with AIBLTY</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={s.href} className="glass-panel-hover p-6 flex items-start gap-4 block">
                  <s.icon className="w-8 h-8 text-primary shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
