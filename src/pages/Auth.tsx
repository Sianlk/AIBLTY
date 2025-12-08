import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AibltyLogo } from '@/components/aiblty/AibltyLogo';
import { GridBackground } from '@/components/atlas/GridBackground';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, ArrowLeft, AlertCircle, Sparkles, Zap, Shield, Rocket, Brain, Globe, Play, CheckCircle } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

type AuthMode = 'login' | 'register' | 'forgot';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

const features = [
  { icon: Sparkles, title: 'AI App Builder', desc: 'Generate full-stack apps instantly' },
  { icon: Brain, title: 'Intelligence Workspace', desc: 'Solve complex problems with AI' },
  { icon: Rocket, title: 'Business Generator', desc: 'Launch ventures with AI guidance' },
  { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade protection built-in' },
  { icon: Zap, title: 'Automation Engine', desc: 'Automate workflows effortlessly' },
  { icon: Globe, title: 'Global Network', desc: 'Deploy worldwide instantly' },
];

const demoFeatures = [
  'Generate SaaS apps in seconds',
  'AI-powered business planning',
  'Automated marketing workflows',
  'Enterprise-grade security',
];

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDemo, setShowDemo] = useState(false);
  
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }

    if (mode !== 'forgot') {
      try {
        passwordSchema.parse(password);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.password = e.errors[0].message;
        }
      }
    }

    if (mode === 'register' && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'linkedin_oidc') => {
    setSocialLoading(provider);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to sign in with ${provider}`,
        variant: 'destructive',
      });
      setSocialLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        toast({ title: 'Welcome back!', description: 'Successfully logged in.' });
        navigate(from, { replace: true });
      } else if (mode === 'register') {
        await register(email, password, name);
        toast({ title: 'Account created!', description: 'Welcome to AIBLTY.' });
        navigate('/dashboard', { replace: true });
      } else if (mode === 'forgot') {
        toast({ title: 'Reset link sent', description: 'Check your email for the reset link.' });
        setMode('login');
      }
    } catch (error: any) {
      let message = 'Something went wrong';
      
      if (error.message?.includes('Invalid login credentials')) {
        message = 'Invalid email or password';
      } else if (error.message?.includes('User already registered')) {
        message = 'An account with this email already exists';
      } else if (error.message) {
        message = error.message;
      }
      
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex">
      <GridBackground />
      
      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Features Preview & Demo - Left Side */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <div className="flex items-center gap-3 mb-6">
            <AibltyLogo className="w-10 h-10" />
            <span className="text-xl font-bold text-foreground">AIBLTY</span>
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-4">
            One Command.<br />
            <span className="text-primary">Infinite Possibilities.</span>
          </h2>
          
          <p className="text-muted-foreground mb-6">
            Transform ideas into production-ready SaaS, VoIP, CaaS, GPTs, and complete enterprises with the ultimate AI ability.
          </p>

          {/* Interactive Demo Preview */}
          <motion.div 
            className="mb-6 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => setShowDemo(!showDemo)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Play className="w-4 h-4 text-primary" />
              </div>
              <span className="font-semibold text-foreground">See AIBLTY in Action</span>
            </div>
            
            <motion.div
              initial={false}
              animate={{ height: showDemo ? 'auto' : 0, opacity: showDemo ? 1 : 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-2">
                {demoFeatures.map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: showDemo ? 1 : 0, x: showDemo ? 0 : -10 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-primary" />
                    {feature}
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {!showDemo && (
              <p className="text-xs text-muted-foreground mt-2">Click to preview capabilities</p>
            )}
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50"
              >
                <div className="p-2 rounded-md bg-primary/10">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg border border-primary/20 bg-primary/5">
            <p className="text-sm text-muted-foreground">
              <span className="text-primary font-semibold">Free tier available</span> — Start with 5 AI queries/day. Upgrade to Starter (£19), Pro (£49) or Elite (£199) for more.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Auth Form - Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-panel p-8 border-primary/20">
            <div className="text-center mb-6">
              <Link to="/" className="inline-block mb-4 lg:hidden">
                <AibltyLogo className="w-12 h-12 mx-auto" />
              </Link>
              <h1 className="text-2xl font-bold text-foreground">
                {mode === 'login' && 'Welcome Back'}
                {mode === 'register' && 'Create Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h1>
              <p className="text-muted-foreground mt-2">
                {mode === 'login' && 'Sign in to access your dashboard'}
                {mode === 'register' && 'Start building with AI-powered tools'}
                {mode === 'forgot' && 'Enter your email to receive a reset link'}
              </p>
            </div>

            {/* Social Login Buttons */}
            {mode !== 'forgot' && (
              <div className="space-y-3 mb-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full relative"
                  onClick={() => handleSocialLogin('google')}
                  disabled={!!socialLoading}
                >
                  {socialLoading === 'google' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full relative"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={!!socialLoading}
                >
                  {socialLoading === 'facebook' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Continue with Facebook
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full relative"
                  onClick={() => handleSocialLogin('linkedin_oidc')}
                  disabled={!!socialLoading}
                >
                  {socialLoading === 'linkedin_oidc' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="#0A66C2" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      Continue with LinkedIn
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-muted/50 border-border"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    required
                    className={`pl-10 bg-muted/50 border-border ${errors.email ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors(prev => ({ ...prev, password: '' }));
                      }}
                      required
                      className={`pl-10 bg-muted/50 border-border ${errors.password ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>
              )}

              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors(prev => ({ ...prev, confirmPassword: '' }));
                      }}
                      required
                      className={`pl-10 bg-muted/50 border-border ${errors.confirmPassword ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                variant="glow"
                className="w-full"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {mode === 'login' && 'Sign In'}
                {mode === 'register' && 'Create Account'}
                {mode === 'forgot' && 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              {mode === 'login' && (
                <>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                  <p className="mt-4 text-muted-foreground">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-primary hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </>
              )}
              {mode === 'register' && (
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to login
                </button>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-primary hover:underline">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}