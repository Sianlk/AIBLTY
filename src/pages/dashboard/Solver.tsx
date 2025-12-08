import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { motion, AnimatePresence } from 'framer-motion';
import { sendAIMessage, type Message } from '@/lib/aiService';
import { useToast } from '@/hooks/use-toast';
import { Brain, Send, Loader2, Sparkles, Copy, Check, RefreshCw, Bot, User } from 'lucide-react';

export default function SolverPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await sendAIMessage(newMessages, 'solver');
      
      if (response.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.content }]);
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to get AI response',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to solve problem',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = () => {
    const lastAssistant = messages.filter(m => m.role === 'assistant').pop();
    if (lastAssistant) {
      navigator.clipboard.writeText(lastAssistant.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: 'Copied', description: 'Response copied to clipboard' });
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInput('');
  };

  const examples = [
    'How can I improve customer retention for my SaaS product?',
    'What are the best strategies for entering a new market?',
    'How do I optimize my supply chain for faster delivery?',
    'What pricing model would work best for a B2B software product?',
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center mx-auto mb-4 border border-gold/30">
            <Brain className="w-8 h-8 text-gold-light" />
          </div>
          <h1 className="text-3xl font-bold mb-2 gradient-text-premium font-display">Intelligence Workspace</h1>
          <p className="text-platinum-dark">
            Describe your problem and let AI analyze it with comprehensive solutions
          </p>
        </motion.div>

        {/* Chat Messages */}
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 max-h-[500px] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2 text-champagne">
                <Brain className="w-5 h-5 text-gold" />
                Conversation
              </h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center flex-shrink-0 border border-gold/30">
                    <Bot className="w-5 h-5 text-gold-light" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-gold/20 to-gold-dark/20 text-champagne border border-gold/30'
                    : 'bg-muted/50 text-foreground border border-border/50'
                }`}>
                  {msg.role === 'assistant' ? (
                    <MarkdownRenderer content={msg.content} />
                  ) : (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/30 to-glow-elite/30 flex items-center justify-center flex-shrink-0 border border-secondary/40">
                    <User className="w-5 h-5 text-secondary" />
                  </div>
                )}
              </motion.div>
            ))}

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center border border-gold/30">
                  <Loader2 className="w-5 h-5 text-gold-light animate-spin" />
                </div>
                <div className="bg-muted/50 rounded-2xl px-5 py-3 border border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="text-platinum-dark">Analyzing problem</span>
                    <span className="flex gap-1">
                      <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </motion.div>
        )}

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-6"
        >
          <Textarea
            placeholder="Describe your problem or challenge in detail..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            className="bg-muted/50 border-gold/20 focus:border-gold/50 resize-none mb-4"
            disabled={loading}
          />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Button onClick={handleSubmit} variant="glow" disabled={loading || !input.trim()}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Analyzing...' : 'Solve Problem'}
            </Button>
          </div>
        </motion.div>

        {/* Example Prompts */}
        {messages.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-platinum-dark mb-3">Try these examples:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setInput(example)}
                  className="text-left p-4 glass-panel-hover text-sm group"
                >
                  <Sparkles className="w-4 h-4 text-gold inline mr-2 group-hover:text-gold-light transition-colors" />
                  <span className="text-platinum group-hover:text-champagne transition-colors">{example}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
}
