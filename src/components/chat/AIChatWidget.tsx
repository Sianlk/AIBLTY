import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { useToast } from "@/hooks/use-toast";
import { sendAIMessage, type Message, type AIMode } from "@/lib/aiService";
import { useUsageTracking } from "@/hooks/useUsageTracking";
import { useAuth } from "@/contexts/AuthContext";
import { getOrCreateConversation, getChatMessages, addChatMessage, logEvent, createProject } from "@/lib/database";
import { Link } from "react-router-dom";
import {
  MessageSquare,
  Send,
  X,
  Loader2,
  Bot,
  User,
  Sparkles,
  Minimize2,
  Maximize2,
  Crown,
  Zap,
  Lock,
  Plus,
} from "lucide-react";

interface AIChatWidgetProps {
  mode?: AIMode;
  title?: string;
  placeholder?: string;
  systemContext?: string;
}

export function AIChatWidget({
  mode = "general",
  title = "AIBLTY Assistant",
  placeholder = "Ask AIBLTY anything...",
}: AIChatWidgetProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const { usage, isLimitReached, incrementUsage, checkUsage } = useUsageTracking();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && user) {
      checkUsage();
      loadConversation();
    }
  }, [isOpen, user]);

  const loadConversation = async () => {
    if (!user) return;
    try {
      const conversation = await getOrCreateConversation();
      setConversationId(conversation.id);
      
      // Load existing messages
      const existingMessages = await getChatMessages(conversation.id);
      if (existingMessages.length > 0) {
        setMessages(existingMessages.map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })));
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
      logEvent('chat', 'Failed to load conversation', 'error', { error: String(error) });
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check if user is authenticated
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to use AIBLTY AI features",
        variant: "destructive",
      });
      return;
    }

    // Check token limit
    if (isLimitReached) {
      toast({
        title: "Daily limit reached",
        description: "Upgrade your plan for more AI tokens",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Check for project creation command
    const createProjectMatch = input.match(/create (?:a )?project (?:called |named )?"?([^"]+)"?/i);

    try {
      // Persist user message
      if (conversationId) {
        await addChatMessage(conversationId, 'user', input.trim());
      }

      // Handle project creation command
      if (createProjectMatch) {
        const projectName = createProjectMatch[1].trim();
        try {
          const project = await createProject(projectName);
          const successMessage = `✅ Created project "${projectName}" successfully! You can view it in your [Projects](/dashboard/projects) page.`;
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: successMessage },
          ]);
          if (conversationId) {
            await addChatMessage(conversationId, 'assistant', successMessage);
          }
          toast({
            title: "Project Created",
            description: `"${projectName}" has been created`,
          });
          logEvent('chat', 'Created project from chat', 'info', { projectId: project.id, projectName });
        } catch (error) {
          const errorMessage = `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`;
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: errorMessage },
          ]);
          toast({
            title: "Error",
            description: "Failed to create project",
            variant: "destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      // Regular AI message
      const response = await sendAIMessage(newMessages, mode);

      if (response.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.content },
        ]);
        
        // Persist assistant message
        if (conversationId) {
          await addChatMessage(conversationId, 'assistant', response.content);
        }
        
        // Increment usage after successful response
        await incrementUsage(1);
        logEvent('chat', 'AI response received', 'info', { mode });
      } else {
        if (response.error?.includes("Daily token limit")) {
          toast({
            title: "Daily limit reached",
            description: "Upgrade your plan for more AI tokens",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: response.error || "Failed to get response",
            variant: "destructive",
          });
        }
        logEvent('chat', `AI error: ${response.error}`, 'error', { mode });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to AI service",
        variant: "destructive",
      });
      logEvent('chat', 'AI connection error', 'error', { error: String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  if (!isOpen) {
    return (
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark text-background shadow-[0_4px_20px_hsl(var(--gold-dark)/0.5),0_0_40px_hsl(var(--gold)/0.25)] flex items-center justify-center hover:shadow-[0_6px_30px_hsl(var(--gold-dark)/0.6),0_0_60px_hsl(var(--gold)/0.35)] transition-shadow"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        height: isMinimized ? "auto" : "500px",
      }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] premium-card overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gold/20 bg-gradient-to-r from-muted/50 via-gold/5 to-muted/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center border border-gold/30">
            <Sparkles className="w-5 h-5 text-gold-light" />
          </div>
          <div>
            <h3 className="font-bold text-champagne text-sm">{title}</h3>
            <p className="text-xs text-platinum-dark">Powered by AIBLTY</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-gold/30 mx-auto mb-4" />
                  <p className="text-sm text-platinum-dark mb-4">
                    Ask me anything. I'm here to help.
                  </p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>💡 Try: "Create a project called My App"</p>
                    <p>💡 Try: "Help me solve a business problem"</p>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center flex-shrink-0 border border-gold/30">
                      <Bot className="w-4 h-4 text-gold-light" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-gold/30 to-gold-dark/30 text-champagne border border-gold/30"
                        : "bg-muted/50 text-foreground border border-border/50"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <MarkdownRenderer content={msg.content} className="text-sm" />
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-muted/30 to-gold-dark/30 flex items-center justify-center flex-shrink-0 border border-gold/40">
                      <User className="w-4 h-4 text-gold-light" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold-dark/20 flex items-center justify-center border border-gold/30">
                    <Loader2 className="w-4 h-4 text-gold-light animate-spin" />
                  </div>
                  <div className="bg-muted/50 rounded-xl px-4 py-2.5 text-sm border border-border/50">
                    <div className="flex items-center gap-2">
                      <span className="text-platinum-dark">Thinking</span>
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Usage indicator */}
            {user && usage && (
              <div className="px-4 py-2 border-t border-gold/10 bg-muted/20">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-primary" />
                    <span className="text-muted-foreground">
                      {usage.dailyLimit === 'unlimited' ? (
                        <span className="text-primary">Unlimited tokens</span>
                      ) : (
                        <span>{usage.remaining}/{usage.dailyLimit} tokens remaining</span>
                      )}
                    </span>
                  </div>
                  {usage.plan === 'free' && (
                    <Link to="/dashboard/billing" className="text-primary hover:underline flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Upgrade
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Login prompt for non-authenticated users */}
            {!user && (
              <div className="p-4 border-t border-gold/20 bg-muted/20">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to use AI features
                  </span>
                </div>
              </div>
            )}

            {/* Limit reached prompt */}
            {user && isLimitReached && (
              <div className="p-4 border-t border-destructive/30 bg-destructive/10">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Crown className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">
                    Daily limit reached. <Link to="/dashboard/billing" className="text-primary hover:underline">Upgrade now</Link>
                  </span>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gold/20 bg-gradient-to-r from-muted/30 via-transparent to-muted/30">
              <div className="flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={!user ? "Sign in to chat..." : isLimitReached ? "Upgrade to continue..." : placeholder}
                  className="min-h-[44px] max-h-24 resize-none bg-muted/50 border-gold/20 focus:border-gold/50"
                  disabled={isLoading || !user || isLimitReached}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || !user || isLimitReached}
                  className="h-11 w-11 shrink-0"
                  variant="glow"
                  size="icon"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
