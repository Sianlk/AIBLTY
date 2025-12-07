import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AibltyLogo } from "./AibltyLogo";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Platform", href: "/#features" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { 
    label: "Resources", 
    children: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api" },
      { label: "Support", href: "/support" },
    ]
  },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user } = useAuth();
  const location = useLocation();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4"
    >
      <div className="glass-panel px-4 md:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <AibltyLogo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <div key={link.label} className="relative">
              {link.children ? (
                <div
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-48 glass-panel p-2"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            className="block px-3 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Status Badge */}
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="text-primary">v1.0</span>
          <span>|</span>
          <span>PLATFORM ACTIVE</span>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2">
          {user ? (
            <Link to="/dashboard">
              <Button variant="glow" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/auth" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="glow" size="sm" className="gap-2">
                  <span>Get Started</span>
                </Button>
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-panel mt-2 overflow-hidden"
          >
            <nav className="p-4 space-y-2">
              {navLinks.map((link) => (
                <div key={link.label}>
                  {link.children ? (
                    <div className="space-y-1">
                      <p className="px-3 py-2 text-sm font-medium text-foreground">{link.label}</p>
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-6 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-2 border-t border-border">
                <Link to="/terms" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
                <Link to="/privacy" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
