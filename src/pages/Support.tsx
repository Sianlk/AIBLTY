import { Header } from '@/components/aiblty/Header';
import { Footer } from '@/components/aiblty/Footer';
import { GridBackground } from '@/components/atlas/GridBackground';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SupportPage() {
  return (
    <div className="relative min-h-screen bg-background">
      <GridBackground />
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4"><span className="gradient-text">Support</span></h1>
            <p className="text-muted-foreground">We're here to help you succeed</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with our team', action: 'Start Chat' },
              { icon: Mail, title: 'Email Support', desc: 'support@aiblty.com', action: 'Send Email' },
              { icon: FileText, title: 'Knowledge Base', desc: 'Browse FAQs and guides', action: 'View Docs' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-panel p-6 text-center">
                <item.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
                <Button variant="outline" className="w-full">{item.action}</Button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
