import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AibltyLogo } from '@/components/aiblty/AibltyLogo';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, FolderOpen, Brain, Rocket, Zap, 
  BarChart3, Settings, LogOut, Menu, X, Shield, 
  CreditCard, ChevronDown, User, Bot, Atom, Search,
  DollarSign, Plug, Megaphone, Sparkles, Network, Lock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FolderOpen, label: 'Projects', href: '/dashboard/projects' },
  { icon: Brain, label: 'Intelligence', href: '/dashboard/solver' },
  { icon: Rocket, label: 'App Builder', href: '/dashboard/builder' },
  { icon: Search, label: 'Research', href: '/dashboard/research' },
  { icon: DollarSign, label: 'Revenue', href: '/dashboard/revenue' },
  { icon: Zap, label: 'Automation', href: '/dashboard/automation' },
  { icon: Plug, label: 'Integrations', href: '/dashboard/integrations' },
  { icon: Bot, label: 'AI Workforce', href: '/dashboard/ai-workforce' },
  { icon: Atom, label: 'Quantum', href: '/dashboard/quantum' },
  { icon: Lock, label: 'Security', href: '/dashboard/security' },
  { icon: Sparkles, label: 'Evolution', href: '/dashboard/evolution' },
  { icon: Network, label: 'Network', href: '/dashboard/network' },
  { icon: Megaphone, label: 'Social', href: '/dashboard/social' },
  { icon: BarChart3, label: 'Insights', href: '/dashboard/insights' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border
        transform transition-transform duration-200 ease-in-out overflow-y-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border sticky top-0 bg-sidebar z-10">
            <Link to="/" className="flex items-center gap-3">
              <AibltyLogo className="w-8 h-8" />
              <span className="text-xl font-bold text-foreground">AIBLTY</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm
                    ${isActive 
                      ? 'bg-sidebar-accent text-sidebar-primary' 
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    }
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            {user?.role === 'admin' && (
              <>
                <div className="pt-4 mt-4 border-t border-sidebar-border">
                  <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Admin
                  </p>
                  <Link
                    to="/admin"
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm
                      ${location.pathname.startsWith('/admin')
                        ? 'bg-sidebar-accent text-sidebar-primary' 
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      }
                    `}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">Admin Panel</span>
                  </Link>
                </div>
              </>
            )}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-sidebar-border space-y-2 sticky bottom-0 bg-sidebar">
            <Link
              to="/dashboard/settings"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors text-sm"
            >
              <Settings className="w-4 h-4" />
              <span className="font-medium">Settings</span>
            </Link>
            <Link
              to="/pricing"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors text-sm"
            >
              <CreditCard className="w-4 h-4" />
              <span className="font-medium">Billing</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-muted rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="hidden md:inline text-sm">{user?.email}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  user?.plan === 'elite' ? 'bg-secondary/20 text-secondary' :
                  user?.plan === 'pro' ? 'bg-primary/20 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {user?.plan}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/dashboard/settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/pricing" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Upgrade Plan
                </Link>
              </DropdownMenuItem>
              {user?.role === 'admin' && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
